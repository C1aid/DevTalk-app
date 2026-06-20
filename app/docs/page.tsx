import Link from "next/link";
import { DocsLayout } from "@/components/docs/docs-layout";
import { DOC_PAGES } from "@/lib/docs/content";

export const metadata = {
  title: "Documentation – DevTalk",
  description: "Product documentation for DevTalk team chat.",
};

const quickStart = [
  {
    title: "Getting started",
    href: "/docs/getting-started",
    description: "Create an account, set up a workspace, and send your first message.",
  },
  {
    title: "Workspaces",
    href: "/docs/workspaces",
    description: "Create, switch, and manage workspaces and membership.",
  },
  {
    title: "Channels & DMs",
    href: "/docs/channels-and-dms",
    description: "Channels, threads, reactions, formatting, and GitHub previews.",
  },
  {
    title: "Billing & plans",
    href: "/docs/billing",
    description: "Free vs Pro, limits, upgrades, and subscription management.",
  },
];

export default function DocsIndexPage() {
  return (
    <DocsLayout
      title="DevTalk documentation"
      description="Guides for workspaces, channels, billing, security, and the DevTalk API."
      lastUpdated="June 12, 2026"
    >
      <p>
        DevTalk is a team chat workspace for developers. This documentation
        covers everything from your first login to API integration, billing,
        and data processing. All guides are written for end users and workspace
        administrators — no developer setup required unless noted.
      </p>

      <h2>Quick start</h2>
      <ul>
        {quickStart.map(({ title, href, description }) => (
          <li key={href}>
            <Link href={href}>{title}</Link> — {description}
          </li>
        ))}
      </ul>

      <h2>All guides</h2>
      <ul>
        {DOC_PAGES.map((page) => (
          <li key={page.slug}>
            <Link href={`/docs/${page.slug}`}>{page.title}</Link> —{" "}
            {page.description}
          </li>
        ))}
      </ul>

      <h2>Need help?</h2>
      <p>
        Check the <Link href="/#faq">FAQ</Link> on the landing page, visit{" "}
        <Link href="/contact">Contact & support</Link>, or email{" "}
        <a href="mailto:support@devtalk.app">support@devtalk.app</a>.
      </p>
    </DocsLayout>
  );
}
