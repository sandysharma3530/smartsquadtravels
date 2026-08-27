import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { BackToTop } from "@/components/shared/BackToTop";
import { MobileStickyBar } from "@/components/shared/MobileStickyBar";
import { JsonLd } from "@/components/shared/JsonLd";
import { PublicSiteProvider } from "@/components/cms/PublicSiteProvider";
import {
  localBusinessJsonLd,
  organizationJsonLd,
  serviceJsonLd,
  websiteJsonLd,
} from "@/lib/seo";
import { getPublicContent } from "@/lib/cms/content";

export const revalidate = 120;

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getPublicContent();

  return (
    <PublicSiteProvider site={content.site}>
      <div className="pb-20 md:pb-0">
        <JsonLd
          data={[
            organizationJsonLd(content.site),
            localBusinessJsonLd(content.site),
            websiteJsonLd(),
            serviceJsonLd(),
          ]}
        />
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <WhatsAppButton />
        <BackToTop />
        <MobileStickyBar />
      </div>
    </PublicSiteProvider>
  );
}
