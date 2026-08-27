"use client";

import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, X } from "lucide-react";
import { getWhatsAppLink } from "@/content/site-config";
import { usePublicSite } from "@/components/cms/PublicSiteProvider";
import { isConfigured } from "@/lib/placeholders";
import { getVisibleNavItems } from "@/lib/cms/types";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { resolveBrandLogo } from "@/lib/cms/brand-logo";

type MobileNavigationProps = {
  open: boolean;
  onClose: () => void;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

function getFocusableElements(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.hasAttribute("disabled") && el.offsetParent !== null,
  );
}

function isNavActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileNavigation({ open, onClose }: MobileNavigationProps) {
  const site = usePublicSite();
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = "";
      previousFocusRef.current?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = getFocusableElements(panelRef.current);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, handleClose]);

  const showWhatsApp = isConfigured(site.whatsappNumber);
  const navItems = getVisibleNavItems(site.nav);
  const logo = resolveBrandLogo(site);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-navy/60 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!open}
        onClick={handleClose}
      />

      <div
        ref={panelRef}
        id="mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={cn(
          "fixed inset-y-0 right-0 z-[70] flex w-full max-w-sm flex-col bg-navy shadow-2xl transition-transform duration-300 ease-out md:hidden",
          open ? "translate-x-0" : "translate-x-full",
        )}
        inert={open ? undefined : true}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <Logo
            variant="light"
            showTagline={false}
            src={logo.header}
            width={logo.headerWidth}
            height={logo.headerHeight}
          />
          <button
            ref={closeButtonRef}
            type="button"
            onClick={handleClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-[#FFFFFF] transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-6" aria-label="Primary">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const active = isNavActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={handleClose}
                    className={cn(
                      "mobile-nav-link block rounded-xl px-4 py-3 text-base font-semibold transition-colors hover:bg-white/10",
                      active &&
                        "bg-white/10 underline decoration-[#00B8C4] decoration-2 underline-offset-4",
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

        <div className="space-y-3 border-t border-white/10 px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          {showWhatsApp ? (
            <a
              href={getWhatsAppLink(undefined, site.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "whatsapp", size: "lg" }), "w-full")}
              onClick={handleClose}
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              WhatsApp
            </a>
          ) : null}
          <Link
            href="/contact"
            className={cn(buttonVariants({ variant: "teal", size: "lg" }), "w-full")}
            onClick={handleClose}
          >
            Get a Quote
          </Link>
        </div>
      </div>
    </>
  );
}
