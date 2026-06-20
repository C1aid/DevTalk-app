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
      description="We're here to help with onboarding, billing, and technical questions."
    >
      <h2 id="support">Customer support</h2>
      <p>
        Free plan users can reach us at{" "}
        <a href="mailto:support@devtalk.app">support@devtalk.app</a>. Pro
        subscribers receive priority responses — typically within one business
        day.
      </p>

      <h2>Sales & partnerships</h2>
      <p>
        For Business plan inquiries, volume licensing, or partnership
        discussions, email{" "}
        <a href="mailto:hello@devtalk.app">hello@devtalk.app</a>.
      </p>

      <h2>Security reports</h2>
      <p>
        Do not send vulnerability details to support. Use{" "}
        <a href="mailto:security@devtalk.app">security@devtalk.app</a> or read
        our <Link href="/security">security page</Link>.
      </p>

      <h2>Self-service resources</h2>
      <ul>
        <li>
          <Link href="/docs">Documentation</Link>
        </li>
        <li>
          <Link href="/#faq">Frequently asked questions</Link>
        </li>
        <li>
          <Link href="/changelog">Changelog</Link>
        </li>
        <li>
          <Link href="/status">System status</Link>
        </li>
      </ul>
    </ContentPageLayout>
  );
}
