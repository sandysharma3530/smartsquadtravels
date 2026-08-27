import { getCmsSite } from "@/lib/cms/content";
import { resolveBrandLogo } from "@/lib/cms/brand-logo";
import { renderBrandIconPng } from "@/lib/cms/process-logo";

export const runtime = "nodejs";
export const contentType = "image/png";
export const size = { width: 32, height: 32 };
export const revalidate = 120;

export default async function Icon() {
  const site = await getCmsSite();
  const logo = resolveBrandLogo(site);
  const buffer = await renderBrandIconPng(logo, 32);
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=120, stale-while-revalidate=86400",
    },
  });
}
