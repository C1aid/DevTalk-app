import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

const footerLinks = {
  Product: [
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/#pricing" },
  ],
  App: [
    { label: "Sign in", href: "/login" },
    { label: "Sign up", href: "/signup" },
    { label: "Channels", href: "/channels" },
  ],
  Legal: [
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Privacy Policy", href: "/privacy-policy" },
  ],
};

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-2 gap-8 sm:gap-12 md:grid-cols-4">
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 font-semibold">
              <BrandLogo size="sm" />
              DevTalk
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Collaborative team chat for developers with channels, threads, and
              GitHub previews.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="mb-4 text-sm font-medium text-foreground/80">{title}</h3>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} DevTalk. All rights reserved.</p>
          <p>Built with Next.js, Supabase & Stripe</p>
        </div>
      </div>
    </footer>
  );
}
