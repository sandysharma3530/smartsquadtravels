import Link from "next/link";
import { getFeaturedReviews, getCmsSite } from "@/lib/cms/content";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ReviewsSectionProps = {
  className?: string;
  limit?: number;
};

export async function ReviewsSection({ className, limit = 3 }: ReviewsSectionProps) {
  const site = await getCmsSite();
  const reviews = await getFeaturedReviews(limit);
  const reviewsLink = site.googleReviewUrl.includes("REPLACE_")
    ? "/reviews"
    : site.googleReviewUrl;
  const hasDemoReviews = reviews.some((review) => review.isDemo);
  const isExternal = reviewsLink.startsWith("http");

  return (
    <section className={cn("section-pad bg-bg-light", className)}>
      <div className="container-site">
        <SectionHeader
          title={hasDemoReviews ? "Sample traveller notes" : "What our customers say"}
          subtitle={
            hasDemoReviews
              ? "Examples of the kind of trips we arrange. These are not verified Google reviews."
              : "Feedback from groups who travelled with Smart Squad Travels."
          }
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        <div className="mt-10 text-center">
          {isExternal ? (
            <a
              href={reviewsLink}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Read More Reviews
            </a>
          ) : (
            <Link
              href={reviewsLink}
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Read More Reviews
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
