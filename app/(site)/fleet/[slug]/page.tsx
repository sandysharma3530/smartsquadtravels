import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { getFleetBadge } from "@/content/fleet";
import { getFleetBySlug, getPublishedContent } from "@/lib/cms/content";
import { FleetDetailGallery } from "@/components/fleet/FleetDetailGallery";
import { ContactCTA } from "@/components/shared/ContactCTA";
import { JsonLd } from "@/components/shared/JsonLd";
import { SafeCmsImage } from "@/components/shared/SafeCmsImage";
import { buttonVariants } from "@/components/ui/button";
import {
  breadcrumbJsonLd,
  createMetadata,
  vehicleServiceJsonLd,
} from "@/lib/seo";
import { cn } from "@/lib/utils";

type FleetDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = true;

export async function generateStaticParams() {
  const { fleet } = await getPublishedContent();
  return fleet.filter((vehicle) => vehicle.available).map((vehicle) => ({
    slug: vehicle.slug,
  }));
}

export async function generateMetadata({ params }: FleetDetailPageProps) {
  const { slug } = await params;
  const vehicle = await getFleetBySlug(slug);

  if (!vehicle) {
    return createMetadata({ title: "Vehicle Not Found", noIndex: true });
  }

  return createMetadata({
    title: `${vehicle.name} Rental in Delhi NCR`,
    description: `${vehicle.description} Request a customized quotation for group travel from Noida, Greater Noida and Delhi NCR.`,
    path: `/fleet/${vehicle.slug}`,
    image: vehicle.coverImage,
    keywords: [
      `${vehicle.name} rental`,
      `${vehicle.name} Delhi NCR`,
      `${vehicle.name} Noida`,
      "group transportation",
      "Traveller hire",
    ],
  });
}

export default async function FleetDetailPage({ params }: FleetDetailPageProps) {
  const { slug } = await params;
  const vehicle = await getFleetBySlug(slug);

  if (!vehicle) {
    notFound();
  }

  const badge = getFleetBadge(vehicle);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Fleet", path: "/fleet" },
            { name: vehicle.name, path: `/fleet/${vehicle.slug}` },
          ]),
          vehicleServiceJsonLd(vehicle),
        ]}
      />

      <section className="relative bg-navy">
        <div className="relative aspect-[21/9] max-h-[420px] w-full md:aspect-[21/8]">
          <SafeCmsImage
            src={vehicle.coverImage}
            alt={vehicle.coverAlt}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-navy/30"
            aria-hidden="true"
          />
        </div>

        <div className="container-site relative -mt-24 pb-10 md:-mt-28">
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-white/70">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="transition hover:text-teal-light">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/fleet"
                  className="transition hover:text-teal-light"
                >
                  Fleet
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-white">{vehicle.name}</li>
            </ol>
          </nav>

          <span className="inline-block rounded-full bg-teal px-3 py-1 text-xs font-semibold text-white">
            {badge}
          </span>
          <h1 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            {vehicle.name}
          </h1>
          <p className="mt-3 max-w-2xl text-base text-white/85">
            {vehicle.description}
          </p>

          {!vehicle.owned ? (
            <p className="mt-2 max-w-2xl text-sm text-white/70">
              Available through our travel network — customized quotes based on
              your route and dates.
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/contact?vehicle=${encodeURIComponent(vehicle.slug)}`}
              className={cn(buttonVariants({ variant: "teal", size: "lg" }))}
            >
              Request Quote
            </Link>
            <Link
              href="/fleet"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-white/30 bg-white/10 text-white hover:bg-white/20",
              )}
            >
              Back to Fleet
            </Link>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <h2 className="text-2xl font-bold text-navy">Features</h2>
              <ul className="mt-5 grid gap-3">
                {vehicle.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-text-main"
                  >
                    <Check
                      className="mt-0.5 h-5 w-5 shrink-0 text-teal"
                      aria-hidden="true"
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-navy">Photo Gallery</h2>
              <p className="mt-2 text-sm text-text-muted">
                Tap any photo to open the full gallery with keyboard and swipe
                navigation.
              </p>
              <div className="mt-6">
                <FleetDetailGallery vehicle={vehicle} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactCTA
        heading={`Book the ${vehicle.shortName} for your trip`}
        text="Share your travel dates, pickup location and destination for a customized quotation."
      />
    </>
  );
}
