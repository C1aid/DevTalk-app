import Link from "next/link";
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
        This policy defines permitted and prohibited use of DevTalk workspaces,
        messages, attachments, and related services. It applies to all users
        regardless of plan. Violations may result in content removal, account
        suspension, or permanent termination.
      </p>

      <h2>Permitted use</h2>
      <p>
        DevTalk is intended for lawful team communication in professional,
        educational, and open-source contexts. You may use the service to
        coordinate work, share code and files, discuss projects, and collaborate
        with teammates.
      </p>

      <h2>Prohibited content</h2>
      <p>You may not post, upload, or share content that:</p>
      <ul>
        <li>
          Contains malware, viruses, or code designed to compromise systems or
          accounts
        </li>
        <li>
          Facilitates phishing, credential theft, or social engineering attacks
        </li>
        <li>
          Constitutes harassment, bullying, hate speech, or threats of violence
        </li>
        <li>
          Is sexually exploitative or involves minors in any context
        </li>
        <li>
          Infringes intellectual property, privacy, or publicity rights of
          others
        </li>
        <li>
          Violates applicable local, national, or international law
        </li>
      </ul>

      <h2>Prohibited behavior</h2>
      <ul>
        <li>
          Sending unsolicited bulk messages (spam) or using automated tools to
          scrape or flood the service
        </li>
        <li>
          Attempting to access workspaces, channels, or accounts you are not
          authorized to use
        </li>
        <li>
          Reverse engineering, probing, or stress-testing the service without
          written permission
        </li>
        <li>
          Reselling or sublicensing access to DevTalk without authorization
        </li>
        <li>
          Using the service to mine cryptocurrency or run unrelated compute
          workloads
        </li>
        <li>
          Circumventing plan limits (channel count, history retention) through
          technical exploits
        </li>
      </ul>

      <h2>Workspace owner responsibilities</h2>
      <p>
        Workspace owners and administrators are responsible for managing
        membership and channel access within their workspace. If a member
        violates this policy, the workspace owner should remove them and report
        the incident if necessary.
      </p>
      <p>
        DevTalk may take action at the workspace level if violations are
        severe or repeated, including suspending the entire workspace.
      </p>

      <h2>File attachments</h2>
      <p>
        Attachments are subject to the same rules as message content. Do not
        upload files containing malware, illegally obtained data, or content
        that violates this policy. Maximum file size is 50 MB per file.
      </p>

      <h2>Reporting violations</h2>
      <p>
        Report abuse to{" "}
        <a href="mailto:abuse@devtalk.app">abuse@devtalk.app</a>. Include the
        workspace name, channel or DM context, offending content description,
        and screenshots if available. We review reports and respond according
        to severity.
      </p>

      <h2>Enforcement</h2>
      <p>Depending on the severity and history of violations, we may:</p>
      <ul>
        <li>Remove specific content or attachments</li>
        <li>Restrict messaging or upload capabilities</li>
        <li>Suspend individual accounts or entire workspaces</li>
        <li>Permanently terminate accounts without refund</li>
        <li>Report illegal activity to law enforcement where required</li>
      </ul>
      <p>
        We reserve the right to update this policy. Continued use of DevTalk
        after changes constitutes acceptance. See also our{" "}
        <Link href="/terms-of-service">Terms of Service</Link> and{" "}
        <Link href="/privacy-policy">Privacy Policy</Link>.
      </p>
    </ContentPageLayout>
  );
}
