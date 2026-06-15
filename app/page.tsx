import Link from "next/link";
import {
  ArrowRight,
  Code2,
  GitBranch,
  Hash,
  MessageSquare,
  Zap,
} from "lucide-react";
import { FaqAccordion } from "@/components/landing/faq-accordion";
import { HeroSection } from "@/components/landing/hero-section";
import { LandingStats } from "@/components/landing/landing-stats";
import { PricingTable } from "@/components/landing/pricing-table";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";

const features = [
  {
    icon: Hash,
    title: "Channels",
    description:
      "Organize conversations by project, team, or topic — public or private.",
  },
  {
    icon: MessageSquare,
    title: "Threads & reactions",
    description:
      "Keep discussions focused with threads and express yourself with emoji reactions.",
  },
  {
    icon: Code2,
    title: "Markdown & code",
    description:
      "Write in Markdown with syntax-highlighted code blocks — built for developers.",
  },
  {
    icon: GitBranch,
    title: "GitHub previews",
    description:
      "Paste a PR, issue, or commit link and get a rich preview inline.",
  },
  {
    icon: Zap,
    title: "Real-time",
    description:
      "Messages appear instantly with Supabase Realtime — no refresh needed.",
  },
  {
    icon: MessageSquare,
    title: "Simple pricing",
    description:
      "Free to start. Pro unlocks unlimited history and channels — no AI upsells.",
  },
];

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

        <section id="features" className="py-16 md:py-24 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-medium uppercase tracking-widest text-primary">
                Features
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                Chat built for developers
              </h2>
              <p className="mt-4 text-muted-foreground">
                Channels, threads, code blocks, and GitHub previews — without the
                noise.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {features.map(({ icon: Icon, title, description }) => (
                <div key={title} className="glass-card group p-5 sm:p-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <PricingTable />

        <section id="faq" className="border-t border-border py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                Frequently Asked Questions
              </h2>
            </div>
            <FaqAccordion items={faqs} />
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="glass relative overflow-hidden rounded-xl px-6 py-12 text-center sm:px-8 md:px-16 md:py-16">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                Ready to talk code with your team?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
                Start free — no credit card required.
              </p>
              <Link
                href="/signup"
                className="btn-brand mt-8 inline-flex h-12 px-8 text-base"
              >
                Get started free
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
