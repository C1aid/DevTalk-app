import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "@/components/landing/motion";

const perks = [
  "Free for small teams",
  "No credit card",
  "No AI upsells",
] as const;

export function CtaSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <Reveal y={32}>
          <div className="relative overflow-hidden rounded-2xl">
            <div
              aria-hidden
              className="pointer-events-none absolute -left-20 top-1/2 size-72 -translate-y-1/2 rounded-full bg-primary/25 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 top-1/2 size-72 -translate-y-1/2 rounded-full bg-sky-500/10 blur-3xl"
            />

            <div className="liquid-glass relative rounded-2xl px-6 py-12 text-center sm:px-10 md:px-16 md:py-16">
              <p className="text-sm font-medium uppercase tracking-widest text-primary">
                Get started
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                Less noise.{" "}
                <span className="text-gradient">More shipping.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
                Channels, threads, and code blocks in one workspace — built for
                teams that want clarity, not clutter.
              </p>

              <ul className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                {perks.map((perk, index) => (
                  <Reveal key={perk} as="li" delay={120 + index * 60} y={10}>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted-foreground sm:text-sm">
                      <Check className="size-3.5 shrink-0 text-primary" aria-hidden />
                      {perk}
                    </span>
                  </Reveal>
                ))}
              </ul>

              <Reveal delay={320} y={16} className="mt-8">
                <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <Link
                    href="/signup"
                    className="btn-brand inline-flex h-12 items-center justify-center px-8 text-base"
                  >
                    Create free workspace
                    <ArrowRight className="ml-1.5 size-4" aria-hidden />
                  </Link>
                  <Link
                    href="/login"
                    className="btn-brand-outline inline-flex h-12 items-center justify-center px-8 text-base"
                  >
                    Sign in
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
