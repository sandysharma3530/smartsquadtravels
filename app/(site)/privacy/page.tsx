import Link from "next/link";
import { getPublicContent } from "@/lib/cms/content";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Privacy Policy",
  description:
    "Privacy policy for Smart Squad Travels — how we collect, use and protect your personal information when you submit travel enquiries.",
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
              This Privacy Policy describes how {siteConfig.businessName} (
              &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects,
              uses and protects personal information when you visit our website
              or submit a travel enquiry.
            </p>

            <div>
              <h2 className="text-xl font-bold text-navy">
                Information We Collect
              </h2>
              <p className="mt-3 leading-relaxed text-text-muted">
                When you submit an enquiry form, we may collect your name,
                phone number, email address (if provided), travel dates, pickup
                location, destination, passenger count, vehicle preference,
                trip type and any message you share. We may also collect
                technical information such as browser type and pages visited
                through standard website analytics.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy">
                How We Use Your Information
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-text-muted">
                <li>To respond to your travel enquiry and provide quotations</li>
                <li>To coordinate transportation services you request</li>
                <li>To communicate about your booking or travel plans</li>
                <li>To improve our website and customer support</li>
                <li>To comply with applicable legal obligations</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy">
                Information Sharing
              </h2>
              <p className="mt-3 leading-relaxed text-text-muted">
                We do not sell your personal information. We may share details
                with service providers who help us operate the website, send
                emails or deliver transportation services — only as needed to
                fulfil your enquiry. We may disclose information if required by
                law or to protect our rights and safety.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy">Data Retention</h2>
              <p className="mt-3 leading-relaxed text-text-muted">
                We retain enquiry information for as long as needed to respond
                to your request, maintain business records and comply with legal
                requirements. You may request deletion of your data where
                applicable law permits.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy">Your Choices</h2>
              <p className="mt-3 leading-relaxed text-text-muted">
                By submitting an enquiry, you consent to being contacted about
                your travel request. You may opt out of marketing communications
                at any time. To access, correct or delete your information,
                contact us through the details on our{" "}
                <Link href="/contact" className="text-teal hover:underline">
                  Contact page
                </Link>
                .
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy">Security</h2>
              <p className="mt-3 leading-relaxed text-text-muted">
                We take reasonable measures to protect your information.
                However, no method of transmission over the internet is
                completely secure. Please share only information necessary for
                your travel enquiry.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy">
                Changes to This Policy
              </h2>
              <p className="mt-3 leading-relaxed text-text-muted">
                We may update this Privacy Policy from time to time. Changes
                will be posted on this page with an updated date.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy">Contact</h2>
              <p className="mt-3 leading-relaxed text-text-muted">
                For privacy-related questions, please visit our{" "}
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
