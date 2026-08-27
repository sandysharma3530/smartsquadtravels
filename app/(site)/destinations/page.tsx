import Link from "next/link";
import { getDestinations } from "@/lib/cms/content";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { ContactCTA } from "@/components/shared/ContactCTA";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Destinations Across North India",
  description:
    "Popular destinations we serve from Delhi NCR — Tungnath, Nainital, Manali, Jaipur, Kedarnath, Haridwar and more. Request a customized Traveller quote for your group.",
  path: "/destinations",
  keywords: [
    "Traveller to Manali from Delhi",
    "Nainital Traveller rental",
    "Jaipur group travel from Noida",
    "Kedarnath Traveller hire",
    "North India outstation Traveller",
  ],
});

export default async function DestinationsPage() {
  const allDestinations = await getDestinations();

  return (
    <>
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
              <li className="text-white">Destinations</li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            Popular Destinations
          </h1>
          <p className="mt-3 max-w-2xl text-base text-white/80 md:text-lg">
            Explore North India destinations served from Noida, Greater Noida
            and Delhi NCR. Every journey is planned around your dates and group
            size — not fixed tour packages.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site">
          <SectionHeader
            as="h2"
            title="Where Would You Like to Go?"
            subtitle="Select a destination to see highlights, travel notes and request a customized group travel quote."
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allDestinations.map((destination) => (
              <DestinationCard
                key={destination.slug}
                destination={destination}
              />
            ))}
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
