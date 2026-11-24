import Link from "next/link";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { getGalleryContent } from "@/lib/cms/content";
import { ContactCTA } from "@/components/shared/ContactCTA";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Photos",
  description:
    "Photos of the Force Traveller and Force Urbania, and a few of the places Smart Squad Travels drives to from Ghaziabad.",
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
            Photos
          </h1>
          <p className="mt-3 max-w-2xl text-base text-white/80 md:text-lg">
            A look inside and outside the vehicles, plus a few of the places we
            drive to. Tap any picture to see it larger.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site">
          <SectionHeader
            as="h2"
            title="Browse the pictures"
            subtitle="Filter by vehicle, inside, outside, or a place we drive to."
          />
          <GalleryGrid items={gallery.items} categories={gallery.categories} />
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
