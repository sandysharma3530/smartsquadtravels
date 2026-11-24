import Link from "next/link";
import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import {
  getTelLink,
  getMailtoLink,
  getWhatsAppLink,
} from "@/content/site-config";
import { getPublicContent } from "@/lib/cms/content";
import type { CmsSite } from "@/lib/cms/types";
import type { FleetVehicle } from "@/content/fleet";
import { ContactEnquiryForm } from "@/components/forms/ContactEnquiryForm";
import {
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
} from "@/components/shared/SocialIcons";
import { buttonVariants } from "@/components/ui/button";
import { isConfigured } from "@/lib/placeholders";
import { createMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";
import type { vehicleOptions } from "@/lib/validation";

export const metadata = createMetadata({
  title: "Contact us",
  description:
    "Call, WhatsApp or send a form to Smart Squad Travels in Ghaziabad. Share your date, pickup point and group size for a Traveller or Urbania quote.",
  path: "/contact",
  keywords: [
    "Smart Squad Travels Ghaziabad",
    "Force Traveller price Noida",
    "group vehicle enquiry",
    "WhatsApp Traveller Ghaziabad",
  ],
});

type ContactPageProps = {
  searchParams: Promise<{
    destination?: string;
    vehicle?: string;
  }>;
};

function resolveVehicleDefault(
  fleetVehicles: FleetVehicle[],
  vehicleSlug?: string,
): (typeof vehicleOptions)[number] | undefined {
  if (!vehicleSlug) return undefined;

  const vehicle = fleetVehicles.find((v) => v.slug === vehicleSlug);
  if (!vehicle) return undefined;

  if (vehicle.slug === "force-traveller") return "Force Traveller";
  if (vehicle.slug === "force-urbania") return "Force Urbania";
  return undefined;
}

function getSocialLinks(site: CmsSite) {
  const links: {
    href: string;
    label: string;
    icon: typeof FacebookIcon;
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

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams;
  const content = await getPublicContent();
  const site = content.site;
  const fleetVehicles = content.fleet;
  const defaultDestination = params.destination ?? "";
  const defaultVehicle = resolveVehicleDefault(fleetVehicles, params.vehicle);

  const phoneConfigured = isConfigured(site.phoneDisplay);
  const emailConfigured = isConfigured(site.publicEmail);
  const whatsappConfigured = isConfigured(site.whatsappNumber);
  const addressConfigured = isConfigured(site.address.line1);
  const socialLinks = getSocialLinks(site);

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
              <li className="text-white">Contact Us</li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            Contact Us
          </h1>
          <p className="mt-3 max-w-2xl text-base text-white/80 md:text-lg">
            {content.pages.contactIntro}
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site">
          <div className="grid gap-10 lg:grid-cols-[1fr_400px] lg:items-start">
            <div className="space-y-8">
              <div className="grid gap-6 sm:grid-cols-2">
                {phoneConfigured ? (
                  <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-soft">
                    <div className="flex items-center gap-2 text-teal">
                      <Phone className="h-5 w-5" aria-hidden="true" />
                      <h2 className="font-bold text-navy">Phone</h2>
                    </div>
                    <a
                      href={getTelLink(site.phoneInternational)}
                      className="mt-2 block text-lg font-semibold text-navy hover:text-teal"
                    >
                      {site.phoneDisplay}
                    </a>
                    <a
                      href={getTelLink(site.phoneInternational)}
                      className={cn(
                        buttonVariants({ variant: "teal", size: "sm" }),
                        "mt-4",
                      )}
                    >
                      Call Now
                    </a>
                  </div>
                ) : null}

                {whatsappConfigured ? (
                  <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-soft">
                    <div className="flex items-center gap-2 text-teal">
                      <MessageCircle className="h-5 w-5" aria-hidden="true" />
                      <h2 className="font-bold text-navy">WhatsApp</h2>
                    </div>
                    <p className="mt-2 text-sm text-text-muted">
                      Message us for a quote. We reply on the same chat.
                    </p>
                    <a
                      href={getWhatsAppLink(
                        `Hi ${site.businessName}, I would like a travel quote.`,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        buttonVariants({ variant: "whatsapp", size: "sm" }),
                        "mt-4",
                      )}
                    >
                      WhatsApp Us
                    </a>
                  </div>
                ) : null}

                {emailConfigured ? (
                  <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-soft">
                    <div className="flex items-center gap-2 text-teal">
                      <Mail className="h-5 w-5" aria-hidden="true" />
                      <h2 className="font-bold text-navy">Email</h2>
                    </div>
                    <a
                      href={getMailtoLink(site.publicEmail)}
                      className="mt-2 block text-sm font-medium text-navy hover:text-teal"
                    >
                      {site.publicEmail}
                    </a>
                  </div>
                ) : null}

                <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-soft">
                  <div className="flex items-center gap-2 text-teal">
                    <Clock className="h-5 w-5" aria-hidden="true" />
                    <h2 className="font-bold text-navy">Business Hours</h2>
                  </div>
                  <p className="mt-2 text-sm text-text-muted">
                    {site.businessHours.display}
                  </p>
                  <p className="mt-1 text-xs text-text-muted">
                    Weekdays: {site.businessHours.weekdays} · Weekends:{" "}
                    {site.businessHours.weekends}
                  </p>
                </div>
              </div>

              {addressConfigured ? (
                <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-soft">
                  <div className="flex items-center gap-2 text-teal">
                    <MapPin className="h-5 w-5" aria-hidden="true" />
                    <h2 className="font-bold text-navy">Office Address</h2>
                  </div>
                  <address className="mt-2 not-italic text-sm text-text-muted">
                    {site.address.line1}
                    {isConfigured(site.address.line2) ? (
                      <>
                        <br />
                        {site.address.line2}
                      </>
                    ) : null}
                    <br />
                    {site.address.city}, {site.address.state}
                    {isConfigured(site.address.postalCode)
                      ? ` ${site.address.postalCode}`
                      : null}
                    <br />
                    {site.address.country}
                  </address>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-soft">
                  <div className="flex items-center gap-2 text-teal">
                    <MapPin className="h-5 w-5" aria-hidden="true" />
                    <h2 className="font-bold text-navy">Service Areas</h2>
                  </div>
                  <p className="mt-2 text-sm text-text-muted">
                    {site.serviceAreas.join(", ")}
                  </p>
                </div>
              )}

              {socialLinks.length > 0 ? (
                <div>
                  <h2 className="font-bold text-navy">Follow Us</h2>
                  <ul className="mt-3 flex gap-3">
                    {socialLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <li key={link.label}>
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-white transition hover:bg-teal"
                            aria-label={link.label}
                          >
                            <Icon className="h-4 w-4" />
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}

              <div className="overflow-hidden rounded-xl border border-slate-100 shadow-soft">
                <iframe
                  src={site.mapEmbedUrl}
                  title={`${site.businessName} location map`}
                  className="aspect-[16/9] w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>

            <aside id="enquiry" className="scroll-mt-28 lg:sticky lg:top-24">
              <ContactEnquiryForm
                defaultDestination={defaultDestination}
                defaultVehicle={defaultVehicle}
              />
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
