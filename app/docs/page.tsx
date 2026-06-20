import Link from "next/link";
import { DocsLayout } from "@/components/docs/docs-layout";
import { DOC_PAGES } from "@/lib/docs/content";

export const metadata = {
  title: "Documentation – DevTalk",
  description: "Product documentation for DevTalk team chat.",
};

export default function DocsIndexPage() {
  return (
    <DocsLayout
      title="DevTalk documentation"
      description="Guides for workspaces, channels, billing, security, and the DevTalk API."
      lastUpdated="June 12, 2026"
    >
      <p>
        Everything you need to onboard your team, organize workspaces, and get
        the most out of DevTalk.
      </p>

      <h2>Popular guides</h2>
      <ul>
        {DOC_PAGES.slice(0, 4).map((page) => (
          <li key={page.slug}>
            <Link href={`/docs/${page.slug}`}>{page.title}</Link> —{" "}
            {page.description}
          </li>
        ))}
      </ul>

      <h2>All articles</h2>
      <ul>
        {DOC_PAGES.map((page) => (
          <li key={page.slug}>
            <Link href={`/docs/${page.slug}`}>{page.title}</Link>
          </li>
        ))}
      </ul>
    </DocsLayout>
  );
}
