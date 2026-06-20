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
    <section className="py-16 md:py-20 lg:py-24">
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
          <p className="mt-4 text-muted-foreground">
            Three lines we don&apos;t cross — no matter how the product evolves.
          </p>
        </Reveal>

        <LandingGlassPanel className="mt-12 sm:mt-16" delay={100}>
          <div className="divide-y divide-white/[0.08]">
            {principles.map(({ number, title, body }) => (
              <article
                key={number}
                className="flex flex-col gap-5 px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:gap-10 sm:px-10 sm:py-10 md:px-12"
              >
                <div className="min-w-0 max-w-xl">
                  <p className="text-xs font-medium tabular-nums tracking-[0.2em] text-white/35">
                    {number}
                  </p>
                  <h3
                    className="mt-3 text-lg font-medium tracking-tight text-white sm:text-xl"
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                    {body}
                  </p>
                </div>

                <p
                  className="self-end shrink-0 select-none text-[4rem] font-light leading-none tabular-nums text-white/[0.05] sm:self-auto sm:text-[6rem] md:text-[7rem]"
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
