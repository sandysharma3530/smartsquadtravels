import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPostBySlug, getPublishedContent, isPublicNavEnabled } from "@/lib/cms/content";
import { ContactCTA } from "@/components/shared/ContactCTA";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbJsonLd, createMetadata, articleJsonLd } from "@/lib/seo";
import { formatDisplayDate } from "@/lib/utils";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = true;

export async function generateStaticParams() {
  const { blog } = await getPublishedContent();
  return blog.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  if (!(await isPublicNavEnabled("/blog"))) {
    return createMetadata({ title: "Article Not Found", noIndex: true });
  }

  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return createMetadata({ title: "Article Not Found", noIndex: true });
  }

  return createMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.coverImage,
    type: "article",
    publishedTime: post.date,
    modifiedTime: post.date,
    keywords: post.tags,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  if (!(await isPublicNavEnabled("/blog"))) {
    notFound();
  }

  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const formattedDate = formatDisplayDate(post.date);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
          articleJsonLd(post),
        ]}
      />

      <article>
        <header className="bg-gradient-to-br from-navy via-navy-secondary to-navy py-12 md:py-16">
          <div className="container-site">
            <nav aria-label="Breadcrumb" className="mb-4 text-sm text-white/70">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="transition hover:text-teal-light">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link
                    href="/blog"
                    className="transition hover:text-teal-light"
                  >
                    Blog
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="max-w-xs truncate text-white">{post.title}</li>
              </ol>
            </nav>

            <div className="flex flex-wrap items-center gap-2 text-sm text-teal-light">
              {formattedDate ? (
                <time dateTime={post.date}>{formattedDate}</time>
              ) : null}
              <span aria-hidden="true">·</span>
              <span>{post.readingTime}</span>
            </div>

            <h1 className="mt-3 max-w-3xl text-3xl font-bold text-white md:text-4xl">
              {post.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base text-white/80">
              {post.excerpt}
            </p>

            <ul className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/90"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </header>

        <div className="relative aspect-[21/9] max-h-[400px] w-full">
          <Image
            src={post.coverImage}
            alt={post.coverAlt}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>

        <div className="section-pad">
          <div className="container-site">
            <div className="mx-auto max-w-3xl space-y-6">
              {post.content.map((paragraph, index) => (
                <p
                  key={index}
                  className="leading-relaxed text-text-main md:text-lg"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {post.gallery && post.gallery.length > 0 ? (
              <div className="mx-auto mt-12 max-w-4xl">
                <h2 className="mb-6 text-2xl font-bold text-navy">Gallery</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {post.gallery.map((image, index) => (
                    <figure
                      key={`${image.src}-${index}`}
                      className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft"
                    >
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={image.src}
                          alt={image.alt || post.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 480px"
                        />
                      </div>
                      {image.caption ? (
                        <figcaption className="px-4 py-3 text-sm text-text-muted">
                          {image.caption}
                        </figcaption>
                      ) : null}
                    </figure>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mx-auto mt-12 max-w-3xl border-t border-slate-100 pt-8">
              <Link
                href="/blog"
                className="text-sm font-semibold text-teal hover:underline"
              >
                ← Back to all articles
              </Link>
            </div>
          </div>
        </div>
      </article>

      <ContactCTA />
    </>
  );
}
