import {
  isHeroSlideEnabled,
  resolveHomeSections,
  type CmsBundle,
} from "@/lib/cms/types";
import { resolveBrandLogo } from "@/lib/cms/brand-logo";

function isUsableSrc(src: unknown): src is string {
  return typeof src === "string" && src.trim().length > 0;
}

/** Keep CMS media fields from crashing public pages with bad/empty image paths. */
export function sanitizePublicBundle(bundle: CmsBundle): CmsBundle {
  return {
    ...bundle,
    site: {
      ...bundle.site,
      logo: resolveBrandLogo(bundle.site),
    },
    home: {
      ...bundle.home,
      sections: resolveHomeSections(bundle.home?.sections),
      heroSlides: (bundle.home?.heroSlides || []).filter(
        (slide) => isUsableSrc(slide?.image) && isHeroSlideEnabled(slide),
      ),
    },
    fleet: (bundle.fleet || []).map((vehicle) => ({
      ...vehicle,
      coverImage: isUsableSrc(vehicle.coverImage)
        ? vehicle.coverImage
        : "/images/fleet/traveller/cover.jpg",
      features: Array.isArray(vehicle.features) ? vehicle.features : [],
      gallery: (vehicle.gallery || []).filter(
        (image) => isUsableSrc(image?.src) && image?.id,
      ),
    })),
    destinations: (bundle.destinations || []).map((destination) => ({
      ...destination,
      coverImage: isUsableSrc(destination.coverImage)
        ? destination.coverImage
        : "/images/destinations/nainital.jpg",
      highlights: Array.isArray(destination.highlights)
        ? destination.highlights
        : [],
      suitableFor: Array.isArray(destination.suitableFor)
        ? destination.suitableFor
        : [],
      nearbyPlaces: Array.isArray(destination.nearbyPlaces)
        ? destination.nearbyPlaces
        : [],
      recommendedVehicles: Array.isArray(destination.recommendedVehicles)
        ? destination.recommendedVehicles
        : [],
      gallery: (destination.gallery || []).filter((image) =>
        isUsableSrc(image?.src),
      ),
    })),
    blog: (bundle.blog || []).map((post) => ({
      ...post,
      coverImage: isUsableSrc(post.coverImage)
        ? post.coverImage
        : "/images/blog/choose-traveller.jpg",
      content: Array.isArray(post.content) ? post.content : [],
      tags: Array.isArray(post.tags) ? post.tags : [],
      gallery: (post.gallery || []).filter((image) => isUsableSrc(image?.src)),
    })),
    gallery: {
      ...bundle.gallery,
      items: (bundle.gallery?.items || []).filter((item) =>
        isUsableSrc(item?.src),
      ),
    },
  };
}
