import Link from "next/link";
import { getDestinations } from "@/lib/cms/content";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { ContactCTA } from "@/components/shared/ContactCTA";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Places we drive to",
  description:
    "Hill stations, temple towns and city breaks Smart Squad Travels drives to from Ghaziabad, Noida and Delhi. Open a place to see how the drive works, then ask for a quote.",
  path: "/destinations",
  keywords: [
    "Manali drive from Ghaziabad",
    "Nainital group vehicle Noida",
    "Jaipur trip from Ghaziabad",
    "Kedarnath road travel",
    "North India group drive",
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
            Places we drive to
          </h1>
          <p className="mt-3 max-w-2xl text-base text-white/80 md:text-lg">
            Hill stations, temple towns and city breaks from Ghaziabad, Noida
            and Delhi. Open a place to see how the drive usually works, then
            ask for a quote. You arrange your own hotel.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site">
          <SectionHeader
            as="h2"
            title="Choose a destination"
            subtitle="Each page explains the drive, the better months to go, and what to tell us when you ask for a quote."
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
