import { Reveal } from "@/components/landing/motion";
import { LandingGlassPanel } from "@/components/landing/landing-glass-panel";

const principles = [
  {
    number: "01",
    title: "No AI in your timeline",
    body: "DevTalk will never inject summaries, bots, or paid AI add-ons into your workspace. Your messages are yours — not training data.",
  },
  {
    number: "02",
    title: "No pricing traps",
    body: "Free is genuinely usable. Pro is one flat $8/month upgrade when you outgrow limits — not a per-seat calculator that punishes growth.",
  },
  {
    number: "03",
    title: "No enterprise gatekeeping",
    body: "Threads, code blocks, GitHub previews, and file uploads are on every plan. We don't hide basics behind a sales call.",
  },
];

export function LandingPrinciples() {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Philosophy
          </p>
          <h2
            className="mt-3 text-2xl font-normal tracking-tight text-white sm:text-3xl md:text-4xl"
            style={{ letterSpacing: "-0.03em" }}
          >
            Built for teams tired of chat bloat.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Three lines we don&apos;t cross — no matter how the product evolves.
          </p>
        </Reveal>

        <LandingGlassPanel className="mt-8 sm:mt-12 md:mt-16" delay={100}>
          <div className="divide-y divide-white/[0.08]">
            {principles.map(({ number, title, body }) => (
              <article
                key={number}
                className="relative px-5 py-7 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:px-8 sm:py-9 md:gap-10 md:px-10 md:py-10 lg:px-12"
              >
                <div className="relative z-10 min-w-0 max-w-xl pr-14 sm:pr-0">
                  <p className="text-xs font-medium tabular-nums tracking-[0.2em] text-white/35">
                    {number}
                  </p>
                  <h3
                    className="mt-2.5 text-base font-medium tracking-tight text-white sm:mt-3 sm:text-lg md:text-xl"
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    {title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground sm:mt-3 sm:text-[15px]">
                    {body}
                  </p>
                </div>

                <p
                  className="pointer-events-none absolute bottom-3 right-4 select-none text-[3.75rem] font-light leading-none tabular-nums text-white/[0.04] sm:static sm:bottom-auto sm:right-auto sm:shrink-0 sm:text-[5.5rem] md:text-[6.5rem] lg:text-[7rem]"
                  aria-hidden
                >
                  {number}
                </p>
              </article>
            ))}
          </div>
        </LandingGlassPanel>
      </div>
    </section>
  );
}
