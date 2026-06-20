import { Reveal } from "@/components/landing/motion";
import { cn } from "@/lib/utils";

export function LandingGlassPanel({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <Reveal y={28} delay={delay} className={cn("mx-auto max-w-5xl", className)}>
      <div className="relative overflow-hidden rounded-2xl">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 top-1/2 size-64 -translate-y-1/2 rounded-full bg-primary/12 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-8 size-52 rounded-full bg-sky-500/10 blur-3xl"
        />
        <div className="liquid-glass relative rounded-2xl">{children}</div>
      </div>
    </Reveal>
  );
}
