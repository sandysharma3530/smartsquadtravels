import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/content/site-config";
import { DEFAULT_BRAND_LOGO, isRemoteLogoSrc } from "@/lib/cms/brand-logo";

type LogoProps = {
  variant?: "light" | "dark";
  className?: string;
  showTagline?: boolean;
  /** When true, shows HTML SMART SQUAD / TRAVELS text beside the mark. */
  showWordmark?: boolean;
  priority?: boolean;
  src?: string;
  width?: number;
  height?: number;
};

/**
 * Brand lockup — logo image by default (no HTML wordmark).
 * The frame keeps a fixed header height and lets wide or square uploads
 * scale with object-contain so they are not stretched or cropped.
 */
export function Logo({
  variant = "dark",
  className,
  showTagline = false,
  showWordmark = false,
  priority = false,
  src = DEFAULT_BRAND_LOGO.header,
  width = DEFAULT_BRAND_LOGO.headerWidth,
  height = DEFAULT_BRAND_LOGO.headerHeight,
}: LogoProps) {
  const isLight = variant === "light";
  const imageWidth = width || 560;
  const imageHeight = height || 438;

  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2",
        isLight
          ? "focus-visible:ring-offset-navy"
          : "focus-visible:ring-offset-white",
        className,
      )}
      aria-label={`${siteConfig.businessName} — Home`}
    >
      <span className="relative flex h-[3.75rem] max-w-[10.5rem] items-center sm:h-16 sm:max-w-[12rem] md:h-[4.5rem] md:max-w-[14rem]">
        <Image
          src={src}
          alt=""
          width={imageWidth}
          height={imageHeight}
          sizes="(max-width: 640px) 168px, (max-width: 768px) 192px, 224px"
          className="max-h-full w-auto max-w-full object-contain object-left transition-transform duration-300 group-hover:scale-[1.03]"
          priority={priority}
          unoptimized={isRemoteLogoSrc(src)}
        />
      </span>

      {showWordmark ? (
        <span className="flex flex-col justify-center leading-none">
          <span
            className={cn(
              "font-heading text-[13px] font-bold tracking-[0.04em] sm:text-[15px]",
              isLight ? "text-white" : "text-navy",
            )}
          >
            SMART SQUAD
          </span>
          <span
            className={cn(
              "mt-1 text-[10px] font-semibold tracking-[0.28em] sm:text-[11px]",
              isLight ? "text-teal-light" : "text-teal",
            )}
          >
            TRAVELS
          </span>
          {showTagline ? (
            <span
              className={cn(
                "mt-1.5 text-[10px] font-medium tracking-wide",
                isLight ? "text-white/70" : "text-text-muted",
              )}
            >
              {siteConfig.tagline}
            </span>
          ) : null}
        </span>
      ) : null}
    </Link>
  );
}
