import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const src = path.join(root, "assets/logo-source.png");

async function removeNearWhite(inputPath) {
  const { data, info } = await sharp(inputPath)
    .rotate()
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r > 235 && g > 235 && b > 230) {
      data[i + 3] = 0;
    }
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  });
}

async function main() {
  if (!fs.existsSync(src)) {
    throw new Error(
      `Missing logo source at ${src}. Place your logo at assets/logo-source.png`,
    );
  }

  fs.mkdirSync(path.join(root, "public/images/brand"), { recursive: true });

  await sharp(src)
    .rotate()
    .resize(1024, null, { fit: "inside" })
    .png()
    .toFile(path.join(root, "public/images/logo.png"));

  await (await removeNearWhite(src))
    .png()
    .toFile(path.join(root, "public/images/logo-transparent.png"));

  const meta = await sharp(src).rotate().metadata();
  const w = meta.width;
  const h = meta.height;
  const cropH = Math.round(h * 0.72);
  const cropTop = Math.round(h * 0.02);
  const cropLeft = Math.round(w * 0.08);
  const cropW = Math.round(w * 0.84);

  const markBuf = await sharp(src)
    .rotate()
    .extract({
      left: cropLeft,
      top: cropTop,
      width: cropW,
      height: Math.min(cropH, h - cropTop),
    })
    .resize(512, 512, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < markBuf.data.length; i += 4) {
    const r = markBuf.data[i];
    const g = markBuf.data[i + 1];
    const b = markBuf.data[i + 2];
    if (r > 235 && g > 235 && b > 230) markBuf.data[i + 3] = 0;
  }

  await sharp(markBuf.data, {
    raw: { width: markBuf.info.width, height: markBuf.info.height, channels: 4 },
  })
    .png()
    .toFile(path.join(root, "public/images/brand/logo-header-mark.png"));

  await (await removeNearWhite(src))
    .resize(640, null, { fit: "inside" })
    .png()
    .toFile(path.join(root, "public/images/brand/logo-full-sm.png"));

  const headerLogo = path.join(root, "public/images/brand/logo-header.png");
  const iconSource = fs.existsSync(headerLogo) ? headerLogo : src;
  const navy = { r: 6, g: 27, b: 54, alpha: 1 };

  const iconJobs = [
    ["public/images/brand/favicon-32.png", 32],
    ["public/images/brand/favicon-48.png", 48],
    ["public/images/icon-512.png", 512],
    ["public/images/icon-192.png", 192],
    ["public/images/apple-touch-icon.png", 180],
  ];

  for (const [rel, size] of iconJobs) {
    const inner = Math.max(1, Math.round(size * 0.92));
    const resized = await sharp(iconSource)
      .rotate()
      .resize(inner, inner, {
        fit: "inside",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();

    await sharp({
      create: { width: size, height: size, channels: 4, background: navy },
    })
      .composite([{ input: resized, gravity: "centre" }])
      .png()
      .toFile(path.join(root, rel));
  }

  console.log("Logo assets installed");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
