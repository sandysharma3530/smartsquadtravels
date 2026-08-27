import Link from "next/link";
import { getPublicContent } from "@/lib/cms/content";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Terms of Service",
  description:
    "Terms of service for Smart Squad Travels website and travel enquiry services. General terms for group transportation quotations and bookings.",
  path: "/terms",
});

export default async function TermsPage() {
  const { site: siteConfig, pages } = await getPublicContent();
  const lastUpdated = pages.termsLastUpdated;

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
              <li className="text-white">Terms of Service</li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-white/70">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site">
          <div className="prose-narrow mx-auto max-w-3xl space-y-6 text-text-main">
            <p className="leading-relaxed text-text-muted">
              These Terms of Service (&quot;Terms&quot;) govern your use of the
              {siteConfig.businessName} website and enquiry services. By using
              this website or submitting an enquiry, you agree to these Terms.
            </p>

            <div>
              <h2 className="text-xl font-bold text-navy">Services</h2>
              <p className="mt-3 leading-relaxed text-text-muted">
                {siteConfig.businessName} provides group transportation and
                Traveller rental coordination services. Quotations are customized
                based on route, dates, vehicle type and passenger requirements.
                We do not sell fixed tour packages through this website.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy">Enquiries &amp; Quotes</h2>
              <p className="mt-3 leading-relaxed text-text-muted">
                Information submitted through enquiry forms is used to prepare
                quotations. A quote is not a confirmed booking until explicitly
                accepted by both parties. Vehicle availability, routes and
                pricing may change based on season, demand and operational
                factors.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy">Bookings &amp; Payments</h2>
              <p className="mt-3 leading-relaxed text-text-muted">
                Specific payment terms, cancellation policies and inclusions
                will be communicated at the time of booking confirmation. Please
                review your quotation and booking details carefully before
                confirming travel.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy">
                Travel Responsibility
              </h2>
              <p className="mt-3 leading-relaxed text-text-muted">
                Passengers are responsible for valid identification, permits
                where required, and compliance with local regulations at
                destinations. Hill routes, pilgrimage seasons and weather
                conditions may affect travel plans. We recommend flexible
                itineraries where practical.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy">Website Content</h2>
              <p className="mt-3 leading-relaxed text-text-muted">
                Destination descriptions, blog articles and sample reviews on
                this website are for general information only. They do not
                constitute guarantees about routes, timings or third-party
                attractions. Always verify local conditions before travel.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy">
                Limitation of Liability
              </h2>
              <p className="mt-3 leading-relaxed text-text-muted">
                To the fullest extent permitted by applicable law,{" "}
                {siteConfig.businessName} is not liable for indirect,
                incidental or consequential damages arising from use of this
                website or travel services, except where liability cannot be
                excluded by law.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy">Governing Law</h2>
              <p className="mt-3 leading-relaxed text-text-muted">
                These Terms are governed by the laws of India. Any disputes
                shall be subject to the jurisdiction of courts in Uttar
                Pradesh, India, unless otherwise required by applicable law.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy">Changes</h2>
              <p className="mt-3 leading-relaxed text-text-muted">
                We may update these Terms at any time. Continued use of the
                website after changes are posted constitutes acceptance of the
                revised Terms.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy">Contact</h2>
              <p className="mt-3 leading-relaxed text-text-muted">
                Questions about these Terms? Visit our{" "}
                <Link href="/contact" className="text-teal hover:underline">
                  Contact page
                </Link>{" "}
                or read our{" "}
                <Link href="/privacy" className="text-teal hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
