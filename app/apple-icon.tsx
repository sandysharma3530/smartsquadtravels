import { getCmsSite } from "@/lib/cms/content";
import { resolveBrandLogo } from "@/lib/cms/brand-logo";
import { renderBrandIconPng } from "@/lib/cms/process-logo";

export const runtime = "nodejs";
export const contentType = "image/png";
export const size = { width: 180, height: 180 };
export const revalidate = 120;

export default async function AppleIcon() {
  const site = await getCmsSite();
  const logo = resolveBrandLogo(site);
  const buffer = await renderBrandIconPng(logo, 180);
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=120, stale-while-revalidate=86400",
    },
  });
}
