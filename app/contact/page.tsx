import Link from "next/link";
import { ContentPageLayout } from "@/components/marketing/content-page-layout";

export const metadata = {
  title: "Contact & support – DevTalk",
  description: "Get help with DevTalk workspaces, billing, and account issues.",
};

export default function ContactPage() {
  return (
    <ContentPageLayout
      category="Support"
      title="Contact & support"
      description="Help with onboarding, billing, account access, and technical questions."
    >
      <p>
        Most questions are answered in the documentation or FAQ. If you cannot
        find what you need, contact us directly using the channels below.
      </p>

      <h2 id="support">Customer support</h2>
      <p>
        Email{" "}
        <a href="mailto:support@devtalk.app">support@devtalk.app</a> for help
        with:
      </p>
      <ul>
        <li>Account access, password reset, and email verification</li>
        <li>Workspace setup, channel permissions, and membership</li>
        <li>File attachment issues and message delivery</li>
        <li>Billing questions and subscription changes</li>
        <li>Bug reports with steps to reproduce</li>
      </ul>
      <p>
        <strong>Free plan:</strong> responses within 2–3 business days.
        <br />
        <strong>Pro plan:</strong> priority support — typically within one
        business day.
      </p>

      <h2>Sales & partnerships</h2>
      <p>
        For Business plan inquiries (SSO, SCIM, volume licensing), partnership
        discussions, or custom agreements, email{" "}
        <a href="mailto:hello@devtalk.app">hello@devtalk.app</a>.
      </p>

      <h2>Security reports</h2>
      <p>
        Do not send vulnerability details to support@devtalk.app. Use{" "}
        <a href="mailto:security@devtalk.app">security@devtalk.app</a> or read
        our <Link href="/security">security page</Link> for responsible
        disclosure guidelines.
      </p>

      <h2>Abuse reports</h2>
      <p>
        To report spam, harassment, or content that violates our{" "}
        <Link href="/acceptable-use">Acceptable use policy</Link>, email{" "}
        <a href="mailto:abuse@devtalk.app">abuse@devtalk.app</a> with the
        workspace name, channel, and a description of the issue.
      </p>

      <h2>Self-service resources</h2>
      <ul>
        <li>
          <Link href="/docs">Documentation</Link> — guides for workspaces,
          channels, billing, security, and API
        </li>
        <li>
          <Link href="/#faq">FAQ</Link> — common questions about plans, limits,
          and features
        </li>
        <li>
          <Link href="/changelog">Changelog</Link> — recent product updates
        </li>
        <li>
          <Link href="/status">System status</Link> — current service health
        </li>
        <li>
          <Link href="/docs/billing">Billing guide</Link> — plan details and
          subscription management
        </li>
      </ul>

      <h2>Before you write</h2>
      <p>
        Include your account email, workspace name, and steps to reproduce the
        issue. Screenshots and browser console errors help us resolve problems
        faster.
      </p>
    </ContentPageLayout>
  );
}
