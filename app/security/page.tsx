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
      description="How we protect accounts, workspace data, messages, attachments, and billing information."
      lastUpdated="June 12, 2026"
    >
      <p>
        DevTalk is built for engineering teams that expect strong security
        defaults. Authentication, authorization, and data isolation are enforced
        at both the application and database layers — not just in the UI.
      </p>

      <h2>Architecture overview</h2>
      <p>
        The web application runs on Vercel. User authentication, the
        PostgreSQL database, file storage, and realtime subscriptions are
        provided by Supabase. Subscription billing is handled by Stripe.
        DevTalk never stores credit card numbers.
      </p>
      <p>
        All tenant-scoped tables use PostgreSQL row-level security (RLS).
        API routes perform an additional membership check before returning
        channels, messages, or attachments.
      </p>

      <h2>Authentication</h2>
      <ul>
        <li>Email/password registration with email verification</li>
        <li>Session cookies managed via Supabase SSR (HTTP-only, server-side)</li>
        <li>Password reset through single-use, time-limited email links</li>
        <li>Optional Google OAuth where configured</li>
        <li>Session invalidation when passwords are changed</li>
      </ul>

      <h2>Authorization</h2>
      <p>
        Access is scoped at two levels: workspace membership and channel
        membership. Public channels require workspace membership. Private
        channels and DMs require an explicit channel_members record.
      </p>
      <ul>
        <li>
          Messages and attachments are only returned to authenticated channel
          members
        </li>
        <li>
          Workspace operations (create, delete, leave) verify ownership or
          membership
        </li>
        <li>
          Storage bucket policies mirror channel access — uploads and downloads
          require channel membership
        </li>
        <li>
          Profile data is readable by workspace members but writable only by
          the account owner
        </li>
      </ul>

      <h2>Data in transit and at rest</h2>
      <ul>
        <li>All client-server communication over HTTPS (TLS 1.2+)</li>
        <li>Database connections encrypted via Supabase</li>
        <li>File attachments stored in Supabase Storage with access policies</li>
        <li>
          Stripe Checkout for payments — PCI DSS scope handled entirely by
          Stripe
        </li>
      </ul>

      <h2>Attachment security</h2>
      <p>
        File uploads are validated server-side before reaching storage. Checks
        include: authenticated session, channel membership, file size (max 50
        MB), filename sanitization, and mime type recording. Direct storage
        URLs without a valid session are rejected by bucket policies.
      </p>

      <h2>Operational practices</h2>
      <ul>
        <li>TypeScript strict mode with type-checking in CI</li>
        <li>Automated lint and test gates before deployment</li>
        <li>Environment secrets stored outside the repository</li>
        <li>Dependency management via npm with version pinning</li>
        <li>No production credentials in source code or git history</li>
      </ul>

      <h2>What we do not do</h2>
      <ul>
        <li>We do not use message content to train AI models</li>
        <li>We do not sell personal or workspace data to third parties</li>
        <li>We do not serve advertising based on message content</li>
        <li>We do not provide third-party API access without authentication</li>
      </ul>

      <h2>Report a vulnerability</h2>
      <p>
        If you discover a security vulnerability, email{" "}
        <a href="mailto:security@devtalk.app">security@devtalk.app</a> with:
      </p>
      <ul>
        <li>A description of the issue and its potential impact</li>
        <li>Steps to reproduce (proof of concept if available)</li>
        <li>Affected URLs or API endpoints</li>
        <li>Your contact information for follow-up</li>
      </ul>
      <p>
        Do not disclose the vulnerability publicly until we confirm a fix. We
        aim to acknowledge valid reports within two business days.
      </p>

      <p>
        For sub-processors, retention schedules, and data subject rights, see
        the{" "}
        <Link href="/docs/data-processing">data processing documentation</Link>.
      </p>
    </ContentPageLayout>
  );
}
