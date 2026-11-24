import type { Metadata } from "next";
import { siteConfig } from "@/content/site-config";
import { isConfigured } from "@/lib/placeholders";
import type { Destination } from "@/content/destinations";
import type { FleetVehicle } from "@/content/fleet";
import type { BlogPost } from "@/content/blog";
import type { FaqItem } from "@/content/faqs";
import type { CmsSite } from "@/lib/cms/types";
import { resolveBrandLogo } from "@/lib/cms/brand-logo";

export const defaultTitle =
  "Smart Squad Travels | Force Traveller & Urbania from Ghaziabad";

export const defaultDescription =
  "Smart Squad Travels, based in Ghaziabad, arranges a Force Traveller or Force Urbania for families, offices, weddings and temple groups travelling from Noida and Delhi.";

/** Light keyword set for secondary engines — keep natural, never stuff into body copy. */
export const primaryKeywords = [
  "Force Traveller hire Ghaziabad",
  "21 seater Traveller Noida",
  "Force Urbania from Ghaziabad",
  "group vehicle Ghaziabad",
  "outstation Traveller Noida",
  "wedding guest vehicle Delhi",
  "office group travel Ghaziabad",
] as const;

function absoluteUrl(pathOrUrl: string) {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  const base = siteConfig.siteUrl.replace(/\/$/, "");
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${base}${path}`;
}

export function createMetadata({
  title,
  description,
  path = "/",
  image = "/images/og-default.jpg",
  noIndex = false,
  keywords,
  type = "website",
  publishedTime,
  modifiedTime,
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
} = {}): Metadata {
  const pageTitle = title
    ? `${title} | ${siteConfig.businessName}`
    : defaultTitle;
  const desc = description || defaultDescription;
  const url = absoluteUrl(path);
  const ogImage = absoluteUrl(image);
  const keywordList = keywords?.length
    ? [...keywords]
    : [...primaryKeywords];

  const verification: Metadata["verification"] = {};
  if (process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION) {
    verification.google = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
  }
  if (process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION) {
    verification.other = {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
    };
  }

  return {
    title: {
      absolute: pageTitle,
    },
    description: desc,
    keywords: keywordList,
    applicationName: siteConfig.businessName,
    authors: [{ name: siteConfig.businessName, url: siteConfig.siteUrl }],
    creator: siteConfig.businessName,
    publisher: siteConfig.businessName,
    category: "Travel",
    metadataBase: new URL(siteConfig.siteUrl),
    alternates: {
      canonical: url,
      languages: {
        "en-IN": url,
        en: url,
      },
    },
    robots: noIndex
      ? { index: false, follow: false, nocache: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      title: pageTitle,
      description: desc,
      url,
      siteName: siteConfig.businessName,
      locale: "en_IN",
      type,
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title
            ? `${title} — ${siteConfig.businessName}`
            : siteConfig.businessName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: desc,
      images: [ogImage],
    },
    other: {
      "geo.region": "IN-UP",
      "geo.placename": "Ghaziabad, Uttar Pradesh",
      "og:locale:alternate": "en",
    },
    ...(Object.keys(verification).length ? { verification } : {}),
  };
}

export function organizationJsonLd(site: CmsSite = siteConfig as unknown as CmsSite) {
  const logo = resolveBrandLogo(site);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.siteUrl}/#organization`,
    name: site.businessName,
    legalName: site.legalName,
    url: site.siteUrl,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl(logo.header),
    },
    image: absoluteUrl("/images/og-default.jpg"),
    description: site.shortDescription,
    slogan: site.tagline,
    email: isConfigured(site.publicEmail)
      ? site.publicEmail
      : undefined,
    telephone: isConfigured(site.phoneInternational)
      ? site.phoneInternational
      : undefined,
    sameAs: [
      site.social.facebookUrl,
      site.social.instagramUrl,
      site.social.youtubeUrl,
      site.googleBusinessUrl,
    ].filter((url) => isConfigured(url)),
    contactPoint: isConfigured(site.phoneInternational)
      ? [
          {
            "@type": "ContactPoint",
            telephone: site.phoneInternational,
            contactType: "customer service",
            areaServed: "IN",
            availableLanguage: ["English", "Hindi"],
          },
        ]
      : undefined,
  };
}

