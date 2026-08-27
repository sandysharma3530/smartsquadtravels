import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Calendar,
  Car,
  Clock,
  MapPin,
  Mountain,
  Users,
} from "lucide-react";
import {
  getDestinationBySlug,
  getFleetVehicles,
  getPublishedContent,
} from "@/lib/cms/content";
import { DestinationGallery } from "@/components/destinations/DestinationGallery";
import { QuickEnquiryForm } from "@/components/forms/QuickEnquiryForm";
import { ContactCTA } from "@/components/shared/ContactCTA";
import { JsonLd } from "@/components/shared/JsonLd";
import {
  breadcrumbJsonLd,
  createMetadata,
  destinationTouristPlaceJsonLd,
} from "@/lib/seo";

type DestinationDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = true;

export async function generateStaticParams() {
  const { destinations } = await getPublishedContent();
  return destinations.map((destination) => ({ slug: destination.slug }));
}

export async function generateMetadata({ params }: DestinationDetailPageProps) {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);

  if (!destination) {
    return createMetadata({ title: "Destination Not Found", noIndex: true });
  }

  return createMetadata({
    title: `${destination.name} Traveller from Delhi NCR`,
    description: `${destination.shortDescription} Request a customized Force Traveller or Urbania quote for group travel to ${destination.name} from Noida and Delhi NCR.`,
    path: `/destinations/${destination.slug}`,
    image: destination.coverImage,
    keywords: [
      `${destination.name} Traveller`,
      `${destination.name} from Delhi NCR`,
      `${destination.name} group travel`,
      destination.region,
      "customized outstation travel",
    ],
  });
}

export default async function DestinationDetailPage({
  params,
}: DestinationDetailPageProps) {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);

  if (!destination) {
    notFound();
  }

  const fleetVehicles = await getFleetVehicles();
  const recommendedVehicleNames = destination.recommendedVehicles
    .map((vehicleSlug) => fleetVehicles.find((v) => v.slug === vehicleSlug)?.name)
    .filter(Boolean) as string[];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Destinations", path: "/destinations" },
            {
              name: destination.name,
              path: `/destinations/${destination.slug}`,
            },
          ]),
          destinationTouristPlaceJsonLd(destination),
        ]}
      />

      <section className="relative bg-navy">
        <div className="relative aspect-[21/9] max-h-[420px] w-full md:aspect-[21/8]">
          <Image
            src={destination.coverImage}
            alt={destination.coverAlt}
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
                  href="/destinations"
                  className="transition hover:text-teal-light"
                >
                  Destinations
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-white">{destination.name}</li>
            </ol>
          </nav>

          <div className="flex items-center gap-2 text-teal-light">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            <span className="text-sm font-medium uppercase tracking-wide">
              {destination.region}
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
            {destination.name}
          </h1>
          <p className="mt-3 max-w-2xl text-base text-white/85">
            {destination.shortDescription}
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site">
          <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start">
            <div className="space-y-10">
              <div>
                <h2 className="text-2xl font-bold text-navy">Introduction</h2>
                <p className="mt-4 leading-relaxed text-text-muted">
                  {destination.introduction}
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-navy">Highlights</h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {destination.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-start gap-2 rounded-xl border border-slate-100 bg-bg-light px-4 py-3 text-sm text-text-main"
                    >
                      <Mountain
                        className="mt-0.5 h-4 w-4 shrink-0 text-teal"
                        aria-hidden="true"
                      />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-soft">
                  <div className="flex items-center gap-2 text-teal">
                    <Calendar className="h-5 w-5" aria-hidden="true" />
                    <h3 className="font-bold text-navy">Recommended Months</h3>
                  </div>
                  <p className="mt-2 text-sm text-text-muted">
                    {destination.recommendedMonths}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-soft">
                  <div className="flex items-center gap-2 text-teal">
                    <Clock className="h-5 w-5" aria-hidden="true" />
                    <h3 className="font-bold text-navy">
                      Suggested Duration
                    </h3>
                  </div>
                  <p className="mt-2 text-sm text-text-muted">
                    {destination.suggestedDuration}
                  </p>
                  <p className="mt-1 text-xs text-teal">
                    Fully customizable for your group
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-navy">Road Travel Notes</h2>
                <p className="mt-4 leading-relaxed text-text-muted">
                  {destination.roadTravelNotes}
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-navy">Suitable For</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {destination.suitableFor.map((item) => (
                    <li
                      key={item}
                      className="inline-flex items-center gap-1.5 rounded-full bg-bg-light px-3 py-1.5 text-sm text-text-main"
                    >
                      <Users className="h-3.5 w-3.5 text-teal" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-navy">
                  Recommended Vehicles
                </h2>
                <ul className="mt-4 space-y-2">
                  {recommendedVehicleNames.map((name) => (
                    <li
                      key={name}
                      className="flex items-center gap-2 text-text-main"
                    >
                      <Car className="h-4 w-4 text-teal" aria-hidden="true" />
                      {name}
                    </li>
                  ))}
                </ul>
              </div>

              {destination.gallery && destination.gallery.length > 0 ? (
                <div>
                  <h2 className="text-2xl font-bold text-navy">Gallery</h2>
                  <div className="mt-6">
                    <DestinationGallery
                      images={destination.gallery}
                      title={destination.name}
                    />
                  </div>
                </div>
              ) : null}

              {destination.nearbyPlaces.length > 0 ? (
                <div>
                  <h2 className="text-2xl font-bold text-navy">
                    Nearby Places
                  </h2>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {destination.nearbyPlaces.map((place) => (
                      <li
                        key={place}
                        className="rounded-full border border-slate-200 px-3 py-1 text-sm text-text-muted"
                      >
                        {place}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <aside className="lg:sticky lg:top-24">
              <QuickEnquiryForm
                sourcePage={`/destinations/${destination.slug}`}
                defaultDestination={destination.name}
              />
            </aside>
          </div>
        </div>
      </section>

      <ContactCTA
        heading={`Plan your ${destination.name} trip`}
        text="Share your travel dates and group size for a customized Force Traveller or Urbania quotation."
      />
    </>
  );
}
