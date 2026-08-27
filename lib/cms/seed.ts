import { siteConfig } from "@/content/site-config";
import { heroSlides, heroTrustPoints, trustBarItems } from "@/content/home";
import { destinations } from "@/content/destinations";
import { fleetVehicles } from "@/content/fleet";
import { services, whyChooseUs } from "@/content/services";
import { faqs } from "@/content/faqs";
import { reviews } from "@/content/reviews";
import { blogPosts } from "@/content/blog";
import { galleryCategories, galleryItems } from "@/content/gallery";
import { defaultPages } from "@/content/pages";
import { DEFAULT_HOME_SECTIONS, type CmsBundle } from "@/lib/cms/types";
import { DEFAULT_BRAND_LOGO } from "@/lib/cms/brand-logo";

function clone<T>(value: unknown): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function getSeedBundle(): CmsBundle {
  const site = clone(siteConfig) as unknown as CmsBundle["site"];
  site.nav = siteConfig.nav.map((item) => ({ ...item }));
  site.logo = { ...DEFAULT_BRAND_LOGO };

  return {
    site,
    home: {
      heroSlides: clone<CmsBundle["home"]["heroSlides"]>(heroSlides),
      heroTrustPoints: clone<CmsBundle["home"]["heroTrustPoints"]>(heroTrustPoints),
      trustBarItems: clone<CmsBundle["home"]["trustBarItems"]>(trustBarItems),
      sections: clone(DEFAULT_HOME_SECTIONS),
    },
    destinations: clone<CmsBundle["destinations"]>(destinations),
    fleet: clone<CmsBundle["fleet"]>(fleetVehicles),
    services: {
      services: clone<CmsBundle["services"]["services"]>(services),
      whyChooseUs: clone<CmsBundle["services"]["whyChooseUs"]>(whyChooseUs),
    },
    faqs: clone(faqs),
    reviews: clone(reviews),
    blog: clone(blogPosts),
    gallery: {
      categories: clone(galleryCategories),
      items: clone(galleryItems),
    },
    pages: clone(defaultPages),
  };
}