export function localBusinessJsonLd(site: CmsSite = siteConfig as unknown as CmsSite) {
  const logo = resolveBrandLogo(site);
  const rating =
    site.trustStatistics.googleRating != null &&
    site.trustStatistics.googleReviewCount != null
      ? {
          "@type": "AggregateRating",
          ratingValue: site.trustStatistics.googleRating,
          reviewCount: site.trustStatistics.googleReviewCount,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "TravelAgency"],
    "@id": `${site.siteUrl}/#localbusiness`,
    name: site.businessName,
    description: site.shortDescription,
    url: site.siteUrl,
    image: [
      absoluteUrl("/images/og-default.jpg"),
      absoluteUrl("/images/fleet/traveller/cover.jpg"),
    ],
    logo: absoluteUrl(logo.header),
    telephone: isConfigured(siteConfig.phoneInternational)
      ? siteConfig.phoneInternational
      : undefined,
    email: isConfigured(siteConfig.publicEmail)
      ? siteConfig.publicEmail
      : undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: isConfigured(siteConfig.address.line1)
        ? siteConfig.address.line1
        : undefined,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.state,
      postalCode: isConfigured(siteConfig.address.postalCode)
        ? siteConfig.address.postalCode
        : undefined,
      addressCountry: "IN",
    },
    areaServed: siteConfig.serviceAreas.map((name) => ({
      "@type": "AdministrativeArea",
      name,
    })),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    priceRange: "$$",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, UPI, Bank Transfer",
    ...(rating ? { aggregateRating: rating } : {}),
    parentOrganization: { "@id": `${siteConfig.siteUrl}/#organization` },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.siteUrl}/#website`,
    name: siteConfig.businessName,
    url: siteConfig.siteUrl,
    description: siteConfig.shortDescription,
    inLanguage: "en-IN",
    publisher: { "@id": `${siteConfig.siteUrl}/#organization` },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(faqs: FaqItem[]) {
  const items = (faqs || []).filter(
    (faq) => faq && typeof faq.question === "string" && typeof faq.answer === "string",
  );
  if (!items.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function serviceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Force Traveller Group Transportation",
    serviceType: "Group transportation and Traveller rental",
    provider: { "@id": `${siteConfig.siteUrl}/#localbusiness` },
    areaServed: siteConfig.serviceAreas.map((name) => ({
      "@type": "Place",
      name,
    })),
    description: siteConfig.shortDescription,
    url: siteConfig.siteUrl,
  };
}

/**
 * Vehicle service schema without inventing ownership or fixed package prices.
 */
export function vehicleServiceJsonLd(vehicle: FleetVehicle) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${vehicle.name} group transportation`,
    description: vehicle.description,
    image: absoluteUrl(vehicle.coverImage),
    url: absoluteUrl(`/fleet/${vehicle.slug}`),
    provider: { "@id": `${siteConfig.siteUrl}/#localbusiness` },
    serviceType: "Traveller / group vehicle rental",
    category: "Passenger Van / Group Transport Vehicle",
    brand: {
      "@type": "Brand",
      name: "Force Motors",
    },
    areaServed: siteConfig.serviceAreas.map((name) => ({
      "@type": "Place",
      name,
    })),
    ...(vehicle.seatingCapacity
      ? {
          additionalProperty: [
            {
              "@type": "PropertyValue",
              name: "Seating capacity",
              value: vehicle.seatingCapacity,
            },
          ],
        }
      : {}),
    termsOfService: absoluteUrl("/terms"),
  };
}

export function destinationTouristPlaceJsonLd(destination: Destination) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: destination.name,
    description: destination.introduction,
    image: absoluteUrl(destination.coverImage),
    url: absoluteUrl(`/destinations/${destination.slug}`),
    address: {
      "@type": "PostalAddress",
      addressRegion: destination.region,
      addressCountry: "IN",
    },
    touristType: destination.suitableFor,
  };
}

export function articleJsonLd(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: absoluteUrl(post.coverImage),
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: siteConfig.businessName,
      url: siteConfig.siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.businessName,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(resolveBrandLogo().header),
      },
    },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    keywords: post.tags.join(", "),
    inLanguage: "en-IN",
  };
}
