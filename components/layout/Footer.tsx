import type { ComponentType } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
} from "@/components/shared/SocialIcons";
import { hasGoogleReviewsConfigured } from "@/content/site-config";
import { isConfigured } from "@/lib/placeholders";
import { getPublicContent } from "@/lib/cms/content";
import { getVisibleNavItems, type CmsSite } from "@/lib/cms/types";
import { resolveBrandLogo } from "@/lib/cms/brand-logo";
import { Logo } from "@/components/shared/Logo";

type FooterLinkGroupProps = {
  title: string;
  links: { label: string; href?: string }[];
};

function FooterLinkGroup({ title, links }: FooterLinkGroupProps) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-teal-light">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href || link.label}>
            {link.href ? (
              <Link
                href={link.href}
                className="text-sm text-white/75 transition-colors hover:text-teal-light"
              >
                {link.label}
              </Link>
            ) : (
              <span className="text-sm text-white/75">{link.label}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function getSocialLinks(site: CmsSite) {
  const links: {
    href: string;
    label: string;
    icon: ComponentType<{ className?: string }>;
  }[] = [];

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

export async function Footer() {
  const content = await getPublicContent();
  const site = content.site;
  const footerDestinations = content.destinations.slice(0, 6);
  const services = content.services.services;
  const socialLinks = getSocialLinks(site);
  const showGoogleReviews = hasGoogleReviewsConfigured(site);
  const currentYear = new Date().getFullYear();
  const logo = resolveBrandLogo(site);

  return (
    <footer className="bg-navy text-white">
      <div className="container-site section-pad">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          <div className="space-y-4 md:col-span-2 xl:col-span-2">
            <Logo
              variant="light"
              showTagline={false}
              src={logo.header}
              width={logo.headerWidth}
              height={logo.headerHeight}
            />
            <p className="text-sm font-medium text-teal-light">{site.tagline}</p>
            <p className="max-w-sm text-sm leading-relaxed text-white/75">
              {site.shortDescription}
            </p>

            {socialLinks.length > 0 ? (
              <div className="flex items-center gap-2 pt-1">
                {socialLinks.map(({ href, label, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white/80 transition-colors hover:bg-teal hover:text-white"
                    aria-label={label}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                ))}
              </div>
            ) : null}

            {showGoogleReviews ? (
              <a
                href={site.googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm transition-colors hover:border-teal hover:bg-white/10"
              >
                <Star className="h-4 w-4 fill-gold text-gold" aria-hidden="true" />
                <span>
                  <span className="font-semibold text-white">
                    {site.trustStatistics.googleRating?.toFixed(1)}
                  </span>
                  <span className="text-white/70">
                    {" "}
                    · {site.trustStatistics.googleReviewCount} Google reviews
                  </span>
                </span>
              </a>
            ) : null}
          </div>

          <FooterLinkGroup
            title="Quick Links"
            links={getVisibleNavItems(site.nav).map((item) => ({
              label: item.label,
              href: item.href,
            }))}
          />

          <FooterLinkGroup
            title="Our Fleet"
            links={[
              { label: "Force Traveller", href: "/fleet#force-traveller" },
              { label: "Force Urbania", href: "/fleet#force-urbania" },
            ]}
          />

          <FooterLinkGroup
            title="Destinations"
            links={footerDestinations.map((d) => ({
              label: d.name,
              href: `/destinations/${d.slug}`,
            }))}
          />

          <FooterLinkGroup
            title="Services"
            links={services.map((s) => ({
              label: s.title,
            }))}
          />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col items-center justify-between gap-3 py-6 text-sm text-white/60 sm:flex-row">
          <p>
            © {currentYear} {site.legalName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="transition-colors hover:text-teal-light">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-teal-light">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
