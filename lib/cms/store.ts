import { promises as fs } from "fs";
import path from "path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { CMS_KEYS, type CmsBundle, type CmsKey, type CmsStorageBackend } from "@/lib/cms/types";
import { getSeedBundle } from "@/lib/cms/seed";
import { isEphemeralHost, PERSISTENT_STORAGE_HELP } from "@/lib/runtime";

const DATA_DIR = path.join(process.cwd(), "data", "cms");
const DRAFT_DIR = path.join(DATA_DIR, "drafts");

export type CmsWriteMode = "published" | "draft";

let supabaseClient: SupabaseClient | null | undefined;

function supabaseAdmin() {
  if (supabaseClient !== undefined) return supabaseClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    supabaseClient = null;
    return null;
  }
  supabaseClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return supabaseClient;
}

export function getPreferredBackend(): CmsStorageBackend {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return "supabase";
  }
  return "filesystem";
}

function docId(key: CmsKey, mode: CmsWriteMode) {
  return mode === "draft" ? `draft:${key}` : key;
}

async function readFileDocument(key: CmsKey, mode: CmsWriteMode = "published") {
  try {
    const file =
      mode === "draft"
        ? path.join(DRAFT_DIR, `${key}.json`)
        : path.join(DATA_DIR, `${key}.json`);
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as CmsBundle[CmsKey];
  } catch {
    return null;
  }
}

async function writeFileDocument(
  key: CmsKey,
  payload: unknown,
  mode: CmsWriteMode = "published",
) {
  const dir = mode === "draft" ? DRAFT_DIR : DATA_DIR;
  await fs.mkdir(dir, { recursive: true });
  const file = path.join(dir, `${key}.json`);
  await fs.writeFile(file, JSON.stringify(payload, null, 2), "utf8");
}

async function deleteFileDocument(key: CmsKey, mode: CmsWriteMode) {
  try {
    const file =
      mode === "draft"
        ? path.join(DRAFT_DIR, `${key}.json`)
        : path.join(DATA_DIR, `${key}.json`);
    await fs.unlink(file);
  } catch {
    // ignore
  }
}

async function readSupabaseDocument(key: CmsKey, mode: CmsWriteMode = "published") {
  const client = supabaseAdmin();
  if (!client) return null;
  const { data, error } = await client
    .from("cms_documents")
    .select("payload")
    .eq("id", docId(key, mode))
    .maybeSingle();
  if (error) {
    console.error("[cms] supabase read failed", key, mode, error.message);
    return null;
  }
  return (data?.payload as CmsBundle[CmsKey] | undefined) ?? null;
}

async function writeSupabaseDocument(
  key: CmsKey,
  payload: unknown,
  mode: CmsWriteMode = "published",
) {
  const client = supabaseAdmin();
  if (!client) return false;
  const { error } = await client.from("cms_documents").upsert({
    id: docId(key, mode),
    payload,
    updated_at: new Date().toISOString(),
  });
  if (error) {
    console.error("[cms] supabase write failed", key, mode, error.message);
    return false;
  }
  return true;
}

async function deleteSupabaseDocument(key: CmsKey, mode: CmsWriteMode) {
  const client = supabaseAdmin();
  if (!client) return;
  await client.from("cms_documents").delete().eq("id", docId(key, mode));
}

export async function readDocument<K extends CmsKey>(
  key: K,
  mode: CmsWriteMode = "published",
): Promise<CmsBundle[K] | null> {
  const fromDb = await readSupabaseDocument(key, mode);
  if (fromDb) return fromDb as CmsBundle[K];
  const fromFile = await readFileDocument(key, mode);
  if (fromFile) return fromFile as CmsBundle[K];
  return null;
}

export async function writeDocument<K extends CmsKey>(
  key: K,
  payload: CmsBundle[K],
  mode: CmsWriteMode = "published",
) {
  const backend = getPreferredBackend();
  if (backend === "supabase") {
    const ok = await writeSupabaseDocument(key, payload, mode);
    if (!ok) {
      throw new Error(
        "Could not save to Supabase. Check that cms_documents exists and SUPABASE_SERVICE_ROLE_KEY is set.",
      );
    }
    if (!isEphemeralHost()) {
      try {
        await writeFileDocument(key, payload, mode);
      } catch {
        // optional local backup
      }
    }
    return;
  }

  if (isEphemeralHost()) {
    throw new Error(
      `Could not save website content. ${PERSISTENT_STORAGE_HELP}`,
    );
  }

  try {
    await writeFileDocument(key, payload, mode);
  } catch {
    throw new Error(
      `Could not save content files. ${PERSISTENT_STORAGE_HELP}`,
    );
  }
}

export async function discardDraft(key: CmsKey) {
  await deleteFileDocument(key, "draft");
  await deleteSupabaseDocument(key, "draft");
}

export async function publishDocument(key: CmsKey) {
  const draft = await readDocument(key, "draft");
  if (!draft) {
    throw new Error("No draft found to publish for this section.");
  }
  await writeDocument(key, draft as never, "published");
  await discardDraft(key);
  return draft;
}

export async function publishAllDrafts() {
  const published: CmsKey[] = [];
  for (const key of CMS_KEYS) {
    const draft = await readDocument(key, "draft");
    if (draft) {
      await writeDocument(key, draft as never, "published");
      await discardDraft(key);
      published.push(key);
    }
  }
  return published;
}

export async function listDraftKeys() {
  const keys: CmsKey[] = [];
  for (const key of CMS_KEYS) {
    const draft = await readDocument(key, "draft");
    if (draft != null) keys.push(key);
  }
  return keys;
}

export async function readBundle(options?: {
  includeDrafts?: boolean;
}): Promise<{
  bundle: CmsBundle;
  draftKeys: CmsKey[];
  backend: CmsStorageBackend;
}> {
  const seed = getSeedBundle();
  let usedStored = false;
  const draftKeys: CmsKey[] = [];

  const publishedDocs = await Promise.all(
    CMS_KEYS.map(async (key) => ({
      key,
      value: await readDocument(key, "published"),
    })),
  );

  for (const { key, value } of publishedDocs) {
    if (value != null) {
      usedStored = true;
      (seed as Record<string, unknown>)[key] = value;
    }
  }

  if (options?.includeDrafts) {
    const draftDocs = await Promise.all(
      CMS_KEYS.map(async (key) => ({
        key,
        value: await readDocument(key, "draft"),
      })),
    );
    for (const { key, value } of draftDocs) {
      if (value != null) {
        draftKeys.push(key);
        (seed as Record<string, unknown>)[key] = value;
      }
    }
  }

  const backend = usedStored || draftKeys.length
    ? getPreferredBackend() === "supabase"
      ? "supabase"
      : "filesystem"
    : "seed";

  return { bundle: seed, draftKeys, backend };
}

export async function resetDocument(key: CmsKey) {
  const seed = getSeedBundle();
  await writeDocument(key, seed[key] as never, "published");
  await discardDraft(key);
  return seed[key];
}
