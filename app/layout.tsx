import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import {
  AnalyticsScripts,
  GtmNoscript,
} from "@/components/shared/AnalyticsScripts";
import { createMetadata, defaultTitle } from "@/lib/seo";
import { siteConfig } from "@/content/site-config";
import { getCmsSite } from "@/lib/cms/content";
import { DEFAULT_BRAND_LOGO, resolveBrandLogo } from "@/lib/cms/brand-logo";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  let logo = DEFAULT_BRAND_LOGO;
  try {
    logo = resolveBrandLogo(await getCmsSite());
  } catch {
    // Keep the shipped website logo if CMS is unavailable at build time.
  }

  return {
    ...createMetadata(),
    title: {
      default: defaultTitle,
      template: `%s | ${siteConfig.businessName}`,
    },
    icons: {
      icon: [
        { url: logo.favicon, sizes: "32x32", type: "image/png" },
        { url: logo.icon192, sizes: "192x192", type: "image/png" },
        { url: logo.icon512, sizes: "512x512", type: "image/png" },
      ],
      apple: [{ url: logo.apple, sizes: "180x180", type: "image/png" }],
    },
    manifest: "/manifest.webmanifest",
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#061B36" },
    { media: "(prefers-color-scheme: dark)", color: "#061B36" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <body className={`${manrope.variable} ${inter.variable} antialiased`}>
        <GtmNoscript />
        <AnalyticsScripts />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
