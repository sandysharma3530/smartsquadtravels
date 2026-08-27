import { HeroSlider } from "@/components/home/HeroSlider";
import { TrustBar } from "@/components/home/TrustBar";
import { FleetSection } from "@/components/home/FleetSection";
import { DestinationsSection } from "@/components/home/DestinationsSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { WhyChooseUsSection } from "@/components/home/WhyChooseUsSection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { FaqSection } from "@/components/home/FaqSection";
import { ContactCTA } from "@/components/shared/ContactCTA";
import { QuickEnquiryForm } from "@/components/forms/QuickEnquiryForm";
import { JsonLd } from "@/components/shared/JsonLd";
import {
  createMetadata,
  faqJsonLd,
  defaultDescription,
} from "@/lib/seo";
import { getFaqs, getHomeContent } from "@/lib/cms/content";

export const metadata = createMetadata({
  path: "/",
  description: defaultDescription,
  keywords: [
    "Force Traveller rental Delhi NCR",
    "21 seater Traveller Noida",
    "Force Urbania hire Greater Noida",
    "group transportation Delhi",
    "outstation Traveller from Noida",
  ],
});

export default async function HomePage() {
  const faqs = await getFaqs();
  const home = await getHomeContent();
  const sections = home.sections;

  return (
    <>
      {sections.faqs ? <JsonLd data={faqJsonLd(faqs)} /> : null}
      {sections.hero ? (
        <HeroSlider slides={home.heroSlides} trustPoints={home.heroTrustPoints}>
          <QuickEnquiryForm sourcePage="/" />
        </HeroSlider>
      ) : null}
      {sections.trustBar ? (
        <TrustBar className={sections.hero ? undefined : "mt-6 md:mt-8"} />
      ) : null}
      {sections.fleet ? <FleetSection /> : null}
      {sections.destinations ? <DestinationsSection /> : null}
      {sections.services ? <ServicesSection /> : null}
      {sections.whyChooseUs ? <WhyChooseUsSection /> : null}
      {sections.reviews ? <ReviewsSection /> : null}
      {sections.faqs ? <FaqSection faqs={faqs} /> : null}
      {sections.contactCta ? <ContactCTA /> : null}
    </>
  );
}
