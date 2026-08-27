import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";
import { isEphemeralHost, PERSISTENT_STORAGE_HELP } from "@/lib/runtime";

export type ImageUploadFolder =
  | "destinations"
  | "fleet"
  | "gallery"
  | "blog"
  | "hero"
  | "uploads"
  | "brand";

export type ImageUploadVariant = "cover" | "gallery" | "hero" | "general" | "logo";

const PROFILES: Record<
  Exclude<ImageUploadVariant, "logo">,
  { width: number; height: number; quality: number }
> = {
  cover: { width: 1920, height: 1280, quality: 82 },
  gallery: { width: 1600, height: 1600, quality: 80 },
  hero: { width: 1920, height: 1080, quality: 82 },
  general: { width: 1600, height: 1600, quality: 80 },
};

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const MAX_INPUT_BYTES = 12 * 1024 * 1024; // 12MB before optimize
const BUCKET = process.env.CMS_UPLOAD_BUCKET || "cms-uploads";

export function isAllowedImageType(type: string) {
  return ALLOWED_TYPES.has(type.toLowerCase());
}

export function getMaxInputBytes() {
  return MAX_INPUT_BYTES;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "image";
}

export async function optimizeImageBuffer(
  input: Buffer,
  variant: ImageUploadVariant = "general",
) {
  const profile =
    variant === "logo" ? PROFILES.general : PROFILES[variant] || PROFILES.general;
  const image = sharp(input, { failOn: "none" }).rotate();
  const meta = await image.metadata();

  const pipeline = image
    .resize({
      width: profile.width,
      height: profile.height,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({
      quality: profile.quality,
      effort: 4,
    });

  const buffer = await pipeline.toBuffer();
  const outMeta = await sharp(buffer).metadata();

  return {
    buffer,
    contentType: "image/webp" as const,
    extension: "webp" as const,
    width: outMeta.width || meta.width || profile.width,
    height: outMeta.height || meta.height || profile.height,
    bytes: buffer.byteLength,
    quality: profile.quality,
  };
}

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function ensureBucket(client: NonNullable<ReturnType<typeof supabaseAdmin>>) {
  const { data } = await client.storage.getBucket(BUCKET);
  if (data) return;
  const { error } = await client.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: MAX_INPUT_BYTES,
    allowedMimeTypes: ["image/webp", "image/jpeg", "image/png"],
  });
  if (error && !/already exists|duplicate/i.test(error.message)) {
    console.warn("[cms-upload] could not create storage bucket", error.message);
  }
}

export async function storeOptimizedImage(params: {
  buffer: Buffer;
  folder: ImageUploadFolder;
  originalName: string;
  contentType: string;
  extension: string;
}) {
  const stamp = Date.now();
  const base = slugify(params.originalName);
  const filename = `${base}-${stamp}.${params.extension}`;
  const objectPath = `${params.folder}/${filename}`;

  const client = supabaseAdmin();
  if (!client && isEphemeralHost()) {
    throw new Error(
      `Photo uploads need Supabase Storage on this host. ${PERSISTENT_STORAGE_HELP}`,
    );
  }

  if (client) {
    try {
      await ensureBucket(client);
      const { error } = await client.storage
        .from(BUCKET)
        .upload(objectPath, params.buffer, {
          contentType: params.contentType,
          upsert: false,
          cacheControl: "31536000",
        });
      if (error) throw error;
      const { data } = client.storage.from(BUCKET).getPublicUrl(objectPath);
      return {
        url: data.publicUrl,
        storage: "supabase" as const,
        path: objectPath,
      };
    } catch (error) {
      console.error("[cms-upload] supabase failed", error);
      if (isEphemeralHost()) {
        throw new Error(
          "Could not upload to Supabase Storage. Check CMS_UPLOAD_BUCKET, run supabase/production.sql, and confirm SUPABASE_SERVICE_ROLE_KEY is set.",
        );
      }
    }
  }

  const publicDir = path.join(process.cwd(), "public", "images", "uploads", params.folder);
  await fs.mkdir(publicDir, { recursive: true });
  const filePath = path.join(publicDir, filename);
  await fs.writeFile(filePath, params.buffer);
  return {
    url: `/images/uploads/${params.folder}/${filename}`,
    storage: "filesystem" as const,
    path: objectPath,
  };
}
