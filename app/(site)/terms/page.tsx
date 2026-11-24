import Link from "next/link";
import { getPublicContent } from "@/lib/cms/content";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Terms of Service",
  description:
    "Terms for using the Smart Squad Travels website and for vehicle price requests sent from Ghaziabad.",
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
              These terms cover use of the {siteConfig.businessName} website
              and the trip requests sent through it. Using the site or sending
              a form means you accept them.
            </p>

            <div>
              <h2 className="text-xl font-bold text-navy">Services</h2>
              <p className="mt-3 leading-relaxed text-text-muted">
                {siteConfig.businessName} arranges a Force Traveller or Force
                Urbania, and the driving that goes with it. Each price follows
                the route, the dates, the vehicle and how many people are
                travelling. This website does not sell hotel stays or set
                sightseeing tours.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy">Prices you request</h2>
              <p className="mt-3 leading-relaxed text-text-muted">
                Form details are used to prepare a price. That price is not a
                confirmed booking until both sides accept it. The vehicle, the
                road and the amount can change with the season, demand and what
                is actually free on the date.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy">Bookings &amp; Payments</h2>
              <p className="mt-3 leading-relaxed text-text-muted">
                Payment, cancellation and what is included are explained when a
                booking is confirmed. Please read that note before you lock the
                date.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy">
                Travel Responsibility
              </h2>
              <p className="mt-3 leading-relaxed text-text-muted">
                Passengers need valid identity papers and any permit the
                destination requires, and they must follow local rules. Hill
                roads, yatra dates and weather can change a plan. Build in
                spare time where you can.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy">Website Content</h2>
              <p className="mt-3 leading-relaxed text-text-muted">
                Destination pages describe how a drive usually works. They are
                not a promise of a particular road, timing or third-party site.
                Check local conditions before you travel.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy">
                Limitation of Liability
              </h2>
              <p className="mt-3 leading-relaxed text-text-muted">
                As far as the law allows, {siteConfig.businessName} is not
                responsible for indirect or consequential loss from using this
                website or the travel service, except where that responsibility
                cannot legally be set aside.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy">Governing Law</h2>
              <p className="mt-3 leading-relaxed text-text-muted">
                Indian law applies. Disputes are heard by the courts of Uttar
                Pradesh, unless a law requires another court.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy">Changes</h2>
              <p className="mt-3 leading-relaxed text-text-muted">
                These terms can be updated. Using the site after a new version
                is posted means you accept that version.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy">Contact</h2>
              <p className="mt-3 leading-relaxed text-text-muted">
                Questions about these terms can go through our{" "}
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
