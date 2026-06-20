import Link from "next/link";
import { ContentPageLayout } from "@/components/marketing/content-page-layout";

export const metadata = {
  title: "About – DevTalk",
  description: "What DevTalk is, who it is built for, and how it differs from other chat tools.",
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
        We focus on the workflows developers actually use every day — channels
        organized by project, threads for focused discussion, Markdown and code
        blocks, GitHub link previews, and file sharing — without AI upsells,
        bot marketplaces, or enterprise complexity you do not need yet.
      </p>

      <h2>The problem we solve</h2>
      <p>
        Most team chat tools either overshoot (enterprise suites with SSO, SCIM,
        and compliance overhead) or undershoot (basic messaging without code
        awareness). DevTalk sits in the middle: real-time chat with
        developer-native features, a generous free tier, and a single Pro
        upgrade when your team outgrows 10 channels or 90 days of history.
      </p>

      <h2>What DevTalk includes</h2>
      <ul>
        <li>Workspaces with channel sections, public/private channels, and DMs</li>
        <li>Real-time messaging via Supabase Realtime</li>
        <li>Threads, emoji reactions, and @mentions</li>
        <li>Markdown, syntax-highlighted code blocks, and inline code</li>
        <li>GitHub PR, issue, and commit link previews</li>
        <li>File attachments up to 50 MB (10 per message)</li>
        <li>Free and Pro plans with Stripe billing</li>
      </ul>

      <h2>What we deliberately exclude</h2>
      <ul>
        <li>AI summaries, assistant bots, or paid AI add-ons</li>
        <li>Complex per-seat enterprise pricing</li>
        <li>Feature gates on basic messaging functionality</li>
      </ul>

      <h2>Who uses DevTalk</h2>
      <p>
        Startup engineering squads, open-source maintainers, and product teams
        that outgrew group DMs but do not need a full enterprise suite. If your
        team ships code and coordinates in channels, DevTalk is built for you.
      </p>

      <h2>Pricing philosophy</h2>
      <p>
        The Free plan is genuinely usable — 10 channels, 90 days of history,
        and all messaging features. Pro ($8/month) removes limits when you
        need them. No credit card required to start. No surprise charges.
      </p>

      <p>
        Ready to try it?{" "}
        <Link href="/signup">Create a free workspace</Link> or read the{" "}
        <Link href="/docs/getting-started">getting started guide</Link>.
      </p>
    </ContentPageLayout>
  );
}
