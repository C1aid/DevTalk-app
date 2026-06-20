import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/landing/motion";

export function CtaSection() {
  return (
    <section className="pb-16 pt-4 md:pb-24">
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal y={32}>
          <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl">
            <div
              aria-hidden
              className="pointer-events-none absolute -left-20 top-1/2 size-72 -translate-y-1/2 rounded-full bg-primary/25 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 top-1/2 size-72 -translate-y-1/2 rounded-full bg-sky-500/10 blur-3xl"
            />

            <div className="liquid-glass relative rounded-2xl px-6 py-12 text-center sm:px-10 md:py-16">
              <h2
                className="text-2xl font-normal tracking-tight text-white sm:text-3xl md:text-4xl"
                style={{ letterSpacing: "-0.03em" }}
              >
                Your team&apos;s next conversation
                <span className="text-gradient block">starts in one minute.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
                Create a workspace, invite your squad, and send the first message
                — no sales call, no credit card.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
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
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
