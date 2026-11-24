"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Cctv,
  MessageCircle,
  Phone,
  Satellite,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { isHeroSlideEnabled, type CmsHeroSlide, type CmsHome } from "@/lib/cms/types";
import {
  getTelLink,
  getWhatsAppLink,
} from "@/content/site-config";
import { usePublicSite } from "@/components/cms/PublicSiteProvider";
import { SafeCmsImage } from "@/components/shared/SafeCmsImage";
import { isConfigured } from "@/lib/placeholders";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SLIDE_INTERVAL_MS = 7000;

const trustIconMap = {
  satellite: Satellite,
  cctv: Cctv,
  user: UserRound,
  shield: ShieldCheck,
} as const;

type HeroSliderProps = {
  children?: ReactNode;
  className?: string;
  slides: CmsHeroSlide[];
  trustPoints: CmsHome["heroTrustPoints"];
};

export function HeroSlider({ children, className, slides, trustPoints }: HeroSliderProps) {
  const site = usePublicSite();
  const heroSlides = slides.filter(isHeroSlideEnabled);
  const heroTrustPoints = trustPoints;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const slideCount = heroSlides.length;
  const activeSlide = heroSlides[activeIndex] || heroSlides[0];

  const goToSlide = useCallback(
    (index: number) => {
      if (!slideCount) return;
      setActiveIndex((index + slideCount) % slideCount);
    },
    [slideCount],
  );

  const goNext = useCallback(() => {
    goToSlide(activeIndex + 1);
  }, [activeIndex, goToSlide]);

  const goPrev = useCallback(() => {
    goToSlide(activeIndex - 1);
  }, [activeIndex, goToSlide]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || isPaused || slideCount < 2) return;

    const timer = window.setInterval(goNext, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [goNext, isPaused, prefersReducedMotion, slideCount]);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (!sectionEl?.contains(document.activeElement)) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

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

  if (!activeSlide) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative min-h-[560px] overflow-hidden lg:min-h-[640px]",
        className,
      )}
      aria-roledescription="carousel"
      aria-label="Featured travel highlights"
      tabIndex={0}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsPaused(false);
        }
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide.id}
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.45 }}
          className="absolute inset-0"
        >
          <SafeCmsImage
            src={activeSlide.image}
            alt={activeSlide.imageAlt}
            fill
            priority={activeIndex === 0}
            className="object-cover"
            sizes="100vw"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/75 to-navy/55"
            aria-hidden="true"
          />
        </motion.div>
      </AnimatePresence>

      <div className="container-site relative z-10 flex min-h-[560px] items-center py-16 lg:min-h-[640px]">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10">
          <div className="max-w-2xl text-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                initial={
                  prefersReducedMotion ? false : { opacity: 0, y: 16 }
                }
                animate={{ opacity: 1, y: 0 }}
                exit={
                  prefersReducedMotion ? undefined : { opacity: 0, y: -12 }
                }
                transition={{ duration: 0.4 }}
              >
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-teal-light">
                  {activeSlide.eyebrow}
                </p>

                <h1 className="text-balance text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                  {activeSlide.headingLines.map((line) => (
                    <span
                      key={line.text}
                      className={cn(
                        "block",
                        line.accent && "text-teal-light",
                      )}
                    >
                      {line.text}
                    </span>
                  ))}
                </h1>

                <p className="mt-4 max-w-xl text-base text-white/90 md:text-lg">
                  {activeSlide.description}
                </p>

                {activeSlide.showTrustPoints ? (
                  <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {heroTrustPoints.map((point) => {
                      const Icon = trustIconMap[point.icon];
                      return (
                        <li
                          key={point.id}
                          className="flex flex-col items-start gap-2 text-sm text-white/90 sm:items-center sm:text-center"
                        >
                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-teal text-white">
                            <Icon className="h-4 w-4" aria-hidden="true" />
                          </span>
                          <span>{point.label}</span>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}

                {activeSlide.showCtas ? (
                  <div className="mt-8 flex flex-wrap gap-3">
                    {isConfigured(site.phoneInternational) ? (
                      <Link
                        href={getTelLink(site.phoneInternational)}
                        className={buttonVariants({
                          variant: "teal",
                          size: "lg",
                        })}
                        aria-label="Call Smart Squad Travels now"
                      >
                        <Phone className="h-4 w-4" aria-hidden="true" />
                        Call Now
                      </Link>
                    ) : null}
                    {isConfigured(site.whatsappNumber) ? (
                      <a
                        href={getWhatsAppLink(
                          `Hi ${site.businessName}, I would like a travel quote.`,
                          site.whatsappNumber,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={buttonVariants({
                          variant: "whatsapp",
                          size: "lg",
                        })}
                        aria-label="Contact Smart Squad Travels on WhatsApp"
                      >
                        <MessageCircle className="h-4 w-4" aria-hidden="true" />
                        WhatsApp Us
                      </a>
                    ) : (
                      <Link
                        href="/contact#enquiry"
                        className={buttonVariants({
                          variant: "teal",
                          size: "lg",
                        })}
                      >
                        Get a quote
                      </Link>
                    )}
                  </div>
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>

          {children ? (
            <div className="w-full max-w-md justify-self-end lg:max-w-none">
              {children}
            </div>
          ) : null}
        </div>
      </div>

      {slideCount > 1 ? (
        <>
          <button
            type="button"
            className="absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-white/15 p-2 text-white backdrop-blur transition hover:bg-white/25 md:left-5 md:flex"
            onClick={goPrev}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" aria-hidden="true" />
          </button>

          <button
            type="button"
            className="absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-white/15 p-2 text-white backdrop-blur transition hover:bg-white/25 md:right-5 md:flex"
            onClick={goNext}
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" aria-hidden="true" />
          </button>

          <div
            className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2"
            role="tablist"
            aria-label="Choose a hero slide"
          >
            {heroSlides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={`Go to slide ${index + 1}: ${slide.headingLines.map((line) => line.text).join(" ")}`}
                className={cn(
                  "h-2.5 rounded-full transition-all",
                  index === activeIndex
                    ? "w-8 bg-teal-light"
                    : "w-2.5 bg-white/50 hover:bg-white/80",
                )}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
