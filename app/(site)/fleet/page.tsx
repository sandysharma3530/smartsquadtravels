import Link from "next/link";
import { getFleetVehicles } from "@/lib/cms/content";
import { FleetCard } from "@/components/fleet/FleetCard";
import { ContactCTA } from "@/components/shared/ContactCTA";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Traveller and Urbania",
  description:
    "Compare the 21-seat Force Traveller and the Force Urbania that Smart Squad Travels arranges from Ghaziabad for group trips across North India.",
  path: "/fleet",
  keywords: [
    "21 seater Force Traveller Ghaziabad",
    "Force Urbania Ghaziabad",
    "group vehicle Noida",
    "Traveller hire Delhi",
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
            Our vehicles
          </h1>
          <p className="mt-3 max-w-2xl text-base text-white/80 md:text-lg">
            Choose the 21-seat Traveller for a larger group, or the Urbania
            when fewer people want a more comfortable ride. The price follows
            your route. This page does not list fixed packages.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site">
          <SectionHeader
            as="h2"
            title="See them side by side"
            subtitle="Compare seating and photos here. We will confirm which vehicle is free on your dates before you book."
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
