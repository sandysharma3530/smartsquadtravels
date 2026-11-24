import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { hasGoogleReviewsConfigured } from "@/content/site-config";
import { getCmsSite, getReviews } from "@/lib/cms/content";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { ContactCTA } from "@/components/shared/ContactCTA";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { buttonVariants } from "@/components/ui/button";
import { isConfigured } from "@/lib/placeholders";
import { createMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = createMetadata({
  title: "Customer reviews",
  description:
    "Sample notes about the group trips Smart Squad Travels arranges from Ghaziabad. Verified Google reviews can replace these when they are connected.",
  path: "/reviews",
});

export default async function ReviewsPage() {
  const site = await getCmsSite();
  const reviews = await getReviews();
  const showGoogleLink = isConfigured(site.googleReviewUrl);
  const googleConfigured = hasGoogleReviewsConfigured(site);

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
              <li className="text-white">Reviews</li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            Customer Reviews
          </h1>
          <p className="mt-3 max-w-2xl text-base text-white/80 md:text-lg">
            Sample notes of the kind of trips we arrange. These are not
            verified Google reviews yet.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site">
          <div
            className="mb-10 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
            role="note"
          >
            These reviews are samples for the page layout. They are not real
            Google reviews.
          </div>

          {googleConfigured ? (
            <div className="mb-10 text-center">
              <p className="text-lg font-semibold text-navy">
                {site.trustStatistics.googleRating}★ average from{" "}
                {site.trustStatistics.googleReviewCount} Google reviews
              </p>
            </div>
          ) : null}

          <SectionHeader
            as="h2"
            title="What travellers say"
            subtitle="Examples of the kind of feedback we hope to earn. These notes are samples, not verified reviews."
          />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          {showGoogleLink ? (
            <div className="mt-10 text-center">
              <a
                href={site.googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                Read reviews on Google
              </a>
            </div>
          ) : null}
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
