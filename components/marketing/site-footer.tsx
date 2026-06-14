import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

const footerLinks = {
  Product: [
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Quickstart", href: "/#quickstart" },
  ],
  App: [
    { label: "Sign in", href: "/login" },
    { label: "Sign up", href: "/signup" },
    { label: "Notes", href: "/notes" },
  ],
  Legal: [
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Privacy Policy", href: "/privacy-policy" },
  ],
};

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 font-semibold">
              <BrandLogo size="sm" />
              NoteFlow
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Collaborative notes with real-time editing, secure auth, and simple
              subscription plans.
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
          <p>© {new Date().getFullYear()} NoteFlow. All rights reserved.</p>
          <p>Built with Next.js, Supabase & Stripe</p>
        </div>
      </div>
    </footer>
  );
}
