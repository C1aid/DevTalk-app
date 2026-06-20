import Link from "next/link";
import { Reveal } from "@/components/landing/motion";
import { cn } from "@/lib/utils";

export function MarketingPageBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden"
    >
      <div className="absolute -left-24 top-20 size-[28rem] rounded-full bg-primary/12 blur-3xl" />
      <div className="absolute -right-24 top-1/3 size-80 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="absolute bottom-0 left-1/2 size-[36rem] -translate-x-1/2 translate-y-1/3 rounded-full bg-white/[0.04] blur-3xl" />
    </div>
  );
}

export function MarketingPageShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <MarketingPageBackground />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function MarketingPageHeader({
  category,
  title,
  description,
  lastUpdated,
}: {
  category: string;
  title: string;
  description?: string;
  lastUpdated?: string;
}) {
  return (
    <Reveal y={24}>
      <header className="mb-8 sm:mb-10">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          {category}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </p>
        ) : null}
        {lastUpdated ? (
          <p className="mt-3 text-xs text-muted-foreground">
            Last updated {lastUpdated}
          </p>
        ) : null}
      </header>
    </Reveal>
  );
}

export function MarketingPagePanel({
  children,
  className,
  delay = 80,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <Reveal y={32} delay={delay}>
      <div className={cn("relative overflow-hidden rounded-2xl", className)}>
        <div
          aria-hidden
          className="pointer-events-none absolute -left-16 -top-16 size-56 rounded-full bg-primary/15 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 -right-16 size-56 rounded-full bg-sky-500/10 blur-3xl"
        />
        <div className="liquid-glass relative rounded-2xl px-6 py-10 sm:px-10 sm:py-12">
          {children}
        </div>
      </div>
    </Reveal>
  );
}

export function MarketingProse({ children }: { children: React.ReactNode }) {
  return (
    <article className="marketing-prose prose prose-invert mt-2 max-w-none prose-headings:scroll-mt-28 prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
      {children}
    </article>
  );
}

export function MarketingPageFooterLinks({
  links,
}: {
  links: { label: string; href: string }[];
}) {
  return (
    <div className="mt-12 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 pt-8 text-sm text-muted-foreground">
      {links.map(({ label, href }) => (
        <Link
          key={href}
          href={href}
          className="transition-colors hover:text-foreground"
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
