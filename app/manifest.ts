import type { MetadataRoute } from "next";
import { getCmsSite } from "@/lib/cms/content";
import { resolveBrandLogo } from "@/lib/cms/brand-logo";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const site = await getCmsSite();
  const logo = resolveBrandLogo(site);

  return {
    name: site.businessName,
    short_name: "Smart Squad",
    description: site.shortDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#061b36",
    theme_color: "#061b36",
    orientation: "portrait-primary",
    categories: ["travel", "transportation"],
    lang: "en-IN",
    icons: [
      {
        src: logo.icon192,
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: logo.icon512,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: logo.icon512,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
