import Link from "next/link";
import { getHomeDestinations } from "@/lib/cms/content";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DestinationsSectionProps = {
  className?: string;
};

export async function DestinationsSection({ className }: DestinationsSectionProps) {
  const destinations = await getHomeDestinations(9);

  return (
    <section className={cn("section-pad", className)}>
      <div className="container-site">
        <SectionHeader
          title="Where we can take you"
          subtitle="Hill stations, temple towns and city breaks from Ghaziabad. Open a place to see how the drive usually works, then ask for a quote."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination) => (
            <DestinationCard key={destination.slug} destination={destination} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/destinations"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            See every route
          </Link>
        </div>
      </div>
    </section>
  );
}
