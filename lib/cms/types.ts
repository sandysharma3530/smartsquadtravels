import type { Destination } from "@/content/destinations";
import type { FleetVehicle } from "@/content/fleet";
import type { BlogPost } from "@/content/blog";
import type { FaqItem } from "@/content/faqs";
import type { Review } from "@/content/reviews";
import type { Service } from "@/content/services";
import type { GalleryItem, GalleryCategory } from "@/content/gallery";

export const CMS_KEYS = [
  "site",
  "home",
  "destinations",
  "fleet",
  "services",
  "faqs",
  "reviews",
  "blog",
  "gallery",
  "pages",
] as const;

export type CmsKey = (typeof CMS_KEYS)[number];

export type CmsNavItem = {
  label: string;
  href: string;
  /** When omitted, the item is treated as enabled. */
  enabled?: boolean;
};

export function isNavItemEnabled(item: Pick<CmsNavItem, "enabled">) {
  return item.enabled !== false;
}

export function getVisibleNavItems(nav: CmsNavItem[] | null | undefined) {
  return (nav || []).filter(isNavItemEnabled);
}

export function isNavHrefEnabled(
  nav: CmsNavItem[] | null | undefined,
  href: string,
) {
  const item = (nav || []).find((entry) => entry.href === href);
  if (!item) return true;
  return isNavItemEnabled(item);
}

export type CmsBrandLogo = {
  source: string;
  header: string;
  headerWidth?: number;
  headerHeight?: number;
  mark: string;
  favicon: string;
  apple: string;
  icon192: string;
  icon512: string;
};

export type CmsSite = {
  businessName: string;
  tagline: string;
  legalName: string;
  shortDescription: string;
  phoneDisplay: string;
  phoneInternational: string;
  whatsappNumber: string;
  email: string;
  publicEmail: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    full: string;
  };
  serviceAreas: string[];
  businessHours: {
    display: string;
    weekdays: string;
    weekends: string;
  };
  mapEmbedUrl: string;
  social: {
    facebookUrl: string;
    instagramUrl: string;
    youtubeUrl: string;
  };
  googleBusinessUrl: string;
  googleReviewUrl: string;
  ownedFleet: {
    forceTraveller: boolean;
    forceUrbania: boolean;
  };
  availableFleet: {
    forceTraveller: boolean;
    forceUrbania: boolean;
  };
  trustStatistics: {
    googleRating: number | null;
    googleReviewCount: number | null;
    yearsOfExperience: number | null;
    tripsCompleted: number | null;
  };
  primaryVehicle: string;
  siteUrl: string;
  nav: CmsNavItem[];
  logo?: CmsBrandLogo;
};

export type CmsHeroSlide = {
  id: number;
  eyebrow: string;
  headingLines: { text: string; accent: boolean }[];
  description: string;
  image: string;
  imageAlt: string;
  showTrustPoints: boolean;
  showCtas: boolean;
  /** When omitted, the slide is treated as enabled. */
  enabled?: boolean;
};

export function isHeroSlideEnabled(slide: Pick<CmsHeroSlide, "enabled">) {
  return slide.enabled !== false;
}

export const HOME_SECTION_KEYS = [
  "hero",
  "trustBar",
  "fleet",
  "destinations",
  "services",
  "whyChooseUs",
  "reviews",
  "faqs",
  "contactCta",
] as const;

export type HomeSectionKey = (typeof HOME_SECTION_KEYS)[number];

export type HomeSectionVisibility = Record<HomeSectionKey, boolean>;

export const DEFAULT_HOME_SECTIONS: HomeSectionVisibility = {
  hero: true,
  trustBar: true,
  fleet: true,
  destinations: true,
  services: true,
  whyChooseUs: true,
  reviews: true,
  faqs: true,
  contactCta: true,
};

export function resolveHomeSections(
  sections?: Partial<HomeSectionVisibility> | null,
): HomeSectionVisibility {
  return {
    ...DEFAULT_HOME_SECTIONS,
    ...(sections || {}),
  };
}

export type CmsHome = {
  heroSlides: CmsHeroSlide[];
  heroTrustPoints: {
    id: string;
    label: string;
    icon: "satellite" | "cctv" | "user" | "shield";
  }[];
  trustBarItems: {
    id: string;
    label: string;
    icon:
      | "headset"
      | "mapPin"
      | "receipt"
      | "clock"
      | "sparkles"
      | "shieldCheck";
  }[];
  sections: HomeSectionVisibility;
};

export type CmsServices = {
  services: Service[];
  whyChooseUs: { id: string; title: string; description: string }[];
};

export type CmsGallery = {
  categories: { id: GalleryCategory; label: string }[];
  items: GalleryItem[];
};

export type CmsPages = {
  aboutParagraphs: string[];
  contactIntro: string;
  privacyLastUpdated: string;
  privacyBody: string;
  termsLastUpdated: string;
  termsBody: string;
};

export type CmsBundle = {
  site: CmsSite;
  home: CmsHome;
  destinations: Destination[];
  fleet: FleetVehicle[];
  services: CmsServices;
  faqs: FaqItem[];
  reviews: Review[];
  blog: BlogPost[];
  gallery: CmsGallery;
  pages: CmsPages;
};

export type CmsStorageBackend = "supabase" | "filesystem" | "seed";
