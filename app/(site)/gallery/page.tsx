import Link from "next/link";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { getGalleryContent } from "@/lib/cms/content";
import { ContactCTA } from "@/components/shared/ContactCTA";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Fleet & Trip Photo Gallery",
  description:
    "Browse photos of Force Traveller and Force Urbania vehicles, trip locations, weddings, corporate travel and religious journeys with Smart Squad Travels.",
  path: "/gallery",
});

export default async function GalleryPage() {
  const gallery = await getGalleryContent();
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
              <li className="text-white">Gallery</li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            Photo Gallery
          </h1>
          <p className="mt-3 max-w-2xl text-base text-white/80 md:text-lg">
            Explore our fleet, interiors, trip locations and group travel
            moments. Tap any photo to open the lightbox.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site">
          <SectionHeader
            as="h2"
            title="Browse by Category"
            subtitle="Filter photos by vehicle type, interiors, exteriors, trip locations and more."
          />
          <GalleryGrid items={gallery.items} categories={gallery.categories} />
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
