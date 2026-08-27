import { NextResponse } from "next/server";
import { CMS_KEYS, type CmsKey } from "@/lib/cms/types";
import { getSeedBundle } from "@/lib/cms/seed";
import {
  discardDraft,
  getPreferredBackend,
  publishAllDrafts,
  publishDocument,
  readBundle,
  resetDocument,
  writeDocument,
  type CmsWriteMode,
} from "@/lib/cms/store";
import { revalidatePublicContent } from "@/lib/cms/revalidate-public";

function isCmsKey(value: string): value is CmsKey {
  return (CMS_KEYS as readonly string[]).includes(value);
}

export async function GET() {
  const { bundle, backend, draftKeys } = await readBundle({ includeDrafts: true });
  const published = await readBundle({ includeDrafts: false });
  return NextResponse.json({
    bundle,
    publishedBundle: published.bundle,
    draftKeys,
    backend,
    preferredBackend: getPreferredBackend(),
  });
}

export async function PUT(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | {
        key?: string;
        payload?: unknown;
        reset?: boolean;
        mode?: CmsWriteMode;
      }
    | null;

  const key = body?.key;
  if (!key || !isCmsKey(key)) {
    return NextResponse.json({ error: "Unknown content key." }, { status: 400 });
  }

  try {
    if (body?.reset) {
      const payload = await resetDocument(key);
      revalidatePublicContent();
      return NextResponse.json({ ok: true, key, payload });
    }

    if (body?.payload == null) {
      return NextResponse.json({ error: "Missing payload." }, { status: 400 });
    }

    const mode: CmsWriteMode = body.mode === "published" ? "published" : "draft";
    await writeDocument(key, body.payload as never, mode);
    if (mode === "published") {
      revalidatePublicContent();
    }
    return NextResponse.json({ ok: true, key, mode });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Save failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | {
        resetAll?: boolean;
        publish?: boolean;
        publishKey?: string;
        discardDraftKey?: string;
      }
    | null;

  try {
    if (body?.publishKey && isCmsKey(body.publishKey)) {
      await publishDocument(body.publishKey);
      revalidatePublicContent();
      return NextResponse.json({ ok: true, published: [body.publishKey] });
    }

    if (body?.publish) {
      const published = await publishAllDrafts();
      if (published.length > 0) {
        revalidatePublicContent();
      }
      return NextResponse.json({ ok: true, published });
    }

    if (body?.discardDraftKey && isCmsKey(body.discardDraftKey)) {
      await discardDraft(body.discardDraftKey);
      return NextResponse.json({ ok: true });
    }

    if (body?.resetAll) {
      const seed = getSeedBundle();
      for (const key of CMS_KEYS) {
        await writeDocument(key, seed[key] as never, "published");
        await discardDraft(key);
      }
      revalidatePublicContent();
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Unsupported action." }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Action failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
