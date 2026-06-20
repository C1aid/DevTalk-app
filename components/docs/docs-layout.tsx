import Link from "next/link";
import { Reveal } from "@/components/landing/motion";
import { DOC_PAGES } from "@/lib/docs/content";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import {
  MarketingPageHeader,
  MarketingPagePanel,
  MarketingPageShell,
  MarketingProse,
} from "@/components/marketing/marketing-page-shell";
import { cn } from "@/lib/utils";

export function DocsLayout({
  title,
  description,
  lastUpdated,
  slug,
  children,
}: {
  title: string;
  description: string;
  lastUpdated: string;
  slug?: string;
  children: React.ReactNode;
}) {
  return (
    <MarketingPageShell>
      <SiteHeader overlapHero />

      <main className="container mx-auto px-4 pb-20 pt-28 md:px-6 md:pt-32 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 lg:flex-row lg:gap-12">
          <aside className="lg:w-60 lg:shrink-0">
            <Reveal y={20}>
              <div className="liquid-glass rounded-2xl p-4 lg:sticky lg:top-28">
                <p className="px-3 text-xs font-medium uppercase tracking-widest text-primary">
                  Documentation
                </p>
                <nav className="mt-3 space-y-0.5">
                  <Link
                    href="/docs"
                    className={cn(
                      "block rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-white/[0.06]",
                      !slug ? "bg-white/[0.08] text-white" : "text-muted-foreground",
                    )}
                  >
                    Overview
                  </Link>
                  {DOC_PAGES.map((page) => (
                    <Link
                      key={page.slug}
                      href={`/docs/${page.slug}`}
                      className={cn(
                        "block rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-white/[0.06]",
                        slug === page.slug
                          ? "bg-white/[0.08] text-white"
                          : "text-muted-foreground",
                      )}
                    >
                      {page.title}
                    </Link>
                  ))}
                </nav>
              </div>
            </Reveal>
          </aside>

          <div className="min-w-0 flex-1">
            <MarketingPageHeader
              category="Documentation"
              title={title}
              description={description}
              lastUpdated={lastUpdated}
            />

            <MarketingPagePanel delay={120}>
              <MarketingProse>{children}</MarketingProse>
            </MarketingPagePanel>
          </div>
        </div>
      </main>

      <SiteFooter />
    </MarketingPageShell>
  );
}
