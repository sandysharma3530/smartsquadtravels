import Link from "next/link";
import { getFleetVehicles } from "@/lib/cms/content";
import { FleetCard } from "@/components/fleet/FleetCard";
import { ContactCTA } from "@/components/shared/ContactCTA";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Force Traveller & Urbania Fleet",
  description:
    "Explore Force Traveller (21-seater) and Force Urbania options for family trips, corporate travel, weddings, pilgrimages and customized outstation journeys from Delhi NCR.",
  path: "/fleet",
  keywords: [
    "21 seater Force Traveller",
    "Force Urbania rental",
    "group van hire Delhi NCR",
    "Traveller fleet Noida",
  ],
});

export default async function FleetPage() {
  const fleetVehicles = await getFleetVehicles();
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
              <li className="text-white">Fleet</li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            Our Fleet
          </h1>
          <p className="mt-3 max-w-2xl text-base text-white/80 md:text-lg">
            Comfortable, spacious and well-maintained vehicles for every group
            journey — request a customized quote based on your route and dates.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site">
          <SectionHeader
            as="h2"
            title="Choose Your Vehicle"
            subtitle="Compare seating, features and gallery photos. Pricing is shared as a custom quotation — no fixed packages listed online."
          />

          <div className="grid gap-8 lg:grid-cols-2">
            {fleetVehicles.map((vehicle) => (
              <FleetCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {fleetVehicles.map((vehicle) => (
              <Link
                key={vehicle.id}
                href={`/fleet/${vehicle.slug}`}
                className="text-sm font-semibold text-teal hover:underline"
              >
                {vehicle.name} details →
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
