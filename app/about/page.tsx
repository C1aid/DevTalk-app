import Link from "next/link";
import { ContentPageLayout } from "@/components/marketing/content-page-layout";

export const metadata = {
  title: "About – DevTalk",
  description: "What DevTalk is and who it is built for.",
};

export default function AboutPage() {
  return (
    <ContentPageLayout
      category="Company"
      title="About DevTalk"
      description="Team chat for developers who want clarity, not clutter."
    >
      <p>
        DevTalk is a collaborative messaging product built for software teams.
        We focus on the workflows developers actually use — channels organized
        by project, threads for focused discussion, code blocks, GitHub
        previews, and file sharing — without AI upsells or feature bloat.
      </p>

      <h2>What we believe</h2>
      <ul>
        <li>Chat should be fast, reliable, and out of the way</li>
        <li>Pricing should be predictable with a generous free tier</li>
        <li>Your message history belongs to your team, not an algorithm</li>
      </ul>

      <h2>Who uses DevTalk</h2>
      <p>
        Startup engineering squads, open-source maintainers, and product teams
        that outgrew DMs but do not need an enterprise suite. If you ship code
        and coordinate in channels, DevTalk is built for you.
      </p>

      <p>
        Ready to try it?{" "}
        <Link href="/signup">Create a free workspace</Link> or read the{" "}
        <Link href="/docs/getting-started">getting started guide</Link>.
      </p>
    </ContentPageLayout>
  );
}
