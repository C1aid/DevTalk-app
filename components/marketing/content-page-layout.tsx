import Link from "next/link";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import {
  MarketingPageFooterLinks,
  MarketingPageHeader,
  MarketingPagePanel,
  MarketingPageShell,
  MarketingProse,
} from "@/components/marketing/marketing-page-shell";

const defaultFooterLinks = [
  { label: "Documentation", href: "/docs" },
  { label: "Contact", href: "/contact" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Privacy Policy", href: "/privacy-policy" },
];

export function ContentPageLayout({
  category,
  title,
  description,
  lastUpdated,
  children,
}: {
  category: string;
  title: string;
  description?: string;
  lastUpdated?: string;
  children: React.ReactNode;
}) {
  return (
    <MarketingPageShell>
      <SiteHeader overlapHero />

      <main className="container mx-auto px-4 pb-20 pt-28 md:px-6 md:pt-32 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <MarketingPageHeader
            category={category}
            title={title}
            description={description}
            lastUpdated={lastUpdated}
          />

          <MarketingPagePanel delay={100}>
            <MarketingProse>{children}</MarketingProse>
            <MarketingPageFooterLinks links={defaultFooterLinks} />
          </MarketingPagePanel>
        </div>
      </main>

      <SiteFooter />
    </MarketingPageShell>
  );
}
