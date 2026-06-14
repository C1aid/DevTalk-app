import Link from "next/link";
import {
  ArrowRight,
  Check,
  FileText,
  Pencil,
  Share2,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { FaqAccordion } from "@/components/landing/faq-accordion";
import { HeroSection } from "@/components/landing/hero-section";
import { TechMarquee } from "@/components/landing/tech-marquee";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";

const features = [
  {
    icon: Pencil,
    title: "Rich text editor",
    description:
      "Bold, italic, lists, and more. Changes save automatically so you never lose work.",
  },
  {
    icon: Users,
    title: "Real-time collaboration",
    description:
      "Edit notes together with live sync and presence indicators. See who is online.",
  },
  {
    icon: Share2,
    title: "Share & invite",
    description:
      "Invite collaborators to shared notes. Premium users get unlimited sharing.",
  },
  {
    icon: Zap,
    title: "Auto-save",
    description:
      "Every keystroke is persisted. No save button, no anxiety about losing drafts.",
  },
  {
    icon: FileText,
    title: "Organized notes",
    description:
      "Create, search, and manage notes from a clean dashboard built for focus.",
  },
  {
    icon: Sparkles,
    title: "Simple pricing",
    description:
      "Start free with 5 notes. Upgrade to Premium for unlimited notes and collaboration.",
  },
];

const pricingFeatures = [
  {
    title: "Unlimited notes",
    description: "Create as many notes as you need with Premium. No caps, no friction.",
  },
  {
    title: "Real-time collaboration",
    description: "Invite teammates and edit together with live sync across devices.",
  },
  {
    title: "Stripe billing",
    description: "Secure checkout and subscription management powered by Stripe.",
  },
];

const faqs = [
  {
    question: "How does the free plan work?",
    answer:
      "The free plan includes up to 5 notes, the rich text editor, and auto-save. It is perfect for trying NoteFlow before upgrading.",
  },
  {
    question: "What do I get with Premium?",
    answer:
      "Premium unlocks unlimited notes, real-time collaboration, and the ability to share notes and invite collaborators.",
  },
  {
    question: "How quickly can I get started?",
    answer:
      "Sign up, confirm your email, and you can create your first note in under two minutes. No sales calls or setup wizard.",
  },
  {
    question: "Is my data secure?",
    answer:
      "NoteFlow uses Supabase Auth with row-level security. Your notes are tied to your account and protected by database policies.",
  },
  {
    question: "Can I collaborate in real time?",
    answer:
      "Yes. Premium users can share notes and edit together with live sync and presence indicators.",
  },
  {
    question: "How does billing work?",
    answer:
      "Premium is $9/month via Stripe Checkout. You can manage your subscription from the settings page.",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: ["Up to 5 notes", "Rich text editor", "Auto-save"],
    cta: "Start for free",
    href: "/signup",
    highlighted: false,
  },
  {
    name: "Premium",
    price: "$9",
    period: "per month",
    description: "For teams and power users",
    features: [
      "Unlimited notes",
      "Real-time collaboration",
      "Share & invite collaborators",
    ],
    cta: "Upgrade to Premium",
    href: "/signup",
    highlighted: true,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader overlapHero />

      <main>
        <HeroSection />

        <TechMarquee />

        <section id="features" className="py-24 md:py-32">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-medium uppercase tracking-widest text-primary">
                Features
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Built to cover your needs
              </h2>
              <p className="mt-4 text-muted-foreground">
                Everything you need for collaborative note-taking, designed for
                developers and teams.
              </p>
            </div>

            <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(({ icon: Icon, title, description }) => (
                <div key={title} className="glass-card group p-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20 transition-colors group-hover:bg-primary/15">
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

        <section id="quickstart" className="border-y border-border py-24 md:py-32">
          <div className="container mx-auto px-4">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <p className="text-sm font-medium uppercase tracking-widest text-primary">
                  Quickstart
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                  Start writing in minutes
                </h2>
                <p className="mt-4 text-muted-foreground">
                  A focused two-step workflow that keeps your team shipping fast.
                </p>

                <div className="mt-10 space-y-8">
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold">Create your account</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Sign up with email or Google. Confirm your email and you are
                        ready to go.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold">Create your first note</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Open the dashboard, hit New Note, and start writing. Auto-save
                        handles the rest.
                      </p>
                    </div>
                  </div>
                </div>

                <Link href="/signup" className="btn-brand mt-10 inline-flex h-10 px-6 text-sm">
                  Open dashboard
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>

              <div className="terminal-window">
                <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-xs text-muted-foreground">terminal</span>
                </div>
                <pre className="overflow-x-auto p-6 font-mono text-sm leading-relaxed text-muted-foreground">
                  <code>
                    <span className="text-primary">$</span> git clone{" "}
                    <span className="text-foreground/80">
                      https://github.com/C1aid/noteflow
                    </span>
                    {"\n"}
                    <span className="text-primary">$</span> cd noteflow && npm install
                    {"\n"}
                    <span className="text-primary">$</span> cp .env.example .env.local
                    {"\n"}
                    <span className="text-primary">$</span> npm run dev
                    {"\n\n"}
                    <span className="text-white/80">
                      ✓ Ready on http://localhost:3001
                    </span>
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="py-24 md:py-32">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-medium uppercase tracking-widest text-primary">
                Pricing
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Pay only for what you need
              </h2>
              <p className="mt-4 text-muted-foreground">
                No contracts, no minimums. Start free and upgrade when you are ready.
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-4xl gap-6 md:grid-cols-2">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`glass-card p-8 ${plan.highlighted ? "border-primary/30" : ""}`}
                >
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-5xl font-bold tracking-tight">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  <ul className="mt-8 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm">
                        <Check className="h-4 w-4 shrink-0 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={plan.href}
                    className={`mt-8 flex h-11 w-full items-center justify-center rounded-md text-sm font-semibold transition-all duration-200 ${
                      plan.highlighted ? "btn-brand" : "btn-brand-outline"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>

            <div className="mx-auto mt-16 grid max-w-4xl gap-5 md:grid-cols-3">
              {pricingFeatures.map(({ title, description }) => (
                <div key={title} className="glass-card p-6">
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="border-t border-border py-24 md:py-32">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-muted-foreground">
                Can&apos;t find what you&apos;re looking for?{" "}
                <Link href="/signup" className="text-primary hover:underline">
                  Get started
                </Link>
              </p>
            </div>

            <FaqAccordion items={faqs} />
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="glass relative overflow-hidden rounded-xl px-8 py-16 text-center md:px-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to take better notes?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
                Join NoteFlow and start collaborating with your team today. Free to
                try, no credit card required.
              </p>
              <Link href="/signup" className="btn-brand mt-8 inline-flex h-12 px-8 text-base">
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
