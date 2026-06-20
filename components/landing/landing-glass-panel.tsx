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
    <Reveal y={28} delay={delay} className={cn("mx-auto w-full max-w-5xl", className)}>
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-16 top-1/2 size-48 -translate-y-1/2 rounded-full bg-primary/12 blur-3xl sm:-left-20 sm:size-64"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-12 -top-6 size-40 rounded-full bg-sky-500/10 blur-3xl sm:-right-16 sm:-top-8 sm:size-52"
        />
        <div className="liquid-glass relative rounded-xl sm:rounded-2xl">{children}</div>
      </div>
    </Reveal>
  );
}
