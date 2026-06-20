import Link from "next/link";
import { ContentPageLayout } from "@/components/marketing/content-page-layout";

export const metadata = {
  title: "Security – DevTalk",
  description: "Security overview, data protection, and vulnerability reporting for DevTalk.",
};

export default function SecurityPage() {
  return (
    <ContentPageLayout
      category="Trust & security"
      title="Security at DevTalk"
      description="How we protect your workspace, messages, and billing data."
      lastUpdated="June 12, 2026"
    >
      <p>
        DevTalk is designed for engineering teams that expect strong defaults:
        authenticated APIs, tenant isolation, and encrypted transport end to
        end.
      </p>

      <h2>Platform security</h2>
      <ul>
        <li>Row-level security on all workspace-scoped database tables</li>
        <li>Session-based API authentication via Supabase Auth</li>
        <li>Channel membership checks before message and attachment access</li>
        <li>Stripe-hosted checkout — card data never touches our servers</li>
      </ul>

      <h2>Operational practices</h2>
      <ul>
        <li>Dependency and type-check gates in CI before deploy</li>
        <li>Environment secrets stored outside the repository</li>
        <li>Attachment uploads validated server-side for size and channel access</li>
      </ul>

      <h2>Report a vulnerability</h2>
      <p>
        Email{" "}
        <a href="mailto:security@devtalk.app">security@devtalk.app</a> with
        steps to reproduce. We acknowledge valid reports within two business
        days and coordinate disclosure timelines with researchers.
      </p>

      <p>
        For a full breakdown of sub-processors and retention, see the{" "}
        <Link href="/docs/data-processing">data processing guide</Link>.
      </p>
    </ContentPageLayout>
  );
}
