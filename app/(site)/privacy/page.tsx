import Link from "next/link";
import { getPublicContent } from "@/lib/cms/content";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Privacy Policy",
  description:
    "How Smart Squad Travels in Ghaziabad handles names, phone numbers and trip details sent through this website.",
  path: "/privacy",
});

export default async function PrivacyPage() {
  const { site: siteConfig, pages } = await getPublicContent();
  const lastUpdated = pages.privacyLastUpdated;

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
              <li className="text-white">Privacy Policy</li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            Privacy Policy
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
              This note explains what {siteConfig.businessName} collects when
              you use this website or send a trip request, and how that
              information is handled.
            </p>

            <div>
              <h2 className="text-xl font-bold text-navy">
                What you send us
              </h2>
              <p className="mt-3 leading-relaxed text-text-muted">
                A trip form can include your name, phone number, email if you
                add one, travel dates, pickup point, destination, how many
                people are coming, vehicle choice, trip type and a short
                message. The site may also record ordinary technical details,
                such as the browser and the pages opened, through analytics.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy">
                Why we keep it
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-text-muted">
                <li>To reply to your trip request and send a price</li>
                <li>To arrange the vehicle you ask for</li>
                <li>To talk to you about that booking</li>
                <li>To improve the website</li>
                <li>To meet a legal requirement, if one applies</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy">
                Who else sees it
              </h2>
              <p className="mt-3 leading-relaxed text-text-muted">
                We do not sell personal information. A hosting, email or
                vehicle partner may receive what they need to run the site or
                to carry out the trip you asked for. We may also disclose
                information if the law requires it, or to protect people&apos;s
                safety.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy">How long it stays</h2>
              <p className="mt-3 leading-relaxed text-text-muted">
                Trip requests are kept long enough to answer you, keep business
                records and meet any legal holding period. You can ask us to
                delete your details where the law allows that.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy">Your choices</h2>
              <p className="mt-3 leading-relaxed text-text-muted">
                Sending a form means we may phone or WhatsApp you about that
                trip. You can refuse later marketing messages. To see, correct
                or delete what we hold, use the details on our{" "}
                <Link href="/contact" className="text-teal hover:underline">
                  Contact page
                </Link>
                .
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy">Security</h2>
              <p className="mt-3 leading-relaxed text-text-muted">
                We use reasonable care with the details you send. No internet
                transmission is fully secure, so include only what we need to
                price the trip.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy">
                Updates
              </h2>
              <p className="mt-3 leading-relaxed text-text-muted">
                If this note changes, the new wording is posted on this page
                with a new date.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy">Contact</h2>
              <p className="mt-3 leading-relaxed text-text-muted">
                Questions about this note can be sent through our{" "}
                <Link href="/contact" className="text-teal hover:underline">
                  Contact page
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
