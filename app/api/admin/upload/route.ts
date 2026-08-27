import { NextResponse } from "next/server";
import {
  getMaxInputBytes,
  isAllowedImageType,
  optimizeImageBuffer,
  storeOptimizedImage,
  type ImageUploadFolder,
  type ImageUploadVariant,
} from "@/lib/cms/image-optimize";
import { processBrandLogo } from "@/lib/cms/process-logo";
import type { CmsBrandLogo } from "@/lib/cms/types";
import { assertPersistentBackend } from "@/lib/supabase";

export const runtime = "nodejs";

const FOLDERS = new Set<ImageUploadFolder>([
  "destinations",
  "fleet",
  "gallery",
  "blog",
  "hero",
  "uploads",
  "brand",
]);

const VARIANTS = new Set<ImageUploadVariant>([
  "cover",
  "gallery",
  "hero",
  "general",
  "logo",
]);

function parseFolder(value: FormDataEntryValue | null): ImageUploadFolder {
  const folder = String(value || "uploads");
  return FOLDERS.has(folder as ImageUploadFolder)
    ? (folder as ImageUploadFolder)
    : "uploads";
}

function parseVariant(value: FormDataEntryValue | null): ImageUploadVariant {
  const variant = String(value || "general");
  return VARIANTS.has(variant as ImageUploadVariant)
    ? (variant as ImageUploadVariant)
    : "general";
}

export async function POST(request: Request) {
  try {
    assertPersistentBackend("uploads");
    const form = await request.formData();
    const folder = parseFolder(form.get("folder"));
    const variant = parseVariant(form.get("variant"));
    const files = form
      .getAll("files")
      .concat(form.get("file") ? [form.get("file")!] : [])
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);

    if (!files.length) {
      return NextResponse.json({ error: "No image files provided." }, { status: 400 });
    }

    if (files.length > 12) {
      return NextResponse.json(
        { error: "Upload up to 12 images at a time." },
        { status: 400 },
      );
    }

    if (variant === "logo" && files.length > 1) {
      return NextResponse.json(
        { error: "Upload one logo file at a time." },
        { status: 400 },
      );
    }

    const maxBytes = getMaxInputBytes();
    const uploaded: Array<{
      url: string;
      width: number;
      height: number;
      bytes: number;
      quality: number;
      storage: "supabase" | "filesystem";
      originalName: string;
      logo?: CmsBrandLogo;
    }> = [];

    for (const file of files) {
      if (!isAllowedImageType(file.type)) {
        return NextResponse.json(
          { error: `Unsupported type for ${file.name}. Use JPG, PNG, WebP, GIF, or AVIF.` },
          { status: 400 },
        );
      }
      if (file.size > maxBytes) {
        return NextResponse.json(
          { error: `${file.name} is too large (max ${Math.round(maxBytes / (1024 * 1024))}MB).` },
          { status: 400 },
        );
      }

      const input = Buffer.from(await file.arrayBuffer());

      if (variant === "logo") {
        const processed = await processBrandLogo(input);
        const keys = [
          "source",
          "header",
          "mark",
          "favicon",
          "apple",
          "icon192",
          "icon512",
        ] as const;
        const logo = {} as CmsBrandLogo;
        let storage: "supabase" | "filesystem" = "filesystem";

        for (const key of keys) {
          const stored = await storeOptimizedImage({
            buffer: processed[key].buffer,
            folder: "brand",
            originalName: `logo-${key}.png`,
            contentType: "image/png",
            extension: "png",
          });
          logo[key] = stored.url;
          storage = stored.storage;
        }
        logo.headerWidth = processed.header.width;
        logo.headerHeight = processed.header.height;

        uploaded.push({
          url: logo.header,
          width: processed.header.width,
          height: processed.header.height,
          bytes: processed.header.buffer.byteLength,
          quality: 100,
          storage,
          originalName: file.name,
          logo,
        });
        continue;
      }

      const optimized = await optimizeImageBuffer(input, variant);
      const stored = await storeOptimizedImage({
        buffer: optimized.buffer,
        folder,
        originalName: file.name,
        contentType: optimized.contentType,
        extension: optimized.extension,
      });

      uploaded.push({
        url: stored.url,
        width: optimized.width,
        height: optimized.height,
        bytes: optimized.bytes,
        quality: optimized.quality,
        storage: stored.storage,
        originalName: file.name,
      });
    }

    return NextResponse.json({
      ok: true,
      files: uploaded,
      url: uploaded[0]?.url,
    });
  } catch (error) {
    console.error("[cms-upload]", error);
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Image upload failed. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
