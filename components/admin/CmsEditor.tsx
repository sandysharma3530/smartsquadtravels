"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  HOME_SECTION_KEYS,
  isHeroSlideEnabled,
  isNavItemEnabled,
  resolveHomeSections,
  type CmsBundle,
  type CmsHeroSlide,
  type CmsKey,
  type HomeSectionKey,
} from "@/lib/cms/types";
import type { FleetImageCategory } from "@/content/fleet";
import { CheckInput, TextArea, TextInput } from "@/components/admin/fields";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { LogoUploadField } from "@/components/admin/LogoUploadField";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DEFAULT_BRAND_LOGO } from "@/lib/cms/brand-logo";

type Section =
  | "site"
  | "home"
  | "destinations"
  | "fleet"
  | "services"
  | "faqs"
  | "reviews"
  | "blog"
  | "gallery"
  | "pages";

const FLEET_IMAGE_CATEGORIES: FleetImageCategory[] = [
  "front-exterior",
  "side-exterior",
  "rear-exterior",
  "interior-seating",
  "driver-cabin",
  "ac-vents",
  "charging-points",
  "luggage-space",
  "gps-cctv",
  "night-lighting",
];

export function CmsEditor({ section }: { section: Section }) {
  const [bundle, setBundle] = useState<CmsBundle | null>(null);
  const [draftKeys, setDraftKeys] = useState<CmsKey[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function reload() {
    const res = await fetch("/api/admin/content");
    const data = await res.json();
    setBundle(data.bundle);
    setDraftKeys(data.draftKeys || []);
  }

  useEffect(() => {
    reload().catch(() => setError("Could not load content."));
  }, []);

  async function saveDraft(key: CmsKey, payload: unknown) {
    setSaving(true);
    setError("");
    setMessage("");
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, payload, mode: "draft" }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(data.error || "Save draft failed.");
      return;
    }
    setMessage("Draft saved. Click Publish live when ready to update the website.");
    setDraftKeys((prev) => (prev.includes(key) ? prev : [...prev, key]));
  }

  async function publishSection(key: CmsKey) {
    setSaving(true);
    setError("");
    setMessage("");
    // Ensure latest editor state is stored as draft first
    if (!bundle) return;
    await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, payload: bundle[key], mode: "draft" }),
    });
    const res = await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publishKey: key }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(data.error || "Publish failed.");
      return;
    }
    setMessage("Published to the live website.");
    await reload();
  }

  if (!bundle) {
    return <p className="text-sm text-text-muted">Loading content…</p>;
  }

  const hasDraft = draftKeys.includes(section);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
        <button
          type="button"
          disabled={saving}
          onClick={() => saveDraft(section, bundle[section])}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          {saving ? "Saving…" : "Save draft"}
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={() => publishSection(section)}
          className={cn(buttonVariants({ variant: "teal" }))}
        >
          Publish live
        </button>
        {hasDraft ? (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
            Unpublished draft
          </span>
        ) : (
          <span className="rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">
            In sync with live site
          </span>
        )}
      </div>

      {section === "site" ? (
        <SiteEditor site={bundle.site} onChange={(site) => setBundle({ ...bundle, site })} />
      ) : null}
      {section === "home" ? (
        <HomeEditor home={bundle.home} onChange={(home) => setBundle({ ...bundle, home })} />
      ) : null}
      {section === "destinations" ? (
        <DestinationsEditor
          items={bundle.destinations}
          onChange={(destinations) => setBundle({ ...bundle, destinations })}
        />
      ) : null}
      {section === "fleet" ? (
        <FleetEditor items={bundle.fleet} onChange={(fleet) => setBundle({ ...bundle, fleet })} />
      ) : null}
      {section === "services" ? (
        <ServicesEditor
          data={bundle.services}
          onChange={(services) => setBundle({ ...bundle, services })}
        />
      ) : null}
      {section === "faqs" ? (
        <FaqsEditor items={bundle.faqs} onChange={(faqs) => setBundle({ ...bundle, faqs })} />
      ) : null}
      {section === "reviews" ? (
        <ReviewsEditor
          items={bundle.reviews}
          onChange={(reviews) => setBundle({ ...bundle, reviews })}
        />
      ) : null}
      {section === "blog" ? (
        <BlogEditor items={bundle.blog} onChange={(blog) => setBundle({ ...bundle, blog })} />
      ) : null}
      {section === "gallery" ? (
        <GalleryEditor
          data={bundle.gallery}
          onChange={(gallery) => setBundle({ ...bundle, gallery })}
        />
      ) : null}
      {section === "pages" ? (
        <PagesEditor data={bundle.pages} onChange={(pages) => setBundle({ ...bundle, pages })} />
      ) : null}

      {message ? <p className="text-sm font-medium text-teal">{message}</p> : null}
      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
    </div>
  );
}

