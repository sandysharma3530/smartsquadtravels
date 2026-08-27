import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import { getPublicContent } from "@/lib/cms/content";
import { ContactCTA } from "@/components/shared/ContactCTA";
import { JsonLd } from "@/components/shared/JsonLd";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "About Smart Squad Travels",
  description:
    "Smart Squad Travels provides comfortable group transportation from Noida, Greater Noida and Delhi NCR — Force Traveller and Urbania for families, corporates, weddings and customized outstation journeys.",
  path: "/about",
  keywords: [
    "Smart Squad Travels",
    "Traveller rental company Delhi NCR",
    "group transport Noida",
  ],
});

export default async function AboutPage() {
  const { site: siteConfig, fleet: fleetVehicles, pages } = await getPublicContent();
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About Us", path: "/about" },
        ])}
      />

      <section className="bg-gradient-to-br from-navy via-navy-secondary to-navy py-12 md:py-16">
        <div className="container-site">
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-white/70">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="transition hover:text-teal-light">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-white">About Us</li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            About {siteConfig.businessName}
          </h1>
          <p className="mt-3 max-w-2xl text-base text-white/80 md:text-lg">
            {siteConfig.tagline} — reliable group travel support from Noida,
            Greater Noida and Delhi NCR across North India.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site">
          <div className="mx-auto max-w-3xl space-y-6 text-text-main">
            {pages.aboutParagraphs.map((paragraph, index) => (
              <p
                key={index}
                className={index === 0 ? "text-lg leading-relaxed" : "leading-relaxed text-text-muted"}
              >
                {paragraph}
              </p>
            ))}
            <p className="leading-relaxed text-text-muted">
              Our service areas include {siteConfig.serviceAreas.join(", ")}.
            </p>
          </div>
        </div>
      </section>

      <section className="section-pad bg-bg-light">
        <div className="container-site">
          <SectionHeader
            title="Our Fleet Overview"
            subtitle="Spacious, well-maintained vehicles for group travel — availability confirmed when you request a quote."
          />

          <div className="grid gap-8 lg:grid-cols-2">
            {fleetVehicles.map((vehicle) => (
              <article
                key={vehicle.id}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={vehicle.coverImage}
                    alt={vehicle.coverAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 560px"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-navy">{vehicle.name}</h2>
                  <p className="mt-2 text-sm text-text-muted">
                    {vehicle.description}
                  </p>
                  {!vehicle.owned ? (
                    <p className="mt-2 text-xs text-text-muted">
                      Available through our travel network — customized quotes
                      based on your route and dates.
                    </p>
                  ) : null}
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {vehicle.features.slice(0, 4).map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm text-text-main"
                      >
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0 text-teal"
                          aria-hidden="true"
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/fleet/${vehicle.slug}`}
                    className="mt-5 inline-flex text-sm font-semibold text-teal hover:underline"
                  >
                    View {vehicle.shortName} details →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/fleet"
              className="text-sm font-semibold text-teal hover:underline"
            >
              Explore full fleet →
            </Link>
          </div>
        </div>
      </section>

      <ContactCTA
        heading="Plan your next group journey with us"
        text="Share your travel dates, pickup location and destination. We will respond with a customized quotation for comfortable group transportation."
      />
    </>
  );
}
