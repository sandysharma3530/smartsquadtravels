import Link from "next/link";
import {
  Briefcase,
  GraduationCap,
  Heart,
  Map,
  Plane,
  Users,
  Church,
  type LucideIcon,
} from "lucide-react";
import { type Service } from "@/content/services";
import { getServicesContent } from "@/lib/cms/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";

const iconMap: Record<Service["icon"], LucideIcon> = {
  users: Users,
  briefcase: Briefcase,
  heart: Heart,
  plane: Plane,
  temple: Church,
  graduation: GraduationCap,
  map: Map,
};

const tripTypeByServiceId: Record<string, string> = {
  family: "Family Trip",
  corporate: "Corporate Travel",
  wedding: "Wedding Transportation",
  airport: "Airport Transfer",
  religious: "Religious Journey",
  school: "School or College Trip",
  outstation: "Other",
};

type ServicesSectionProps = {
  className?: string;
};

export async function ServicesSection({ className }: ServicesSectionProps) {
  const { services } = await getServicesContent();
  return (
    <section className={cn("section-pad bg-bg-light", className)}>
      <div className="container-site">
        <SectionHeader
          title="Trips we arrange"
          subtitle="Family weekends, office days, weddings, airport groups, temple visits and school trips. The quote covers the vehicle and the driver."
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => {
            const Icon = iconMap[service.icon];
            const tripType =
              tripTypeByServiceId[service.id] ?? "Other";

            return (
              <article
                key={service.id}
                className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-soft"
              >
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal/10 text-teal">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="text-xl font-bold text-navy">{service.title}</h3>
                <p className="mt-2 flex-1 text-sm text-text-muted">
                  {service.description}
                </p>
                <Link
                  href={`/contact?tripType=${encodeURIComponent(tripType)}`}
                  className="mt-5 inline-flex text-sm font-semibold text-teal hover:text-teal-light"
                >
                  Price this trip →
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
