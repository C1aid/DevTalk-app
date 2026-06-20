import { ContentPageLayout } from "@/components/marketing/content-page-layout";

export const metadata = {
  title: "Acceptable use – DevTalk",
  description: "Acceptable use policy for DevTalk workspaces and messaging.",
};

export default function AcceptableUsePage() {
  return (
    <ContentPageLayout
      category="Legal"
      title="Acceptable use policy"
      lastUpdated="June 12, 2026"
    >
      <p>
        DevTalk workspaces must be used lawfully and respectfully. This policy
        applies to all users, content, and attachments sent through the
        service.
      </p>

      <h2>Prohibited content</h2>
      <ul>
        <li>Malware, phishing, or attempts to compromise other accounts</li>
        <li>Harassment, hate speech, or threats of violence</li>
        <li>Spam, unsolicited bulk messaging, or automated abuse</li>
        <li>Content that violates intellectual property or privacy rights</li>
      </ul>

      <h2>Workspace responsibilities</h2>
      <p>
        Workspace owners are responsible for membership and channel access.
        Report abuse to{" "}
        <a href="mailto:abuse@devtalk.app">abuse@devtalk.app</a>. We may
        suspend accounts that violate this policy or our Terms of Service.
      </p>

      <h2>Enforcement</h2>
      <p>
        We reserve the right to remove content, restrict features, or terminate
        access when this policy is violated. Serious or repeated violations may
        result in permanent account closure without refund.
      </p>
    </ContentPageLayout>
  );
}
