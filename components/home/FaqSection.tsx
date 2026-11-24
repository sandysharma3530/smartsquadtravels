"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/content/faqs";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";

type FaqSectionProps = {
  className?: string;
  faqs: FaqItem[];
};

export function FaqSection({ className, faqs }: FaqSectionProps) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  return (
    <section
      id="faq"
      className={cn("section-pad bg-bg-light", className)}
      aria-labelledby="faq-heading"
    >
      <div className="container-site">
        <SectionHeader
          title="Questions we hear often"
          subtitle="Which vehicle to choose, where we pick you up, and what the price includes."
        />

        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            const panelId = `faq-panel-${faq.id}`;
            const buttonId = `faq-button-${faq.id}`;

            return (
              <div
                key={faq.id}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft"
              >
                <h3 className="text-base font-semibold text-navy">
                  <button
                    id={buttonId}
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 shrink-0 text-teal transition-transform",
                        isOpen && "rotate-180",
                      )}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className="border-t border-slate-100 px-5 pb-4 pt-0"
                >
                  <p className="pt-3 text-sm leading-relaxed text-text-muted md:text-base">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Visually linked heading id for aria-labelledby */}
      <span id="faq-heading" className="sr-only">
        Before you enquire
      </span>
    </section>
  );
}
