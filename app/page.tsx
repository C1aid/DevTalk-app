import { CtaSection } from "@/components/landing/cta-section";
import { FaqAccordion } from "@/components/landing/faq-accordion";
import { FeaturesSection } from "@/components/landing/features-section";
import { HeroSection } from "@/components/landing/hero-section";
import { LandingStats } from "@/components/landing/landing-stats";
import { Reveal, RevealText } from "@/components/landing/motion";
import { PricingTable } from "@/components/landing/pricing-table";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";

const faqs = [
  {
    question: "Do I need a credit card to get started?",
    answer:
      "No. Create an account, set up your workspace, and start messaging your team for free. A credit card is only required if you decide to upgrade to Pro.",
  },
  {
    question: "What are the limits on the Free plan?",
    answer:
      "Free includes 90 days of message history, up to 10 channels, threads, reactions, Markdown, code blocks, and GitHub link previews. Search is available within your 90-day message window.",
  },
  {
    question: "What do I get with Pro?",
    answer:
      "Pro removes the Free plan limits: unlimited message history, unlimited channels, and full-text search across your entire archive. Pro also includes priority support.",
  },
  {
    question: "How much does Pro cost?",
    answer:
      "Pro is $8 USD per month, billed monthly per account through Stripe. You can upgrade at any time from Settings in your dashboard.",
  },
  {
    question: "Can I create private channels?",
    answer:
      "Yes. Channels can be public to everyone in your workspace or private for invite-only access — useful for sensitive discussions or smaller group coordination.",
  },
  {
    question: "What happens to messages older than 90 days on Free?",
    answer:
      "On the Free plan, messages older than 90 days are no longer visible in your workspace or search results. Your data is retained — upgrading to Pro restores access to your full message history.",
  },
  {
    question: "Does DevTalk include AI features?",
    answer:
      "No. DevTalk is focused on clear, reliable team chat for developers. There are no AI summaries, assistant bots, or paid AI add-ons.",
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

        <section id="faq" className="scroll-mt-24 border-t border-border py-16 md:py-24">
          <div className="container mx-auto px-4">
            <Reveal className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                <RevealText
                  as="span"
                  text="Frequently asked questions"
                  wordDelay={75}
                />
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
