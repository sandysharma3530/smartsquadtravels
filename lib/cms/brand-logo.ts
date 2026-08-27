import type { CmsBrandLogo } from "@/lib/cms/types";

/** Default lockup used in the header, footer, and generated tab icons. */
export const DEFAULT_BRAND_LOGO: CmsBrandLogo = {
  source: "/images/brand/logo-header.png",
  header: "/images/brand/logo-header.png",
  headerWidth: 560,
  headerHeight: 438,
  mark: "/images/brand/logo-header-mark.png",
  favicon: "/images/brand/favicon-32.png",
  apple: "/images/apple-touch-icon.png",
  icon192: "/images/icon-192.png",
  icon512: "/images/icon-512.png",
};

export function resolveBrandLogo(
  site?: { logo?: CmsBrandLogo | null } | null,
): CmsBrandLogo {
  const logo = site?.logo;
  return {
    source: logo?.source || DEFAULT_BRAND_LOGO.source,
    header: logo?.header || logo?.source || DEFAULT_BRAND_LOGO.header,
    headerWidth: logo?.headerWidth || DEFAULT_BRAND_LOGO.headerWidth,
    headerHeight: logo?.headerHeight || DEFAULT_BRAND_LOGO.headerHeight,
    mark: logo?.mark || DEFAULT_BRAND_LOGO.mark,
    favicon: logo?.favicon || DEFAULT_BRAND_LOGO.favicon,
    apple: logo?.apple || DEFAULT_BRAND_LOGO.apple,
    icon192: logo?.icon192 || DEFAULT_BRAND_LOGO.icon192,
    icon512: logo?.icon512 || DEFAULT_BRAND_LOGO.icon512,
  };
}

export function isRemoteLogoSrc(src: string) {
  return (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("/images/uploads/") ||
    src.includes("/storage/v1/object/public/")
  );
}
