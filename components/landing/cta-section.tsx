import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/landing/motion";

export function CtaSection() {
  return (
    <section className="pb-12 pt-2 sm:pb-16 sm:pt-4 md:pb-24">
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal y={32}>
          <div className="relative mx-auto max-w-3xl overflow-hidden rounded-xl sm:rounded-2xl">
            <div
              aria-hidden
              className="pointer-events-none absolute -left-20 top-1/2 size-72 -translate-y-1/2 rounded-full bg-primary/25 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 top-1/2 size-72 -translate-y-1/2 rounded-full bg-sky-500/10 blur-3xl"
            />

            <div className="liquid-glass relative rounded-xl px-5 py-10 text-center sm:rounded-2xl sm:px-10 sm:py-12 md:py-16">
              <h2
                className="text-xl font-normal tracking-tight text-white sm:text-3xl md:text-4xl"
                style={{ letterSpacing: "-0.03em" }}
              >
                Your team&apos;s next conversation
                <span className="text-gradient block sm:inline">
                  {" "}starts in one minute.
                </span>
              </h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                Create a workspace, invite your squad, and send the first message
                — no sales call, no credit card.
              </p>

              <div className="mt-7 flex flex-col items-stretch gap-2.5 sm:mt-8 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
                <Link
                  href="/signup"
                  className="btn-brand inline-flex h-12 w-full items-center justify-center px-6 text-sm sm:w-auto sm:px-8 sm:text-base"
                >
                  Create free workspace
                  <ArrowRight className="ml-1.5 size-4" aria-hidden />
                </Link>
                <Link
                  href="/login"
                  className="btn-brand-outline inline-flex h-12 w-full items-center justify-center px-6 text-sm sm:w-auto sm:px-8 sm:text-base"
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
