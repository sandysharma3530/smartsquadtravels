"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import { Menu, Phone } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
} from "@/components/shared/SocialIcons";
import { getTelLink } from "@/content/site-config";
import { isConfigured } from "@/lib/placeholders";
import { usePublicSite } from "@/components/cms/PublicSiteProvider";
import { getVisibleNavItems } from "@/lib/cms/types";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { resolveBrandLogo } from "@/lib/cms/brand-logo";

function isNavActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

type SocialLink = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

function getSocialLinks(site: ReturnType<typeof usePublicSite>): SocialLink[] {
  const links: SocialLink[] = [];

  if (isConfigured(site.social.facebookUrl)) {
    links.push({
      href: site.social.facebookUrl,
      label: "Facebook",
      icon: FacebookIcon,
    });
  }
  if (isConfigured(site.social.instagramUrl)) {
    links.push({
      href: site.social.instagramUrl,
      label: "Instagram",
      icon: InstagramIcon,
    });
  }
  if (isConfigured(site.social.youtubeUrl)) {
    links.push({
      href: site.social.youtubeUrl,
      label: "YouTube",
      icon: YoutubeIcon,
    });
  }

  return links;
}

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const site = usePublicSite();

  const phoneConfigured = isConfigured(site.phoneInternational);
  const socialLinks = getSocialLinks(site);
  const navItems = getVisibleNavItems(site.nav);
  const logo = resolveBrandLogo(site);

  return (
    <>
      <header className="site-header sticky top-0 z-50 border-b border-white/10 bg-navy shadow-md">
        <div className="container-site flex h-[var(--header-height)] items-center justify-between gap-3 xl:gap-4">
          <Logo
            variant="light"
            className="shrink-0"
            priority
            src={logo.header}
            width={logo.headerWidth}
            height={logo.headerHeight}
          />

          <nav
            className="site-nav hidden min-w-0 flex-1 items-center justify-center lg:flex"
            aria-label="Primary"
          >
            <ul className="flex flex-nowrap items-center justify-center gap-0.5 xl:gap-1">
              {navItems.map((item) => {
                const active = isNavActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "site-nav-link whitespace-nowrap rounded-lg px-2.5 py-2 text-[13px] font-semibold tracking-wide transition-colors xl:px-3 xl:text-sm",
                        active && "site-nav-link-active",
                      )}
                      style={{ color: active ? "#32D5D2" : "#FFFFFF" }}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="hidden shrink-0 items-center gap-2 xl:flex">
            {phoneConfigured ? (
              <a
                href={getTelLink(site.phoneInternational)}
                className="inline-flex max-w-[220px] items-center gap-1.5 truncate text-sm font-medium text-[#F5F8FC] transition-colors hover:text-[#32D5D2]"
                aria-label={`Call ${site.phoneDisplay}`}
              >
                <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{site.phoneDisplay}</span>
              </a>
            ) : null}

            {socialLinks.length > 0 ? (
              <div className="flex items-center gap-1 border-l border-white/15 pl-2">
                {socialLinks.map(({ href, label, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#F5F8FC] transition-colors hover:bg-white/10 hover:text-[#32D5D2]"
                    aria-label={label}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                ))}
              </div>
            ) : null}

            <Link
              href="/contact"
              className={cn(
                buttonVariants({ variant: "teal", size: "sm" }),
                "whitespace-nowrap",
              )}
            >
              Get a Quote
            </Link>
          </div>

          {/* Compact CTA on lg when social icons hide */}
          <div className="hidden shrink-0 items-center gap-2 lg:flex xl:hidden">
            {phoneConfigured ? (
              <a
                href={getTelLink(site.phoneInternational)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#F5F8FC] transition-colors hover:text-[#32D5D2]"
                aria-label={`Call ${site.phoneDisplay}`}
              >
                <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="whitespace-nowrap">{site.phoneDisplay}</span>
              </a>
            ) : null}
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ variant: "teal", size: "sm" }),
                "whitespace-nowrap",
              )}
            >
              Get a Quote
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            {phoneConfigured ? (
              <a
                href={getTelLink(site.phoneInternational)}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-white/35 bg-transparent px-3 text-sm font-semibold text-[#FFFFFF] transition-colors hover:bg-white hover:text-navy"
                aria-label={`Call ${site.phoneDisplay}`}
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Call</span>
              </a>
            ) : null}

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-[#FFFFFF] transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <MobileNavigation open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
