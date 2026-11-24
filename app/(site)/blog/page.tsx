import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getBlogPosts, isPublicNavEnabled } from "@/lib/cms/content";
import { ContactCTA } from "@/components/shared/ContactCTA";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { formatDisplayDate } from "@/lib/utils";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata() {
  if (!(await isPublicNavEnabled("/blog"))) {
    return createMetadata({ title: "Blog", noIndex: true });
  }

  return createMetadata({
    title: "Group Travel Tips & Guides",
    description:
      "Practical guides on choosing a Traveller, hill journey safety, wedding transportation checklists and North India group travel planning from Delhi NCR.",
    path: "/blog",
    keywords: [
      "Traveller rental tips",
      "group travel planning Delhi NCR",
      "hill journey safety checklist",
    ],
  });
}

export default async function BlogPage() {
  if (!(await isPublicNavEnabled("/blog"))) {
    notFound();
  }

  const posts = await getBlogPosts();

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
              <li className="text-white">Blog</li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            Travel Blog
          </h1>
          <p className="mt-3 max-w-2xl text-base text-white/80 md:text-lg">
            Practical tips for planning a group trip from Delhi NCR. These are
            guides, not fixed holiday packages.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site">
          <SectionHeader
            as="h2"
            title="Latest Articles"
            subtitle="Planning tips, a hill-trip checklist, and short guides to places we drive to."
          />

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const formattedDate = formatDisplayDate(post.date);

              return (
                <article
                  key={post.slug}
                  className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft"
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
                  >
                    <div className="relative aspect-[16/10]">
                      <Image
                        src={post.coverImage}
                        alt={post.coverAlt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
                        {formattedDate ? <time dateTime={post.date}>{formattedDate}</time> : null}
                        <span aria-hidden="true">·</span>
                        <span>{post.readingTime}</span>
                      </div>
                      <h2 className="mt-2 text-lg font-bold text-navy">
                        {post.title}
                      </h2>
                      <p className="mt-2 line-clamp-3 text-sm text-text-muted">
                        {post.excerpt}
                      </p>
                      <span className="mt-4 inline-block text-sm font-semibold text-teal">
                        Read article →
                      </span>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
