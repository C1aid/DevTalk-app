import { Reveal } from "@/components/landing/motion";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: "01",
    title: "One workspace for your team",
    body: "Create a workspace, invite teammates, and land in a shared home. Switch between projects from the sidebar — no separate accounts, no tab chaos.",
    visual: "workspace" as const,
  },
  {
    number: "02",
    title: "Conversations that stay in context",
    body: "Public channels for the whole squad. Private channels for sensitive work. Threads branch side discussions without flooding the timeline. DMs when it's just two of you.",
    visual: "thread" as const,
  },
  {
    number: "03",
    title: "Messages that speak developer",
    body: "Markdown, syntax-highlighted blocks, GitHub PR previews, and file attachments — in the same composer. Paste a link, drop a file, keep moving.",
    visual: "code" as const,
  },
];

function StepVisual({ variant }: { variant: "workspace" | "thread" | "code" }) {
  if (variant === "workspace") {
    return (
      <div className="liquid-glass rounded-xl p-4 sm:p-5">
        <div className="mb-3 flex items-center gap-2 border-b border-white/10 pb-3">
          <div className="size-2 rounded-full bg-white/20" />
          <span className="text-[11px] uppercase tracking-widest text-white/50">
            Acme Engineering
          </span>
        </div>
        <div className="space-y-1.5 text-sm">
          <p className="text-[10px] uppercase tracking-wider text-white/35">
            Frontend
          </p>
          <p className="rounded-lg bg-white/[0.08] px-3 py-2 text-white/90">
            # design-system
          </p>
          <p className="rounded-lg px-3 py-2 text-white/55"># web-app</p>
          <p className="mt-3 text-[10px] uppercase tracking-wider text-white/35">
            Backend
          </p>
          <p className="rounded-lg px-3 py-2 text-white/55"># api</p>
          <p className="rounded-lg px-3 py-2 text-white/55"># infra</p>
        </div>
      </div>
    );
  }

  if (variant === "thread") {
    return (
      <div className="liquid-glass space-y-3 rounded-xl p-4 sm:p-5">
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
          <p className="text-sm text-white/90">
            Should we ship the auth refactor this sprint?
          </p>
          <p className="mt-2 text-xs text-primary">4 replies in thread</p>
        </div>
        <div className="ml-4 space-y-2 border-l border-white/10 pl-4">
          <p className="text-sm text-white/70">
            LGTM — merged the middleware changes.
          </p>
          <p className="text-sm text-white/55">
            Waiting on staging deploy before we cut release.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="liquid-glass rounded-xl p-4 sm:p-5">
      <p className="text-sm text-white/80">
        PR looks good — one nit on the error handler:
      </p>
      <pre className="mt-3 overflow-x-auto rounded-lg border border-white/10 bg-black/50 p-3 text-xs leading-relaxed text-emerald-300/90">
        <code>{`if (!session) {\n  return redirect('/login')\n}`}</code>
      </pre>
      <div className="mt-3 rounded-lg border border-white/10 bg-white/[0.04] p-3">
        <p className="text-xs font-medium text-white/90">
          fix: session middleware edge case
        </p>
        <p className="mt-1 text-[11px] text-white/45">
          acme/web-app · PR #142 · merged
        </p>
      </div>
    </div>
  );
}

export function LandingProductStory() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 border-y border-white/[0.06] py-12 sm:py-16 md:py-24 lg:py-28"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            How it works
          </p>
          <h2
            className="mt-3 text-2xl font-normal tracking-tight text-white sm:text-3xl md:text-4xl"
            style={{ letterSpacing: "-0.03em" }}
          >
            <span className="inline-flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1">
              <span>Workspace</span>
              <span className="text-white/25" aria-hidden>
                /
              </span>
              <span>channel</span>
              <span className="text-white/25" aria-hidden>
                /
              </span>
              <span>message</span>
            </span>
            <span className="mt-2 block text-muted-foreground">
              Nothing extra in between.
            </span>
          </h2>
        </Reveal>

        <div className="mx-auto mt-10 max-w-5xl space-y-12 sm:mt-14 sm:space-y-16 md:mt-20 md:space-y-24">
          {steps.map(({ number, title, body, visual }, index) => {
            const reversed = index % 2 === 1;

            return (
              <Reveal key={number} delay={index * 60} y={28}>
                <div
                  className={cn(
                    "grid items-center gap-6 sm:gap-8 md:grid-cols-2 md:gap-12 lg:gap-16",
                    reversed && "md:[&>div:first-child]:order-2",
                  )}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium tabular-nums text-white/30">
                      {number}
                    </p>
                    <h3
                      className="mt-2 text-lg font-normal tracking-tight text-white sm:text-xl md:text-2xl"
                      style={{ letterSpacing: "-0.03em" }}
                    >
                      {title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-base">
                      {body}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <StepVisual variant={visual} />
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
