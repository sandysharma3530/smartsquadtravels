"use client";

import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { getTelLink, getWhatsAppLink } from "@/content/site-config";
import { usePublicSite } from "@/components/cms/PublicSiteProvider";
import { isConfigured } from "@/lib/placeholders";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function MobileStickyBar() {
  const site = usePublicSite();
  const phoneConfigured = isConfigured(site.phoneInternational);
  const whatsappConfigured = isConfigured(site.whatsappNumber);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-navy shadow-[0_-4px_20px_rgba(6,27,54,0.25)] md:hidden",
        "pb-[env(safe-area-inset-bottom)]",
      )}
      role="region"
      aria-label="Quick contact actions"
    >
      <div className="grid grid-cols-3 gap-1 p-2">
        {phoneConfigured ? (
          <a
            href={getTelLink(site.phoneInternational)}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "h-auto flex-col gap-1 rounded-lg py-2.5 text-xs",
            )}
            aria-label={`Call ${site.phoneDisplay}`}
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            Call
          </a>
        ) : (
          <span
            className="flex flex-col items-center justify-center gap-1 rounded-lg py-2.5 text-xs text-white/40"
            aria-hidden="true"
          />
        )}

        {whatsappConfigured ? (
          <a
            href={getWhatsAppLink(undefined, site.whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "h-auto flex-col gap-1 rounded-lg py-2.5 text-xs text-[#25D366] hover:bg-[#25D366]/10",
            )}
            aria-label="WhatsApp"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            WhatsApp
          </a>
        ) : (
          <span
            className="flex flex-col items-center justify-center gap-1 rounded-lg py-2.5 text-xs text-white/40"
            aria-hidden="true"
          />
        )}

        <Link
          href="/contact"
          className={cn(
            buttonVariants({ variant: "teal", size: "sm" }),
            "h-auto flex-col gap-1 rounded-lg py-2.5 text-xs",
          )}
        >
          Ask price
        </Link>
      </div>
    </div>
  );
}
