"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  X,
} from "lucide-react";
import type { FleetImage, FleetVehicle } from "@/content/fleet";
import { getWhatsAppLink } from "@/content/site-config";
import { usePublicSite } from "@/components/cms/PublicSiteProvider";
import { SafeCmsImage } from "@/components/shared/SafeCmsImage";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FleetGalleryModalProps = {
  vehicle: FleetVehicle;
  isOpen: boolean;
  initialIndex?: number;
  onClose: () => void;
};

export function FleetGalleryModal({
  vehicle,
  isOpen,
  initialIndex = 0,
  onClose,
}: FleetGalleryModalProps) {
  const site = usePublicSite();
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const modalRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const images = vehicle.gallery;
  const activeImage = images[activeIndex];

  const goTo = useCallback(
    (index: number) => {
      if (!images.length) return;
      setActiveIndex((index + images.length) % images.length);
    },
    [images.length],
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    if (isOpen) {
      setActiveIndex(initialIndex);
    }
  }, [initialIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    modalRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [goNext, goPrev, isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modal = modalRef.current;
    const focusable = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    function handleTab(event: KeyboardEvent) {
      if (event.key !== "Tab" || focusable.length === 0) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    modal.addEventListener("keydown", handleTab);
    return () => modal.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  if (!isOpen || !activeImage) return null;

  function handleTouchStart(event: React.TouchEvent) {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event: React.TouchEvent) {
    if (touchStartX.current == null) return;
    const deltaX = event.changedTouches[0]?.clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(deltaX) < 50) return;
    if (deltaX > 0) goPrev();
    else goNext();
  }

  const quoteMessage = `Hi ${site.businessName}, I would like a quote for the ${vehicle.name}.`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/95 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fleet-gallery-title"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl outline-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 md:px-6">
          <div>
            <h2 id="fleet-gallery-title" className="text-lg font-bold text-navy">
              {vehicle.name} Gallery
            </h2>
            <p className="text-sm text-text-muted">
              {activeIndex + 1} of {images.length}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-navy transition hover:bg-slate-100"
            aria-label="Close gallery"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="relative aspect-[16/10] bg-navy">
          <SafeCmsImage
            src={activeImage.src}
            alt={activeImage.alt}
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 960px"
            priority={activeIndex === initialIndex}
          />

          <button
            type="button"
            onClick={goPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-navy shadow"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={goNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-navy shadow"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <p className="px-4 py-3 text-center text-sm text-text-muted md:px-6">
          {activeImage.caption}
        </p>

        <div className="flex gap-2 overflow-x-auto px-4 pb-3 md:px-6">
          {images.map((image: FleetImage, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => goTo(index)}
              className={cn(
                "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition",
                index === activeIndex
                  ? "border-teal"
                  : "border-transparent opacity-70 hover:opacity-100",
              )}
              aria-label={`View image ${index + 1}: ${image.caption}`}
              aria-current={index === activeIndex ? "true" : undefined}
            >
              {Math.abs(index - activeIndex) <= 2 ? (
                <SafeCmsImage
                  src={image.src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              ) : (
                <span className="flex h-full items-center justify-center bg-slate-100 text-xs text-text-muted">
                  {index + 1}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 border-t border-slate-100 px-4 py-4 md:px-6">
          <Link
            href={`/contact?vehicle=${encodeURIComponent(vehicle.slug)}`}
            className={buttonVariants({ variant: "teal", size: "md" })}
          >
            Get a quote
          </Link>
          <a
            href={getWhatsAppLink(quoteMessage, site.whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "whatsapp", size: "md" })}
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
