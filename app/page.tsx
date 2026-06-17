import { CtaSection } from "@/components/landing/cta-section";
import { FaqAccordion } from "@/components/landing/faq-accordion";
import { FeaturesSection } from "@/components/landing/features-section";
import { HeroSection } from "@/components/landing/hero-section";
import { LandingStats } from "@/components/landing/landing-stats";
import { Reveal } from "@/components/landing/motion";
import { PricingTable } from "@/components/landing/pricing-table";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";

const faqs = [
  {
    question: "How does the Free plan work?",
    answer:
      "Free includes 90 days of message history, up to 10 channels, threads, reactions, Markdown, and GitHub link previews.",
  },
  {
    question: "What do I get with Pro?",
    answer:
      "Pro unlocks unlimited message history, unlimited channels, and full-text search across all messages.",
  },
  {
    question: "Is there any AI?",
    answer:
      "No. DevTalk is a clean team chat — no AI summaries, bots, or search upsells.",
  },
  {
    question: "How does billing work?",
    answer:
      "Pro is $8/month via Stripe Checkout in test mode. Use test card 4242 4242 4242 4242 — no real charge.",
  },
  {
    question: "Can I self-host?",
    answer:
      "DevTalk runs on Next.js, Supabase, and Stripe. Clone the repo and deploy to Vercel with your own Supabase project.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader overlapHero />

      <main>
        <HeroSection />
        <LandingStats />
        <FeaturesSection />
        <PricingTable />

        <section id="faq" className="border-t border-border py-16 md:py-24">
          <div className="container mx-auto px-4">
            <Reveal className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                Frequently Asked Questions
              </h2>
            </Reveal>
            <FaqAccordion items={faqs} />
          </div>
        </section>

        <CtaSection />
      </main>

      <Reveal y={20}>
        <SiteFooter />
      </Reveal>
    </div>
  );
}
