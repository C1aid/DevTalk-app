import type { LucideIcon } from "lucide-react";
import {
  Code2,
  GitBranch,
  Hash,
  MessageSquare,
  Zap,
} from "lucide-react";
import { Reveal, RevealText } from "@/components/landing/motion";

const features: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
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

export function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-24 py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Features
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            <RevealText
              as="span"
              text="Chat built for developers"
              wordDelay={80}
            />
          </h2>
          <p className="mt-4 text-muted-foreground">
            Channels, threads, code blocks, and GitHub previews — without the
            noise.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }, index) => (
            <Reveal key={title} delay={index * 90} y={24}>
              <div className="glass-card group h-full p-5 sm:p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
