import { ContentPageLayout } from "@/components/marketing/content-page-layout";

export const metadata = {
  title: "Changelog – DevTalk",
  description: "Product updates and release notes for DevTalk.",
};

const releases = [
  {
    version: "1.4.0",
    date: "June 12, 2026",
    title: "File attachments & landing polish",
    items: [
      "Upload and share files in channel messages",
      "Emoji picker and code formatting in the message composer",
      "Workspace-scoped attachment storage with channel-level access",
      "Updated product documentation and security pages",
    ],
  },
  {
    version: "1.3.0",
    date: "June 2026",
    title: "Workspaces & channel hierarchy",
    items: [
      "Multi-workspace support with switcher and create flow",
      "Channel sections for organizing large teams",
      "DM sidebar and workspace-scoped routing",
      "Leave and delete flows for channels and workspaces",
    ],
  },
  {
    version: "1.2.0",
    date: "May 2026",
    title: "Threads, reactions & GitHub previews",
    items: [
      "Reply in thread with summary bar and deep links",
      "Emoji reactions on messages",
      "Rich unfurls for GitHub pull requests, issues, and commits",
      "Markdown and syntax-highlighted code blocks",
    ],
  },
  {
    version: "1.0.0",
    date: "April 2026",
    title: "DevTalk launch",
    items: [
      "Real-time team chat with Supabase Realtime",
      "Free and Pro plans with Stripe billing",
      "Public and private channels",
      "Profile avatars and account settings",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <ContentPageLayout
      category="Product"
      title="Changelog"
      description="New features, improvements, and fixes shipped to DevTalk."
      lastUpdated="June 12, 2026"
    >
      {releases.map((release) => (
        <div key={release.version}>
          <h2>
            v{release.version}{" "}
            <span className="text-base font-normal text-muted-foreground">
              — {release.date}
            </span>
          </h2>
          <p>
            <strong>{release.title}</strong>
          </p>
          <ul>
            {release.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </ContentPageLayout>
  );
}
