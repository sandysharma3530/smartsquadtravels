import { getCmsSite, getServicesContent } from "@/lib/cms/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";

type WhyChooseUsSectionProps = {
  className?: string;
};

export async function WhyChooseUsSection({ className }: WhyChooseUsSectionProps) {
  const site = await getCmsSite();
  const { whyChooseUs } = await getServicesContent();
  const stats = site.trustStatistics;
  const showStats =
    stats.googleRating != null ||
    stats.googleReviewCount != null ||
    stats.yearsOfExperience != null ||
    stats.tripsCompleted != null;

  return (
    <section className={cn("section-pad", className)}>
      <div className="container-site">
        <SectionHeader
          title="Why travel with us"
          subtitle="A clear quote before you leave, a vehicle that fits your group, and the same person on WhatsApp on the day."
        />

        {showStats ? (
          <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.googleRating != null ? (
              <div className="rounded-2xl bg-bg-light p-4 text-center">
                <p className="text-2xl font-bold text-navy">{stats.googleRating}</p>
                <p className="text-sm text-text-muted">Google Rating</p>
              </div>
            ) : null}
            {stats.googleReviewCount != null ? (
              <div className="rounded-2xl bg-bg-light p-4 text-center">
                <p className="text-2xl font-bold text-navy">
                  {stats.googleReviewCount}+
                </p>
                <p className="text-sm text-text-muted">Google Reviews</p>
              </div>
            ) : null}
            {stats.yearsOfExperience != null ? (
              <div className="rounded-2xl bg-bg-light p-4 text-center">
                <p className="text-2xl font-bold text-navy">
                  {stats.yearsOfExperience}+
                </p>
                <p className="text-sm text-text-muted">Years Experience</p>
              </div>
            ) : null}
            {stats.tripsCompleted != null ? (
              <div className="rounded-2xl bg-bg-light p-4 text-center">
                <p className="text-2xl font-bold text-navy">
                  {stats.tripsCompleted}+
                </p>
                <p className="text-sm text-text-muted">Trips Completed</p>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {whyChooseUs.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft"
            >
              <h3 className="text-lg font-bold text-navy">{item.title}</h3>
              <p className="mt-2 text-sm text-text-muted">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