function Card({
  title,
  badge,
  children,
}: {
  title: string;
  badge?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-bold text-navy">{title}</h2>
        {badge}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function confirmDelete(label: string) {
  return window.confirm(`Delete ${label}? This cannot be undone until you discard/reload the draft.`);
}

function MultiImagePaths({
  label,
  hint,
  onAdd,
}: {
  label: string;
  hint?: string;
  onAdd: (paths: string[]) => void;
}) {
  const [value, setValue] = useState("");
  return (
    <div className="space-y-2 rounded-xl border border-dashed border-slate-300 bg-bg-light p-3">
      <TextArea
        label={label}
        hint={hint || "One image path per line, e.g. /images/destinations/nainital.jpg"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        type="button"
        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        onClick={() => {
          const paths = value
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean);
          if (!paths.length) return;
          onAdd(paths);
          setValue("");
        }}
      >
        Add images
      </button>
    </div>
  );
}

function SiteEditor({
  site,
  onChange,
}: {
  site: CmsBundle["site"];
  onChange: (site: CmsBundle["site"]) => void;
}) {
  return (
    <>
      <Card title="Website logo">
        <LogoUploadField
          value={site.logo}
          onUploaded={(logo) => onChange({ ...site, logo })}
          onReset={() => onChange({ ...site, logo: { ...DEFAULT_BRAND_LOGO } })}
        />
      </Card>
      <Card title="Brand">
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput label="Business name" value={site.businessName} onChange={(e) => onChange({ ...site, businessName: e.target.value })} />
          <TextInput label="Tagline" value={site.tagline} onChange={(e) => onChange({ ...site, tagline: e.target.value })} />
        </div>
        <TextArea label="Short description" value={site.shortDescription} onChange={(e) => onChange({ ...site, shortDescription: e.target.value })} />
        <TextInput label="Primary vehicle label" value={site.primaryVehicle} onChange={(e) => onChange({ ...site, primaryVehicle: e.target.value })} />
      </Card>
      <Card title="Contact">
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput label="Phone display" value={site.phoneDisplay} onChange={(e) => onChange({ ...site, phoneDisplay: e.target.value })} />
          <TextInput label="Phone (dialable)" value={site.phoneInternational} onChange={(e) => onChange({ ...site, phoneInternational: e.target.value })} />
          <TextInput label="WhatsApp number" value={site.whatsappNumber} onChange={(e) => onChange({ ...site, whatsappNumber: e.target.value })} />
          <TextInput label="Public email" value={site.publicEmail} onChange={(e) => onChange({ ...site, publicEmail: e.target.value, email: e.target.value })} />
        </div>
      </Card>
      <Card title="Address">
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput label="Address line 1" value={site.address.line1} onChange={(e) => onChange({ ...site, address: { ...site.address, line1: e.target.value } })} />
          <TextInput label="Address line 2" value={site.address.line2} onChange={(e) => onChange({ ...site, address: { ...site.address, line2: e.target.value } })} />
          <TextInput label="City" value={site.address.city} onChange={(e) => onChange({ ...site, address: { ...site.address, city: e.target.value } })} />
          <TextInput label="State" value={site.address.state} onChange={(e) => onChange({ ...site, address: { ...site.address, state: e.target.value } })} />
          <TextInput label="PIN code" value={site.address.postalCode} onChange={(e) => onChange({ ...site, address: { ...site.address, postalCode: e.target.value } })} />
        </div>
        <TextInput label="Full address" value={site.address.full} onChange={(e) => onChange({ ...site, address: { ...site.address, full: e.target.value } })} />
        <TextArea label="Service areas (one per line)" value={site.serviceAreas.join("\n")} onChange={(e) => onChange({ ...site, serviceAreas: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })} />
        <TextInput label="Business hours" value={site.businessHours.display} onChange={(e) => onChange({ ...site, businessHours: { ...site.businessHours, display: e.target.value } })} />
        <TextInput label="Google Maps embed URL" value={site.mapEmbedUrl} onChange={(e) => onChange({ ...site, mapEmbedUrl: e.target.value })} />
      </Card>
      <Card title="Social & reviews">
        <TextInput label="Facebook URL" value={site.social.facebookUrl} onChange={(e) => onChange({ ...site, social: { ...site.social, facebookUrl: e.target.value } })} />
        <TextInput label="Instagram URL" value={site.social.instagramUrl} onChange={(e) => onChange({ ...site, social: { ...site.social, instagramUrl: e.target.value } })} />
        <TextInput label="YouTube URL" value={site.social.youtubeUrl} onChange={(e) => onChange({ ...site, social: { ...site.social, youtubeUrl: e.target.value } })} />
        <TextInput label="Google Business URL" value={site.googleBusinessUrl} onChange={(e) => onChange({ ...site, googleBusinessUrl: e.target.value })} />
        <TextInput label="Google review URL" value={site.googleReviewUrl} onChange={(e) => onChange({ ...site, googleReviewUrl: e.target.value })} />
      </Card>
      <Card title="Header navigation">
        <p className="-mt-2 text-sm text-text-muted">
          Uncheck a link to hide it from the header, mobile menu, and footer.
          Content stays saved so you can turn it back on later.
        </p>
        <div className="space-y-3">
          {site.nav.map((item, index) => {
            const enabled = isNavItemEnabled(item);
            return (
              <div
                key={`${item.href}-${index}`}
                className="grid gap-3 rounded-xl border border-slate-200 bg-bg-light/60 p-3 md:grid-cols-[auto_1fr_1fr] md:items-end"
              >
                <CheckInput
                  label="Show in menu"
                  checked={enabled}
                  onChange={(value) => {
                    const nav = [...site.nav];
                    nav[index] = { ...item, enabled: value };
                    onChange({ ...site, nav });
                  }}
                />
                <TextInput
                  label="Label"
                  value={item.label}
                  onChange={(e) => {
                    const nav = [...site.nav];
                    nav[index] = { ...item, label: e.target.value };
                    onChange({ ...site, nav });
                  }}
                />
                <TextInput
                  label="Path"
                  value={item.href}
                  onChange={(e) => {
                    const nav = [...site.nav];
                    nav[index] = { ...item, href: e.target.value };
                    onChange({ ...site, nav });
                  }}
                />
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}

const HOME_SECTION_LABELS: Record<HomeSectionKey, string> = {
  hero: "Hero slider",
  trustBar: "Trust bar",
  fleet: "Our Fleet",
  destinations: "Popular Destinations",
  services: "Our Services",
  whyChooseUs: "Why Choose Us",
  reviews: "What Our Customers Say",
  faqs: "Frequently Asked Questions",
  contactCta: "Contact call-to-action",
};

function nextHeroSlideId(slides: CmsHeroSlide[]) {
  const maxId = slides.reduce((max, slide) => Math.max(max, Number(slide.id) || 0), 0);
  return maxId + 1;
}

function createHeroSlide(id: number): CmsHeroSlide {
  return {
    id,
    eyebrow: "",
    headingLines: [
      { text: "", accent: false },
      { text: "", accent: true },
    ],
    description: "",
    image: "/images/hero/slide-1.jpg",
    imageAlt: "",
    showTrustPoints: false,
    showCtas: true,
    enabled: true,
  };
}

function HomeEditor({
  home,
  onChange,
}: {
  home: CmsBundle["home"];
  onChange: (home: CmsBundle["home"]) => void;
}) {
  const sections = resolveHomeSections(home.sections);

  function updateSlide(index: number, patch: Partial<CmsHeroSlide>) {
    const heroSlides = [...home.heroSlides];
    heroSlides[index] = { ...heroSlides[index], ...patch };
    onChange({ ...home, heroSlides });
  }

  return (
    <>
      <Card title="Homepage sections">
        <p className="-mt-2 text-sm text-text-muted">
          Uncheck a section to hide it on the public home page. The content stays
          saved so you can turn it back on later.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {HOME_SECTION_KEYS.map((key) => (
            <CheckInput
              key={key}
              label={HOME_SECTION_LABELS[key]}
              checked={sections[key]}
              onChange={(value) =>
                onChange({
                  ...home,
                  sections: { ...sections, [key]: value },
                })
              }
            />
          ))}
        </div>
        <div className="space-y-3 border-t border-slate-100 pt-4">
          <div>
            <h3 className="text-sm font-semibold text-navy">Hero slides</h3>
            <p className="text-sm text-text-muted">
              Uncheck a slide to hide it from the homepage carousel. Content stays
              saved so you can turn it back on later.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {home.heroSlides.map((slide, index) => (
              <CheckInput
                key={slide.id}
                label={`Hero slide ${index + 1}${slide.eyebrow ? ` — ${slide.eyebrow}` : ""}`}
                checked={isHeroSlideEnabled(slide)}
                onChange={(value) => updateSlide(index, { enabled: value })}
              />
            ))}
          </div>
          <button
            type="button"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            onClick={() =>
              onChange({
                ...home,
                heroSlides: [
                  ...home.heroSlides,
                  createHeroSlide(nextHeroSlideId(home.heroSlides)),
                ],
              })
            }
          >
            Add hero slide
          </button>
        </div>
      </Card>
      {home.heroSlides.map((slide, index) => (
        <Card
          key={slide.id}
          title={`Hero slide ${index + 1}`}
          badge={
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                isHeroSlideEnabled(slide)
                  ? "bg-teal/10 text-teal"
                  : "bg-slate-200 text-slate-600",
              )}
            >
              {isHeroSlideEnabled(slide) ? "Enabled" : "Disabled"}
            </span>
          }
        >
          <CheckInput
            label="Show this slide on the homepage"
            checked={isHeroSlideEnabled(slide)}
            onChange={(value) => updateSlide(index, { enabled: value })}
          />
          <TextInput label="Eyebrow" value={slide.eyebrow} onChange={(e) => {
            updateSlide(index, { eyebrow: e.target.value });
          }} />
          <TextInput label="Heading line 1" value={slide.headingLines[0]?.text || ""} onChange={(e) => {
            const heroSlides = [...home.heroSlides];
            const lines = [...slide.headingLines];
            lines[0] = { text: e.target.value, accent: false };
            heroSlides[index] = { ...slide, headingLines: lines };
            onChange({ ...home, heroSlides });
          }} />
          <TextInput label="Heading line 2" value={slide.headingLines[1]?.text || ""} onChange={(e) => {
            const heroSlides = [...home.heroSlides];
            const lines = [...slide.headingLines];
            lines[1] = { text: e.target.value, accent: true };
            heroSlides[index] = { ...slide, headingLines: lines };
            onChange({ ...home, heroSlides });
          }} />
          <TextArea label="Description" value={slide.description} onChange={(e) => {
            const heroSlides = [...home.heroSlides];
            heroSlides[index] = { ...slide, description: e.target.value };
            onChange({ ...home, heroSlides });
          }} />
          <TextInput label="Image path" value={slide.image} onChange={(e) => {
            const heroSlides = [...home.heroSlides];
            heroSlides[index] = { ...slide, image: e.target.value };
            onChange({ ...home, heroSlides });
          }} />
          <ImageUploadField
            label="Upload hero image"
            folder="hero"
            variant="hero"
            value={slide.image}
            onUploaded={([url]) => {
              if (!url) return;
              const heroSlides = [...home.heroSlides];
              heroSlides[index] = { ...slide, image: url };
              onChange({ ...home, heroSlides });
            }}
          />
          <TextInput label="Image alt text" value={slide.imageAlt} onChange={(e) => {
            const heroSlides = [...home.heroSlides];
            heroSlides[index] = { ...slide, imageAlt: e.target.value };
            onChange({ ...home, heroSlides });
          }} />
        </Card>
      ))}
      <Card title="Trust bar labels">
        {home.trustBarItems.map((item, index) => (
          <TextInput key={item.id} label={item.id} value={item.label} onChange={(e) => {
            const trustBarItems = [...home.trustBarItems];
            trustBarItems[index] = { ...item, label: e.target.value };
            onChange({ ...home, trustBarItems });
          }} />
        ))}
      </Card>
    </>
  );
}

function DestinationsEditor({
  items,
  onChange,
}: {
  items: CmsBundle["destinations"];
  onChange: (items: CmsBundle["destinations"]) => void;
}) {
  const [open, setOpen] = useState(items[0]?.slug || "");
  return (
    <>
      <button
        type="button"
        className={cn(buttonVariants({ variant: "outline" }))}
        onClick={() => {
          const slug = `new-destination-${Date.now()}`;
          onChange([
            {
              slug,
              name: "New destination",
              region: "Uttarakhand",
              shortDescription: "",
              introduction: "",
              highlights: [],
              recommendedMonths: "",
              suggestedDuration: "",
              roadTravelNotes: "",
              suitableFor: [],
              recommendedVehicles: ["force-traveller"],
              nearbyPlaces: [],
              coverImage: "/images/destinations/nainital.jpg",
              coverAlt: "",
              gallery: [],
              featuredOnHome: false,
              homeOrder: items.length + 1,
            },
            ...items,
          ]);
          setOpen(slug);
        }}
      >
        Add destination
      </button>
      {items.map((item, index) => (
        <Card key={item.slug} title={item.name || item.slug}>
          <button
            type="button"
            className="text-sm font-semibold text-teal"
            onClick={() => setOpen(open === item.slug ? "" : item.slug)}
          >
            {open === item.slug ? "Hide" : "Edit"}
          </button>
          {open === item.slug ? (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <TextInput label="Name" value={item.name} onChange={(e) => {
                  const next = [...items]; next[index] = { ...item, name: e.target.value }; onChange(next);
                }} />
                <TextInput label="Slug" value={item.slug} onChange={(e) => {
                  const next = [...items]; next[index] = { ...item, slug: e.target.value }; onChange(next);
                }} />
                <TextInput label="Region" value={item.region} onChange={(e) => {
                  const next = [...items]; next[index] = { ...item, region: e.target.value }; onChange(next);
                }} />
                <TextInput type="number" label="Home order" value={item.homeOrder} onChange={(e) => {
                  const next = [...items]; next[index] = { ...item, homeOrder: Number(e.target.value) }; onChange(next);
                }} />
              </div>
              <CheckInput label="Show on home page" checked={item.featuredOnHome} onChange={(value) => {
                const next = [...items]; next[index] = { ...item, featuredOnHome: value }; onChange(next);
              }} />
              <TextArea label="Short description" value={item.shortDescription} onChange={(e) => {
                const next = [...items]; next[index] = { ...item, shortDescription: e.target.value }; onChange(next);
              }} />
              <TextArea label="Introduction" value={item.introduction} onChange={(e) => {
                const next = [...items]; next[index] = { ...item, introduction: e.target.value }; onChange(next);
              }} />
              <TextArea label="Highlights (one per line)" value={item.highlights.join("\n")} onChange={(e) => {
                const next = [...items]; next[index] = { ...item, highlights: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) }; onChange(next);
              }} />
              <div className="grid gap-4 md:grid-cols-2">
                <TextInput
                  label="Recommended months"
                  value={item.recommendedMonths}
                  onChange={(e) => {
                    const next = [...items];
                    next[index] = { ...item, recommendedMonths: e.target.value };
                    onChange(next);
                  }}
                  hint="e.g. March–June and September–November"
                />
                <TextInput
                  label="Suggested duration"
                  value={item.suggestedDuration}
                  onChange={(e) => {
                    const next = [...items];
                    next[index] = { ...item, suggestedDuration: e.target.value };
                    onChange(next);
                  }}
                  hint="e.g. Typically 2–4 days — fully customizable"
                />
              </div>
              <TextArea
                label="Road travel notes"
                value={item.roadTravelNotes}
                onChange={(e) => {
                  const next = [...items];
                  next[index] = { ...item, roadTravelNotes: e.target.value };
                  onChange(next);
                }}
              />
              <TextArea
                label="Suitable for (one per line)"
                value={item.suitableFor.join("\n")}
                onChange={(e) => {
                  const next = [...items];
                  next[index] = {
                    ...item,
                    suitableFor: e.target.value
                      .split("\n")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  };
                  onChange(next);
                }}
                hint="e.g. Family groups, Friends, Pilgrimage groups"
              />
              <TextArea
                label="Nearby places (one per line)"
                value={item.nearbyPlaces.join("\n")}
                onChange={(e) => {
                  const next = [...items];
                  next[index] = {
                    ...item,
                    nearbyPlaces: e.target.value
                      .split("\n")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  };
                  onChange(next);
                }}
              />
              <div className="space-y-2">
                <p className="text-sm font-semibold text-navy">Recommended vehicles</p>
                <div className="flex flex-wrap gap-4">
                  {(
                    [
                      { id: "force-traveller", label: "Force Traveller" },
                      { id: "force-urbania", label: "Force Urbania" },
                    ] as const
                  ).map((vehicle) => (
                    <CheckInput
                      key={vehicle.id}
                      label={vehicle.label}
                      checked={item.recommendedVehicles.includes(vehicle.id)}
                      onChange={(checked) => {
                        const recommendedVehicles = checked
                          ? [...item.recommendedVehicles, vehicle.id]
                          : item.recommendedVehicles.filter((v) => v !== vehicle.id);
                        const next = [...items];
                        next[index] = { ...item, recommendedVehicles };
                        onChange(next);
                      }}
                    />
                  ))}
                </div>
              </div>
              <TextInput label="Cover image path" value={item.coverImage} onChange={(e) => {
                const next = [...items]; next[index] = { ...item, coverImage: e.target.value }; onChange(next);
              }} />
              <ImageUploadField
                label="Upload cover image"
                folder="destinations"
                variant="cover"
                value={item.coverImage}
                onUploaded={([url]) => {
                  if (!url) return;
                  const next = [...items];
                  next[index] = { ...item, coverImage: url };
                  onChange(next);
                }}
              />
              <TextInput label="Cover alt text" value={item.coverAlt} onChange={(e) => {
                const next = [...items]; next[index] = { ...item, coverAlt: e.target.value }; onChange(next);
              }} />

              <div className="space-y-3 border-t border-slate-100 pt-4">
                <h3 className="font-semibold text-navy">Gallery images</h3>
                <ImageUploadField
                  label="Upload gallery images"
                  folder="destinations"
                  variant="gallery"
                  multiple
                  onUploaded={(urls) => {
                    const next = [...items];
                    next[index] = {
                      ...item,
                      gallery: [
                        ...item.gallery,
                        ...urls.map((src) => ({
                          src,
                          alt: item.name,
                          caption: "",
                        })),
                      ],
                    };
                    onChange(next);
                  }}
                />
                <MultiImagePaths
                  label="Or paste image paths (one per line)"
                  onAdd={(paths) => {
                    const next = [...items];
                    next[index] = {
                      ...item,
                      gallery: [
                        ...item.gallery,
                        ...paths.map((src) => ({
                          src,
                          alt: item.name,
                          caption: "",
                        })),
                      ],
                    };
                    onChange(next);
                  }}
                />
                {item.gallery.map((img, gIndex) => (
                  <div key={`${img.src}-${gIndex}`} className="grid gap-3 rounded-xl border border-slate-100 p-3 md:grid-cols-2">
                    <TextInput label="Image path" value={img.src} onChange={(e) => {
                      const gallery = [...item.gallery];
                      gallery[gIndex] = { ...img, src: e.target.value };
                      const next = [...items]; next[index] = { ...item, gallery }; onChange(next);
                    }} />
                    <ImageUploadField
                      label="Replace this image"
                      folder="destinations"
                      variant="gallery"
                      value={img.src}
                      onUploaded={([url]) => {
                        if (!url) return;
                        const gallery = [...item.gallery];
                        gallery[gIndex] = { ...img, src: url };
                        const next = [...items]; next[index] = { ...item, gallery }; onChange(next);
                      }}
                    />
                    <TextInput label="Caption" value={img.caption} onChange={(e) => {
                      const gallery = [...item.gallery];
                      gallery[gIndex] = { ...img, caption: e.target.value };
                      const next = [...items]; next[index] = { ...item, gallery }; onChange(next);
                    }} />
                    <TextInput label="Alt text" value={img.alt} onChange={(e) => {
                      const gallery = [...item.gallery];
                      gallery[gIndex] = { ...img, alt: e.target.value };
                      const next = [...items]; next[index] = { ...item, gallery }; onChange(next);
                    }} />
                    <button
                      type="button"
                      className="self-end text-sm font-semibold text-red-600"
                      onClick={() => {
                        if (!confirmDelete("this gallery image")) return;
                        const gallery = item.gallery.filter((_, i) => i !== gIndex);
                        const next = [...items]; next[index] = { ...item, gallery }; onChange(next);
                      }}
                    >
                      Delete image
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="text-sm font-semibold text-red-600"
                onClick={() => {
                  if (!confirmDelete(item.name || "this destination")) return;
                  onChange(items.filter((_, i) => i !== index));
                }}
              >
                Delete destination
              </button>
            </>
          ) : null}
        </Card>
      ))}
    </>
  );
}

function FleetEditor({
  items,
  onChange,
}: {
  items: CmsBundle["fleet"];
  onChange: (items: CmsBundle["fleet"]) => void;
}) {
  const [open, setOpen] = useState(items[0]?.id || "");

  function addVehicle() {
    const id = `fleet-${Date.now()}`;
    const slug = `new-vehicle-${Date.now()}`;
    onChange([
      {
        id,
        slug,
        name: "New vehicle",
        shortName: "Vehicle",
        badge: "Seater",
        seatingCapacity: null,
        description: "",
        features: [],
        coverImage: "/images/fleet/traveller/cover.jpg",
        coverAlt: "",
        owned: false,
        available: true,
        gallery: [],
      },
      ...items,
    ]);
    setOpen(id);
  }

  return (
    <>
      <button type="button" className={cn(buttonVariants({ variant: "outline" }))} onClick={addVehicle}>
        Add fleet vehicle
      </button>
      {items.map((item, index) => (
        <Card
          key={item.id}
          title={item.name}
          badge={
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                item.available ? "bg-teal/10 text-teal" : "bg-slate-200 text-slate-600",
              )}
            >
              {item.available ? "Enabled" : "Disabled"}
            </span>
          }
        >
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="text-sm font-semibold text-teal"
              onClick={() => setOpen(open === item.id ? "" : item.id)}
            >
              {open === item.id ? "Hide" : "Edit"}
            </button>
            <button
              type="button"
              className="text-sm font-semibold text-navy"
              onClick={() => {
                const next = [...items];
                next[index] = { ...item, available: !item.available };
                onChange(next);
              }}
            >
              {item.available ? "Disable on website" : "Enable on website"}
            </button>
          </div>

          {open === item.id ? (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <TextInput label="Name" value={item.name} onChange={(e) => {
                  const next = [...items]; next[index] = { ...item, name: e.target.value }; onChange(next);
                }} />
                <TextInput label="Short name" value={item.shortName} onChange={(e) => {
                  const next = [...items]; next[index] = { ...item, shortName: e.target.value }; onChange(next);
                }} />
                <TextInput label="Slug" value={item.slug} onChange={(e) => {
                  const next = [...items]; next[index] = { ...item, slug: e.target.value }; onChange(next);
                }} />
                <TextInput label="Badge" value={item.badge} onChange={(e) => {
                  const next = [...items]; next[index] = { ...item, badge: e.target.value }; onChange(next);
                }} />
                <TextInput
                  type="number"
                  label="Seating capacity"
                  value={item.seatingCapacity ?? ""}
                  onChange={(e) => {
                    const next = [...items];
                    next[index] = {
                      ...item,
                      seatingCapacity: e.target.value === "" ? null : Number(e.target.value),
                    };
                    onChange(next);
                  }}
                />
              </div>
              <TextArea label="Description" value={item.description} onChange={(e) => {
                const next = [...items]; next[index] = { ...item, description: e.target.value }; onChange(next);
              }} />
              <TextArea label="Features (one per line)" value={item.features.join("\n")} onChange={(e) => {
                const next = [...items]; next[index] = { ...item, features: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) }; onChange(next);
              }} />
              <TextInput label="Cover image" value={item.coverImage} onChange={(e) => {
                const next = [...items]; next[index] = { ...item, coverImage: e.target.value }; onChange(next);
              }} />
              <ImageUploadField
                label="Upload cover image"
                folder="fleet"
                variant="cover"
                value={item.coverImage}
                onUploaded={([url]) => {
                  if (!url) return;
                  const next = [...items];
                  next[index] = { ...item, coverImage: url };
                  onChange(next);
                }}
              />
              <TextInput label="Cover alt text" value={item.coverAlt} onChange={(e) => {
                const next = [...items]; next[index] = { ...item, coverAlt: e.target.value }; onChange(next);
              }} />
              <div className="flex gap-4">
                <CheckInput label="Enabled (show on website)" checked={item.available} onChange={(value) => {
                  const next = [...items]; next[index] = { ...item, available: value }; onChange(next);
                }} />
                <CheckInput label="Owned" checked={item.owned} onChange={(value) => {
                  const next = [...items]; next[index] = { ...item, owned: value }; onChange(next);
                }} />
              </div>

              <div className="space-y-3 border-t border-slate-100 pt-4">
                <h3 className="font-semibold text-navy">Fleet gallery</h3>
                <ImageUploadField
                  label="Upload gallery images"
                  folder="fleet"
                  variant="gallery"
                  multiple
                  onUploaded={(urls) => {
                    const next = [...items];
                    next[index] = {
                      ...item,
                      gallery: [
                        ...item.gallery,
                        ...urls.map((src, i) => ({
                          id: `${item.id}-img-${Date.now()}-${i}`,
                          src,
                          alt: item.name,
                          caption: "",
                          category: "front-exterior" as FleetImageCategory,
                        })),
                      ],
                    };
                    onChange(next);
                  }}
                />
                <MultiImagePaths
                  label="Or paste image paths (one per line)"
                  onAdd={(paths) => {
                    const next = [...items];
                    next[index] = {
                      ...item,
                      gallery: [
                        ...item.gallery,
                        ...paths.map((src, i) => ({
                          id: `${item.id}-img-${Date.now()}-${i}`,
                          src,
                          alt: item.name,
                          caption: "",
                          category: "front-exterior" as FleetImageCategory,
                        })),
                      ],
                    };
                    onChange(next);
                  }}
                />
                <button
                  type="button"
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                  onClick={() => {
                    const next = [...items];
                    next[index] = {
                      ...item,
                      gallery: [
                        ...item.gallery,
                        {
                          id: `${item.id}-img-${Date.now()}`,
                          src: "",
                          alt: item.name,
                          caption: "",
                          category: "front-exterior",
                        },
                      ],
                    };
                    onChange(next);
                  }}
                >
                  Add one gallery image
                </button>
                {item.gallery.map((img, gIndex) => (
                  <div key={img.id} className="grid gap-3 rounded-xl border border-slate-100 p-3 md:grid-cols-2">
                    <TextInput label="Image path" value={img.src} onChange={(e) => {
                      const gallery = [...item.gallery];
                      gallery[gIndex] = { ...img, src: e.target.value };
                      const next = [...items]; next[index] = { ...item, gallery }; onChange(next);
                    }} />
                    <ImageUploadField
                      label="Replace / upload image"
                      folder="fleet"
                      variant="gallery"
                      value={img.src}
                      onUploaded={([url]) => {
                        if (!url) return;
                        const gallery = [...item.gallery];
                        gallery[gIndex] = { ...img, src: url };
                        const next = [...items]; next[index] = { ...item, gallery }; onChange(next);
                      }}
                    />
                    <TextInput label="Caption" value={img.caption} onChange={(e) => {
                      const gallery = [...item.gallery];
                      gallery[gIndex] = { ...img, caption: e.target.value };
                      const next = [...items]; next[index] = { ...item, gallery }; onChange(next);
                    }} />
                    <TextInput label="Alt text" value={img.alt} onChange={(e) => {
                      const gallery = [...item.gallery];
                      gallery[gIndex] = { ...img, alt: e.target.value };
                      const next = [...items]; next[index] = { ...item, gallery }; onChange(next);
                    }} />
                    <label className="block space-y-1.5">
                      <span className="text-sm font-semibold text-navy">Category</span>
                      <select
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                        value={img.category}
                        onChange={(e) => {
                          const gallery = [...item.gallery];
                          gallery[gIndex] = {
                            ...img,
                            category: e.target.value as FleetImageCategory,
                          };
                          const next = [...items]; next[index] = { ...item, gallery }; onChange(next);
                        }}
                      >
                        {FLEET_IMAGE_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </label>
                    <button
                      type="button"
                      className="text-sm font-semibold text-red-600"
                      onClick={() => {
                        if (!confirmDelete("this gallery image")) return;
                        const gallery = item.gallery.filter((_, i) => i !== gIndex);
                        const next = [...items]; next[index] = { ...item, gallery }; onChange(next);
                      }}
                    >
                      Delete image
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="text-sm font-semibold text-red-600"
                onClick={() => {
                  if (!confirmDelete(item.name || "this vehicle")) return;
                  onChange(items.filter((_, i) => i !== index));
                }}
              >
                Delete vehicle
              </button>
            </>
          ) : null}
        </Card>
      ))}
    </>
  );
}

function ServicesEditor({
  data,
  onChange,
}: {
  data: CmsBundle["services"];
  onChange: (data: CmsBundle["services"]) => void;
}) {
  return (
    <>
      {data.services.map((item, index) => (
        <Card key={item.id} title={item.title}>
          <TextInput label="Title" value={item.title} onChange={(e) => {
            const services = [...data.services]; services[index] = { ...item, title: e.target.value }; onChange({ ...data, services });
          }} />
          <TextArea label="Description" value={item.description} onChange={(e) => {
            const services = [...data.services]; services[index] = { ...item, description: e.target.value }; onChange({ ...data, services });
          }} />
        </Card>
      ))}
      <Card title="Why choose us">
        {data.whyChooseUs.map((item, index) => (
          <div key={item.id} className="grid gap-3 md:grid-cols-2">
            <TextInput label="Title" value={item.title} onChange={(e) => {
              const whyChooseUs = [...data.whyChooseUs]; whyChooseUs[index] = { ...item, title: e.target.value }; onChange({ ...data, whyChooseUs });
            }} />
            <TextArea label="Description" value={item.description} onChange={(e) => {
              const whyChooseUs = [...data.whyChooseUs]; whyChooseUs[index] = { ...item, description: e.target.value }; onChange({ ...data, whyChooseUs });
            }} />
          </div>
        ))}
      </Card>
    </>
  );
}

function FaqsEditor({
  items,
  onChange,
}: {
  items: CmsBundle["faqs"];
  onChange: (items: CmsBundle["faqs"]) => void;
}) {
  return (
    <>
      <button type="button" className={cn(buttonVariants({ variant: "outline" }))} onClick={() => onChange([{ id: `faq-${Date.now()}`, question: "New question", answer: "" }, ...items])}>
        Add FAQ
      </button>
      {items.map((item, index) => (
        <Card key={item.id} title={`FAQ ${index + 1}`}>
          <TextInput label="Question" value={item.question} onChange={(e) => {
            const next = [...items]; next[index] = { ...item, question: e.target.value }; onChange(next);
          }} />
          <TextArea label="Answer" value={item.answer} onChange={(e) => {
            const next = [...items]; next[index] = { ...item, answer: e.target.value }; onChange(next);
          }} />
          <button type="button" className="text-sm font-semibold text-red-600" onClick={() => {
            if (!confirmDelete("this FAQ")) return;
            onChange(items.filter((_, i) => i !== index));
          }}>Delete</button>
        </Card>
      ))}
    </>
  );
}

function ReviewsEditor({
  items,
  onChange,
}: {
  items: CmsBundle["reviews"];
  onChange: (items: CmsBundle["reviews"]) => void;
}) {
  return (
    <>
      <button type="button" className={cn(buttonVariants({ variant: "outline" }))} onClick={() => onChange([{ id: `review-${Date.now()}`, name: "Customer", rating: 5, text: "", tripRoute: "", date: new Date().toISOString().slice(0, 10), isDemo: false, avatarInitials: "CU" }, ...items])}>
        Add review
      </button>
      {items.map((item, index) => (
        <Card key={item.id} title={item.name}>
          <div className="grid gap-4 md:grid-cols-2">
            <TextInput label="Name" value={item.name} onChange={(e) => {
              const next = [...items]; next[index] = { ...item, name: e.target.value }; onChange(next);
            }} />
            <TextInput type="number" min={1} max={5} label="Rating" value={item.rating} onChange={(e) => {
              const next = [...items]; next[index] = { ...item, rating: Number(e.target.value) }; onChange(next);
            }} />
          </div>
          <TextArea label="Review text" value={item.text} onChange={(e) => {
            const next = [...items]; next[index] = { ...item, text: e.target.value }; onChange(next);
          }} />
          <TextInput label="Trip route" value={item.tripRoute || ""} onChange={(e) => {
            const next = [...items]; next[index] = { ...item, tripRoute: e.target.value }; onChange(next);
          }} />
          <CheckInput label="Mark as demo/sample" checked={item.isDemo} onChange={(value) => {
            const next = [...items]; next[index] = { ...item, isDemo: value }; onChange(next);
          }} />
          <button type="button" className="text-sm font-semibold text-red-600" onClick={() => {
            if (!confirmDelete("this review")) return;
            onChange(items.filter((_, i) => i !== index));
          }}>Delete</button>
        </Card>
      ))}
    </>
  );
}

function BlogEditor({
  items,
  onChange,
}: {
  items: CmsBundle["blog"];
  onChange: (items: CmsBundle["blog"]) => void;
}) {
  const [open, setOpen] = useState(items[0]?.slug || "");
  return (
    <>
      <button type="button" className={cn(buttonVariants({ variant: "outline" }))} onClick={() => {
        const slug = `new-post-${Date.now()}`;
        onChange([{ slug, title: "New article", excerpt: "", date: new Date().toISOString().slice(0, 10), readingTime: "4 min read", coverImage: "/images/blog/choose-traveller.jpg", coverAlt: "", tags: [], content: [""], gallery: [] }, ...items]);
        setOpen(slug);
      }}>Add article</button>
      {items.map((item, index) => (
        <Card key={item.slug} title={item.title}>
          <button type="button" className="text-sm font-semibold text-teal" onClick={() => setOpen(open === item.slug ? "" : item.slug)}>
            {open === item.slug ? "Hide" : "Edit"}
          </button>
          {open === item.slug ? (
            <>
              <TextInput label="Title" value={item.title} onChange={(e) => {
                const next = [...items]; next[index] = { ...item, title: e.target.value }; onChange(next);
              }} />
              <TextInput label="Slug" value={item.slug} onChange={(e) => {
                const next = [...items]; next[index] = { ...item, slug: e.target.value }; onChange(next);
              }} />
              <TextArea label="Excerpt" value={item.excerpt} onChange={(e) => {
                const next = [...items]; next[index] = { ...item, excerpt: e.target.value }; onChange(next);
              }} />
              <TextArea label="Article paragraphs (blank line between paragraphs)" value={item.content.join("\n\n")} onChange={(e) => {
                const next = [...items]; next[index] = { ...item, content: e.target.value.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean) }; onChange(next);
              }} />
              <TextInput label="Cover image" value={item.coverImage} onChange={(e) => {
                const next = [...items]; next[index] = { ...item, coverImage: e.target.value }; onChange(next);
              }} />
              <ImageUploadField
                label="Upload cover image"
                folder="blog"
                variant="cover"
                value={item.coverImage}
                onUploaded={([url]) => {
                  if (!url) return;
                  const next = [...items];
                  next[index] = { ...item, coverImage: url };
                  onChange(next);
                }}
              />
              <TextInput label="Cover alt" value={item.coverAlt} onChange={(e) => {
                const next = [...items]; next[index] = { ...item, coverAlt: e.target.value }; onChange(next);
              }} />
              <TextInput label="Tags (comma separated)" value={item.tags.join(", ")} onChange={(e) => {
                const next = [...items]; next[index] = { ...item, tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }; onChange(next);
              }} />

              <div className="space-y-3 border-t border-slate-100 pt-4">
                <h3 className="font-semibold text-navy">Article gallery images</h3>
                <ImageUploadField
                  label="Upload gallery images"
                  folder="blog"
                  variant="gallery"
                  multiple
                  onUploaded={(urls) => {
                    const gallery = [...(item.gallery || [])];
                    urls.forEach((src) => gallery.push({ src, alt: item.title, caption: "" }));
                    const next = [...items]; next[index] = { ...item, gallery }; onChange(next);
                  }}
                />
                <MultiImagePaths
                  label="Or paste image paths (one per line)"
                  onAdd={(paths) => {
                    const gallery = [...(item.gallery || [])];
                    paths.forEach((src) => gallery.push({ src, alt: item.title, caption: "" }));
                    const next = [...items]; next[index] = { ...item, gallery }; onChange(next);
                  }}
                />
                {(item.gallery || []).map((img, gIndex) => (
                  <div key={`${img.src}-${gIndex}`} className="grid gap-3 rounded-xl border border-slate-100 p-3 md:grid-cols-2">
                    <TextInput label="Image path" value={img.src} onChange={(e) => {
                      const gallery = [...(item.gallery || [])];
                      gallery[gIndex] = { ...img, src: e.target.value };
                      const next = [...items]; next[index] = { ...item, gallery }; onChange(next);
                    }} />
                    <ImageUploadField
                      label="Replace this image"
                      folder="blog"
                      variant="gallery"
                      value={img.src}
                      onUploaded={([url]) => {
                        if (!url) return;
                        const gallery = [...(item.gallery || [])];
                        gallery[gIndex] = { ...img, src: url };
                        const next = [...items]; next[index] = { ...item, gallery }; onChange(next);
                      }}
                    />
                    <TextInput label="Caption" value={img.caption || ""} onChange={(e) => {
                      const gallery = [...(item.gallery || [])];
                      gallery[gIndex] = { ...img, caption: e.target.value };
                      const next = [...items]; next[index] = { ...item, gallery }; onChange(next);
                    }} />
                    <TextInput label="Alt text" value={img.alt} onChange={(e) => {
                      const gallery = [...(item.gallery || [])];
                      gallery[gIndex] = { ...img, alt: e.target.value };
                      const next = [...items]; next[index] = { ...item, gallery }; onChange(next);
                    }} />
                    <button type="button" className="self-end text-sm font-semibold text-red-600" onClick={() => {
                      if (!confirmDelete("this image")) return;
                      const gallery = (item.gallery || []).filter((_, i) => i !== gIndex);
                      const next = [...items]; next[index] = { ...item, gallery }; onChange(next);
                    }}>Delete image</button>
                  </div>
                ))}
              </div>

              <button type="button" className="text-sm font-semibold text-red-600" onClick={() => {
                if (!confirmDelete(item.title || "this article")) return;
                onChange(items.filter((_, i) => i !== index));
              }}>Delete article</button>
            </>
          ) : null}
        </Card>
      ))}
    </>
  );
}

function GalleryEditor({
  data,
  onChange,
}: {
  data: CmsBundle["gallery"];
  onChange: (data: CmsBundle["gallery"]) => void;
}) {
  return (
    <>
      <ImageUploadField
        label="Upload gallery photos"
        folder="gallery"
        variant="gallery"
        multiple
        onUploaded={(urls) => {
          onChange({
            ...data,
            items: [
              ...urls.map((src, i) => ({
                id: `g-${Date.now()}-${i}`,
                src,
                alt: "",
                caption: "",
                categories: ["force-traveller" as const],
              })),
              ...data.items,
            ],
          });
        }}
      />
      <MultiImagePaths
        label="Or paste image paths (one per line)"
        hint="Each path becomes a gallery item you can edit."
        onAdd={(paths) => {
          onChange({
            ...data,
            items: [
              ...paths.map((src, i) => ({
                id: `g-${Date.now()}-${i}`,
                src,
                alt: "",
                caption: "",
                categories: ["force-traveller" as const],
              })),
              ...data.items,
            ],
          });
        }}
      />
      <button
        type="button"
        className={cn(buttonVariants({ variant: "outline" }))}
        onClick={() =>
          onChange({
            ...data,
            items: [
              {
                id: `g-${Date.now()}`,
                src: "/images/fleet/traveller/cover.jpg",
                alt: "",
                caption: "",
                categories: ["force-traveller"],
              },
              ...data.items,
            ],
          })
        }
      >
        Add single photo
      </button>
      {data.items.map((item, index) => (
        <Card key={item.id} title={item.caption || item.id}>
          <TextInput label="Image path" value={item.src} onChange={(e) => {
            const items = [...data.items]; items[index] = { ...item, src: e.target.value }; onChange({ ...data, items });
          }} />
          <ImageUploadField
            label="Replace / upload image"
            folder="gallery"
            variant="gallery"
            value={item.src}
            onUploaded={([url]) => {
              if (!url) return;
              const items = [...data.items];
              items[index] = { ...item, src: url };
              onChange({ ...data, items });
            }}
          />
          <TextInput label="Caption" value={item.caption} onChange={(e) => {
            const items = [...data.items]; items[index] = { ...item, caption: e.target.value }; onChange({ ...data, items });
          }} />
          <TextInput label="Alt text" value={item.alt} onChange={(e) => {
            const items = [...data.items]; items[index] = { ...item, alt: e.target.value }; onChange({ ...data, items });
          }} />
          <TextInput label="Categories (comma separated)" value={item.categories.join(", ")} onChange={(e) => {
            const items = [...data.items];
            items[index] = {
              ...item,
              categories: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) as typeof item.categories,
            };
            onChange({ ...data, items });
          }} hint="force-traveller, interiors, exteriors, trip-locations, weddings, corporate, religious" />
          <button
            type="button"
            className="text-sm font-semibold text-red-600"
            onClick={() => {
              if (!confirmDelete(item.caption || "this photo")) return;
              onChange({ ...data, items: data.items.filter((_, i) => i !== index) });
            }}
          >
            Delete
          </button>
        </Card>
      ))}
    </>
  );
}

function PagesEditor({
  data,
  onChange,
}: {
  data: CmsBundle["pages"];
  onChange: (data: CmsBundle["pages"]) => void;
}) {
  return (
    <>
      <Card title="About page">
        <TextArea label="About paragraphs (blank line between paragraphs)" value={data.aboutParagraphs.join("\n\n")} onChange={(e) => onChange({ ...data, aboutParagraphs: e.target.value.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean) })} />
      </Card>
      <Card title="Contact page">
        <TextArea label="Intro text" value={data.contactIntro} onChange={(e) => onChange({ ...data, contactIntro: e.target.value })} />
      </Card>
      <Card title="Privacy policy">
        <TextInput label="Last updated" value={data.privacyLastUpdated} onChange={(e) => onChange({ ...data, privacyLastUpdated: e.target.value })} />
        <TextArea label="Custom privacy text (optional)" value={data.privacyBody} onChange={(e) => onChange({ ...data, privacyBody: e.target.value })} />
      </Card>
      <Card title="Terms of service">
        <TextInput label="Last updated" value={data.termsLastUpdated} onChange={(e) => onChange({ ...data, termsLastUpdated: e.target.value })} />
        <TextArea label="Custom terms text (optional)" value={data.termsBody} onChange={(e) => onChange({ ...data, termsBody: e.target.value })} />
      </Card>
    </>
  );
}
