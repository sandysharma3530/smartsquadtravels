import { getFleetVehicles } from "@/lib/cms/content";
import { FleetCard } from "@/components/fleet/FleetCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";

type FleetSectionProps = {
  className?: string;
};

export async function FleetSection({ className }: FleetSectionProps) {
  const fleetVehicles = await getFleetVehicles();
  return (
    <section className={cn("section-pad bg-bg-light", className)}>
      <div className="container-site">
        <SectionHeader
          title="Our vehicles"
          subtitle="The 21-seat Traveller for a full group. The Urbania when fewer people want a quieter, more comfortable long day."
        />

        <div className="grid gap-8 lg:grid-cols-2">
          {fleetVehicles.map((vehicle) => (
            <FleetCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </div>
    </section>
  );
}
