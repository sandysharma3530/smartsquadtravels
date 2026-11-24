import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Destination } from "@/content/destinations";
import { SafeCmsImage } from "@/components/shared/SafeCmsImage";
import { cn } from "@/lib/utils";

type DestinationCardProps = {
  destination: Destination;
  className?: string;
};

export function DestinationCard({
  destination,
  className,
}: DestinationCardProps) {
  const detailHref = `/destinations/${destination.slug}`;
  const quoteHref = `/contact?destination=${encodeURIComponent(destination.name)}`;

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-navy shadow-soft",
        className,
      )}
    >
      <Link
        href={detailHref}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
        aria-label={`View ${destination.name} travel details`}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <SafeCmsImage
            src={destination.coverImage}
            alt={destination.coverAlt}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Strong bottom scrim so labels stay readable on bright photos */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-navy via-navy/55 to-transparent"
            aria-hidden="true"
          />

          <div className="absolute inset-x-0 bottom-0 z-20 p-0">
            <div className="flex items-center gap-2 bg-[#0A3A4A]/95 px-4 py-3 backdrop-blur-sm">
              <MapPin
                className="h-4 w-4 shrink-0 text-teal-light"
                aria-hidden="true"
              />
              {/* Explicit text-white: global h3 styles force navy and hide names */}
              <h3 className="text-base font-bold leading-snug text-white drop-shadow-sm md:text-lg">
                {destination.name}
              </h3>
            </div>
          </div>

          <span className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-navy/35 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
            <span className="rounded-xl bg-teal px-4 py-2 text-sm font-semibold text-white shadow-lg">
              See this place
            </span>
          </span>
        </div>
      </Link>

      <div className="absolute right-3 top-3 z-30 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
        <Link
          href={quoteHref}
          className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-navy shadow-md hover:bg-teal hover:text-white focus-visible:opacity-100"
        >
          Get a quote
        </Link>
      </div>
    </article>
  );
}
