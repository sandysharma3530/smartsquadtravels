import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";
import type { CmsBrandLogo } from "@/lib/cms/types";
import { DEFAULT_BRAND_LOGO } from "@/lib/cms/brand-logo";

export const BRAND_NAVY = { r: 6, g: 27, b: 54, alpha: 1 };

type LogoVariantBuffer = {
  buffer: Buffer;
  width: number;
  height: number;
};

export type ProcessedBrandLogo = {
  source: LogoVariantBuffer;
  header: LogoVariantBuffer;
  mark: LogoVariantBuffer;
  favicon: LogoVariantBuffer;
  apple: LogoVariantBuffer;
  icon192: LogoVariantBuffer;
  icon512: LogoVariantBuffer;
};

async function withMeta(buffer: Buffer): Promise<LogoVariantBuffer> {
  const meta = await sharp(buffer).metadata();
  return {
    buffer,
    width: meta.width || 1,
    height: meta.height || 1,
  };
}

/** Trim uniform edge padding without eating interior detail. */
async function tryTrim(input: Buffer): Promise<Buffer> {
  try {
    const trimmed = await sharp(input).rotate().trim({ threshold: 12 }).toBuffer();
    const meta = await sharp(trimmed).metadata();
    if ((meta.width || 0) < 24 || (meta.height || 0) < 24) return input;
    return trimmed;
  } catch {
    return sharp(input).rotate().toBuffer();
  }
}

async function containSquare(
  input: Buffer,
  size: number,
  padding = 0.06,
  background: { r: number; g: number; b: number; alpha: number } = BRAND_NAVY,
) {
  const inner = Math.max(1, Math.round(size * (1 - padding * 2)));
  const resized = await sharp(input)
    .resize(inner, inner, {
      fit: "inside",
      withoutEnlargement: false,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background,
    },
  })
    .composite([{ input: resized, gravity: "centre" }])
    .png()
    .toBuffer();
}

/**
 * Build header, square mark, favicon, Apple, and PWA sizes from one upload.
 * Wide lockups stay wide in the header; square icons are padded to fit.
 */
export async function processBrandLogo(input: Buffer): Promise<ProcessedBrandLogo> {
  const trimmed = await tryTrim(input);
  const sourceMeta = await sharp(trimmed).metadata();
  const sourceW = sourceMeta.width || 1;
  const sourceH = sourceMeta.height || 1;
  const aspect = sourceW / sourceH;
  const wideLockup = aspect >= 1.25;

  const source = await sharp(trimmed)
    .resize({
      width: 1600,
      height: 1600,
      fit: "inside",
      withoutEnlargement: true,
    })
    .png({ compressionLevel: 9 })
    .toBuffer();

  const header = await sharp(trimmed)
    .resize({
      width: wideLockup ? 720 : 560,
      height: 220,
      fit: "inside",
      withoutEnlargement: true,
    })
    .png({ compressionLevel: 9 })
    .toBuffer();

  const markPadding = wideLockup ? 0.08 : 0.05;

  const [mark, favicon, apple, icon192, icon512] = await Promise.all([
    containSquare(trimmed, 256, markPadding),
    containSquare(trimmed, 32, markPadding),
    containSquare(trimmed, 180, markPadding),
    containSquare(trimmed, 192, markPadding),
    containSquare(trimmed, 512, markPadding),
  ]);

  const [sourceV, headerV, markV, faviconV, appleV, icon192V, icon512V] =
    await Promise.all([
      withMeta(source),
      withMeta(header),
      withMeta(mark),
      withMeta(favicon),
      withMeta(apple),
      withMeta(icon192),
      withMeta(icon512),
    ]);

  return {
    source: sourceV,
    header: headerV,
    mark: markV,
    favicon: faviconV,
    apple: appleV,
    icon192: icon192V,
    icon512: icon512V,
  };
}

export async function loadBrandImageBuffer(url: string): Promise<Buffer> {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Could not load logo image (${res.status})`);
    }
    return Buffer.from(await res.arrayBuffer());
  }

  const relative = url.replace(/^\//, "");
  const filePath = path.join(process.cwd(), "public", relative);
  return fs.readFile(filePath);
}

export async function renderBrandIconPng(
  logo: CmsBrandLogo,
  size: number,
): Promise<Buffer> {
  const candidates = [
    size <= 48 ? logo.icon512 : null,
    size <= 180 ? logo.apple : null,
    logo.icon512,
    logo.header,
    DEFAULT_BRAND_LOGO.icon512,
  ].filter((value): value is string => Boolean(value));

  let lastError: unknown;
  for (const url of candidates) {
    try {
      const input = await loadBrandImageBuffer(url);
      return containSquare(input, size, size <= 48 ? 0.04 : 0.05);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Could not render brand icon.");
}
