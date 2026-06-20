import type { LucideIcon } from "lucide-react";
import {
  Code2,
  GitBranch,
  Hash,
  Layers,
  MessageSquare,
  Paperclip,
  Zap,
} from "lucide-react";
import { Reveal } from "@/components/landing/motion";
import { LandingGlassPanel } from "@/components/landing/landing-glass-panel";
import { cn } from "@/lib/utils";

type Capability = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const organize: Capability[] = [
  {
    icon: Layers,
    title: "Workspaces & sections",
    description:
      "Separate teams or products. Group channels into folders as you grow.",
  },
  {
    icon: Hash,
    title: "Public & private channels",
    description:
      "Open rooms for everyone or invite-only spaces for sensitive work.",
  },
];

const communicate: Capability[] = [
  {
    icon: MessageSquare,
    title: "Threads & reactions",
    description:
      "Branch discussions without noise. React instead of sending '+1'.",
  },
  {
    icon: Zap,
    title: "Realtime delivery",
    description:
      "Messages and reactions sync instantly — no refresh button.",
  },
];

const ship: Capability[] = [
  {
    icon: Code2,
    title: "Markdown & code",
    description: "Syntax-highlighted fences and inline code.",
  },
  {
    icon: GitBranch,
    title: "GitHub previews",
    description: "PRs, issues, and commits unfurl inline.",
  },
  {
    icon: Paperclip,
    title: "File attachments",
    description: "Images, logs, docs — up to 50 MB.",
  },
];

function CapabilityRow({
  icon: Icon,
  title,
  description,
}: Capability) {
  return (
    <div className="group flex gap-3.5 rounded-xl px-3 py-3.5 transition-colors hover:bg-white/[0.04] sm:gap-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] ring-1 ring-white/10 transition-smooth group-hover:bg-white/[0.08]">
        <Icon className="size-3.5 text-white/70" aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

function CapabilityGroup({
  label,
  items,
  className,
}: {
  label: string;
  items: Capability[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 sm:p-5",
        className,
      )}
    >
      <p className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-white/45">
        <span className="h-px w-4 bg-white/25" />
        {label}
      </p>
      <div className="space-y-1">
        {items.map((item) => (
          <CapabilityRow key={item.title} {...item} />
        ))}
      </div>
    </div>
  );
}

function ShipTile({ icon: Icon, title, description }: Capability) {
  return (
    <div className="group rounded-xl border border-white/[0.06] bg-black/20 p-4 transition-colors hover:border-white/12 hover:bg-white/[0.03] sm:p-5">
      <Icon className="size-4 text-white/50 transition-colors group-hover:text-white/80" />
      <p className="mt-4 text-sm font-medium text-white">{title}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-24 py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Capabilities
          </p>
          <h2
            className="mt-3 text-2xl font-normal tracking-tight text-white sm:text-3xl md:text-4xl"
            style={{ letterSpacing: "-0.03em" }}
          >
            Everything a dev team needs to coordinate.
            <span className="block text-muted-foreground">
              Nothing they don&apos;t.
            </span>
          </h2>
        </Reveal>

        <LandingGlassPanel className="mt-12 sm:mt-16" delay={80}>
          <div className="space-y-4 p-5 sm:p-7 md:p-8">
            <div className="grid gap-4 md:grid-cols-2">
              <CapabilityGroup label="Organize" items={organize} />
              <CapabilityGroup label="Communicate" items={communicate} />
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 sm:p-5">
              <p className="mb-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-white/45">
                <span className="h-px w-4 bg-white/25" />
                Ship
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {ship.map((item) => (
                  <ShipTile key={item.title} {...item} />
                ))}
              </div>
            </div>
          </div>
        </LandingGlassPanel>
      </div>
    </section>
  );
}
