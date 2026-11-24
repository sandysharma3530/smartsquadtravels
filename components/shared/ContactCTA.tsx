import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { getWhatsAppLink } from "@/content/site-config";
import { getCmsSite } from "@/lib/cms/content";
import { isConfigured } from "@/lib/placeholders";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

type ContactCTAProps = {
  heading?: string;
  text?: string;
  className?: string;
};

export async function ContactCTA({
  heading = "Ready to plan the trip?",
  text = "Tell us the date, where to pick everyone up, and how many people are coming. We will reply with a vehicle and a price.",
  className,
}: ContactCTAProps) {
  const site = await getCmsSite();
  const whatsappConfigured = isConfigured(site.whatsappNumber);

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-navy via-navy-secondary to-navy",
        className,
      )}
      aria-labelledby="contact-cta-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, var(--teal) 0%, transparent 50%), radial-gradient(circle at 80% 50%, var(--teal-light) 0%, transparent 40%)",
        }}
      />

      <div className="container-site relative section-pad">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="contact-cta-heading"
            className="text-balance text-3xl font-bold text-white md:text-4xl"
          >
            {heading}
          </h2>
          <p className="mt-4 text-balance text-base text-white/80 md:text-lg">
            {text}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className={cn(buttonVariants({ variant: "teal", size: "lg" }))}
            >
              Get a quote
            </Link>
            {whatsappConfigured ? (
              <a
                href={getWhatsAppLink(undefined, site.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "whatsapp", size: "lg" }))}
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                WhatsApp Us
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
