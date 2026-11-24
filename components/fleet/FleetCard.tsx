"use client";

import { useState } from "react";
import { Check, Images } from "lucide-react";
import type { FleetVehicle } from "@/content/fleet";
import { getFleetBadge } from "@/content/fleet";
import { Button } from "@/components/ui/button";
import { FleetGalleryModal } from "@/components/fleet/FleetGalleryModal";
import { SafeCmsImage } from "@/components/shared/SafeCmsImage";
import { cn } from "@/lib/utils";

type FleetCardProps = {
  vehicle: FleetVehicle;
  className?: string;
  onOpenGallery?: (vehicle: FleetVehicle) => void;
};

export function FleetCard({
  vehicle,
  className,
  onOpenGallery,
}: FleetCardProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const badge = getFleetBadge(vehicle);

  function handleOpenGallery() {
    if (onOpenGallery) {
      onOpenGallery(vehicle);
      return;
    }
    setGalleryOpen(true);
  }

  return (
    <>
      <article
        className={cn(
          "overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft",
          className,
        )}
      >
        <div className="relative aspect-[16/10]">
          <SafeCmsImage
            src={vehicle.coverImage}
            alt={vehicle.coverAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 560px"
          />
          <span className="absolute left-4 top-4 rounded-full bg-teal px-3 py-1 text-xs font-semibold text-white">
            {badge}
          </span>
        </div>

        <div className="p-5 md:p-6">
          <h3 className="text-2xl font-bold text-navy">{vehicle.name}</h3>
          <p className="mt-2 text-sm text-text-muted">{vehicle.description}</p>

          {!vehicle.owned ? (
            <p className="mt-2 text-xs text-text-muted">
              Arranged for the dates you send. The quote names the vehicle.
            </p>
          ) : null}

          <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {vehicle.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2 text-sm text-text-main"
              >
                <Check
                  className="mt-0.5 h-4 w-4 shrink-0 text-teal"
                  aria-hidden="true"
                />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <Button
            type="button"
            variant="outline"
            size="md"
            className="mt-6 w-full sm:w-auto"
            onClick={handleOpenGallery}
            aria-label={`View ${vehicle.name} photo gallery`}
          >
            <Images className="h-4 w-4" aria-hidden="true" />
            View Gallery
          </Button>
        </div>
      </article>

      {!onOpenGallery ? (
        <FleetGalleryModal
          vehicle={vehicle}
          isOpen={galleryOpen}
          onClose={() => setGalleryOpen(false)}
        />
      ) : null}
    </>
  );
}
