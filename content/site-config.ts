/**
 * Central site configuration for Smart Squad Travels.
 * Replace all REPLACE_* placeholders with your real business details
 * before going live. Prefer environment variables for phone/WhatsApp
 * when you want different values per environment.
 */

export const siteConfig = {
  businessName: "Smart Squad Travels",
  tagline: "Travel Smart. Travel Together.",
  legalName: "Smart Squad Travels",
  shortDescription:
    "Smart Squad Travels is based at Panchsheel Greens, Ghaziabad. We arrange a Force Traveller or Force Urbania when your group wants one vehicle from Ghaziabad, Noida or Delhi, with a clear price for the days on the road.",

  // REPLACE these placeholders with your real contact details
  phoneDisplay:
    process.env.NEXT_PUBLIC_BUSINESS_PHONE_DISPLAY || "REPLACE_PHONE_DISPLAY",
  phoneInternational:
    process.env.NEXT_PUBLIC_BUSINESS_PHONE || "REPLACE_PHONE_E164",
  whatsappNumber:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "REPLACE_WHATSAPP_E164",
  // Public contact email only (never put Resend/API secrets here)
  email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL || "REPLACE_PUBLIC_EMAIL",
  publicEmail:
    process.env.NEXT_PUBLIC_BUSINESS_EMAIL || "REPLACE_PUBLIC_EMAIL",

  address: {
    line1: "REPLACE_ADDRESS_LINE_1",
    line2: "REPLACE_ADDRESS_LINE_2",
    city: "Noida",
    state: "Uttar Pradesh",
    postalCode: "REPLACE_PINCODE",
    country: "India",
    full: "REPLACE_FULL_ADDRESS — Noida, Greater Noida, Delhi NCR",
  },

  serviceAreas: [
    "Noida",
    "Greater Noida",
    "Delhi NCR",
    "Uttarakhand",
    "Himachal Pradesh",
    "Rajasthan",
    "Uttar Pradesh",
    "Jammu & Kashmir",
  ],

  businessHours: {
    display: "You can call or WhatsApp us any day",
    weekdays: "24 hours",
    weekends: "24 hours",
  },

  // Google Maps embed URL (Share → Embed a map → copy src)
  mapEmbedUrl:
    process.env.NEXT_PUBLIC_MAP_EMBED_URL ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.0!2d77.39!3d28.57!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zTm9pZGE!5e0!3m2!1sen!2sin!4v0000000000000",

  social: {
    facebookUrl: "https://www.facebook.com/REPLACE_FACEBOOK_PAGE",
    instagramUrl: "https://www.instagram.com/REPLACE_INSTAGRAM_HANDLE",
    youtubeUrl: "https://www.youtube.com/@REPLACE_YOUTUBE_CHANNEL",
  },

  googleBusinessUrl: "https://g.page/REPLACE_GOOGLE_BUSINESS_PROFILE",
  googleReviewUrl: "https://g.page/r/REPLACE_GOOGLE_REVIEW_LINK/review",

  /**
   * Fleet ownership / availability flags.
   * Do not claim ownership on the site unless marked true here.
   */
  ownedFleet: {
    forceTraveller: false,
    forceUrbania: false,
  },
  availableFleet: {
    forceTraveller: true,
    forceUrbania: true,
  },

  /**
   * Trust statistics — leave null/undefined to hide from the UI.
   * Never invent numbers; only fill verified values.
   */
  trustStatistics: {
    googleRating: null as number | null,
    googleReviewCount: null as number | null,
    yearsOfExperience: null as number | null,
    tripsCompleted: null as number | null,
  },

  primaryVehicle: "21-Seater Force Traveller",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://www.smartsquadtravels.com",

  nav: [
    { label: "Home", href: "/", enabled: true },
    { label: "About Us", href: "/about", enabled: true },
    { label: "Fleet", href: "/fleet", enabled: true },
    { label: "Destinations", href: "/destinations", enabled: true },
    { label: "Gallery", href: "/gallery", enabled: true },
    { label: "Reviews", href: "/reviews", enabled: true },
    { label: "Blog", href: "/blog", enabled: false },
    { label: "Contact Us", href: "/contact", enabled: true },
  ] as const,
} as const;

export type SiteConfig = typeof siteConfig;

export function getWhatsAppLink(
  message?: string,
  whatsappNumber = siteConfig.whatsappNumber,
) {
  const base = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function getTelLink(phone = siteConfig.phoneInternational) {
  return `tel:${phone}`;
}

export function getMailtoLink(email = siteConfig.publicEmail) {
  return `mailto:${email}`;
}

export function hasGoogleReviewsConfigured(
  site: {
    trustStatistics: { googleRating: number | null; googleReviewCount: number | null };
    googleReviewUrl: string;
  } = siteConfig,
) {
  const { googleRating, googleReviewCount } = site.trustStatistics;
  return (
    googleRating != null &&
    googleReviewCount != null &&
    !site.googleReviewUrl.includes("REPLACE_")
  );
}
