import Link from "next/link";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";

export function LegalLayout({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader overlapHero />

      <main className="container mx-auto px-4 pb-20 pt-28 md:pt-32">
        <div className="glass-card mx-auto max-w-3xl px-6 py-12 sm:px-10">
          <p className="text-sm text-muted-foreground">Page</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">{title}</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Last updated on {lastUpdated}
          </p>

          <article className="prose prose-invert mt-10 max-w-none prose-headings:scroll-mt-28 prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
            {children}
          </article>

          <div className="mt-12 flex flex-wrap justify-center gap-4 border-t border-border pt-8 text-sm text-muted-foreground">
            <Link href="/terms-of-service" className="hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="/privacy-policy" className="hover:text-foreground">
              Privacy Policy
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
