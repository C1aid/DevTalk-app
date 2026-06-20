export type DocSection = {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type DocPage = {
  slug: string;
  title: string;
  description: string;
  lastUpdated: string;
  sections: DocSection[];
};

export const DOC_PAGES: DocPage[] = [
  {
    slug: "getting-started",
    title: "Getting started",
    description:
      "Create your account, set up a workspace, and send your first message.",
    lastUpdated: "June 12, 2026",
    sections: [
      {
        paragraphs: [
          "DevTalk is a team chat workspace built for developers. Each workspace contains channels, direct messages, and message history scoped to your team. This guide walks you through account setup, your first channel, and the core features you will use daily.",
        ],
      },
      {
        heading: "Before you begin",
        bullets: [
          "A valid email address for account verification",
          "A modern browser (Chrome, Firefox, Safari, or Edge)",
          "Optional: a GitHub account if your team shares PR and issue links",
        ],
      },
      {
        heading: "1. Create your account",
        paragraphs: [
          "Go to Sign up and register with your email and password. After confirming your email, you are redirected to the app and a profile is created automatically.",
          "Open Settings to set your display name and upload an avatar. Your display name appears next to every message you send. Avatars are stored in Supabase Storage and can be changed at any time.",
        ],
      },
      {
        heading: "2. Understand your workspace",
        paragraphs: [
          "On first login you are placed in a default workspace. A workspace is the top-level container for your team — all channels, DMs, and files belong to one workspace at a time.",
          "Use the workspace switcher in the left sidebar to move between workspaces you belong to. You can create additional workspaces from the switcher menu if you manage multiple teams or projects.",
        ],
      },
      {
        heading: "3. Send your first message",
        paragraphs: [
          "Select a channel from the sidebar (for example #general) and type in the message composer at the bottom. Press Enter to send, or Shift+Enter for a new line.",
          "The composer supports Markdown, inline code, code blocks, emoji, @mentions, and file attachments. Paste a GitHub pull request, issue, or commit URL to see a rich preview inline.",
        ],
      },
      {
        heading: "4. Organize conversations",
        bullets: [
          "Create channels per project, team, or topic — public (visible to all workspace members) or private (invite-only)",
          "Group channels into sections in the sidebar (e.g. Engineering, Design, Ops)",
          "Start a DM from the DMs view in the icon rail for 1:1 conversations",
          "Reply in a thread to branch a discussion without cluttering the main channel timeline",
        ],
      },
      {
        heading: "5. Invite teammates",
        paragraphs: [
          "Share your workspace URL with teammates so they can sign up and join. New members immediately see public channels. To add someone to a private channel, invite them from the channel settings or member list.",
          "There is no separate invite link per channel — access is managed through workspace membership and channel visibility settings.",
        ],
      },
      {
        heading: "6. Choose a plan",
        paragraphs: [
          "The Free plan includes up to 10 channels and 90 days of message history — enough for small teams getting started. Upgrade to Pro ($8/month) when you need unlimited channels, unlimited history, and full-text search across your entire archive.",
          "Billing is handled through Stripe. Upgrade from Settings → Billing at any time. No credit card is required for the Free plan.",
        ],
      },
      {
        heading: "Next steps",
        bullets: [
          "Workspaces — learn how to create, switch, and leave workspaces",
          "Channels & DMs — public/private channels, threads, reactions, and formatting",
          "File attachments — upload limits and access rules",
          "Billing & plans — detailed plan comparison and subscription management",
        ],
      },
    ],
  },
  {
    slug: "workspaces",
    title: "Workspaces",
    description:
      "Create, switch, and manage workspaces and membership.",
    lastUpdated: "June 12, 2026",
    sections: [
      {
        paragraphs: [
          "A workspace is the root organizational unit in DevTalk. Every channel, DM, message, and file attachment belongs to exactly one workspace. Users can belong to multiple workspaces and switch between them without logging out.",
        ],
      },
      {
        heading: "Workspace structure",
        paragraphs: [
          "Inside a workspace you will find: channel sections and channels in the Home sidebar, direct messages in the DMs view, and workspace-scoped settings. Message history, search results, and file storage are all isolated per workspace.",
        ],
        bullets: [
          "Channels — persistent rooms for team conversations (public or private)",
          "DMs — private 1:1 conversations between two workspace members",
          "Sections — optional folders that group channels in the sidebar",
          "Members — users who have access to the workspace",
        ],
      },
      {
        heading: "Creating a workspace",
        paragraphs: [
          "Open the workspace switcher in the sidebar and select Create workspace. Enter a name and URL slug (used in routes like /w/your-slug/channels/...). You become the owner of the new workspace.",
          "A default channel is created automatically so you can start messaging immediately.",
        ],
      },
      {
        heading: "Switching workspaces",
        paragraphs: [
          "Click the workspace name in the sidebar to open the switcher. Select any workspace you belong to. The app navigates to that workspace's default channel and reloads channels, DMs, and unread state for the new context.",
          "Your session persists across switches — you do not need to log in again.",
        ],
      },
      {
        heading: "Membership and access",
        paragraphs: [
          "Workspace membership grants access to public channels and the ability to receive DM invitations. Private channels require an explicit channel membership record — being in the workspace alone is not enough.",
          "Row-level security in the database enforces these rules: API requests verify workspace and channel membership before returning messages or attachments.",
        ],
        bullets: [
          "Public channels — any workspace member can read and post",
          "Private channels — only invited members can read and post",
          "DMs — only the two participants can access the conversation",
        ],
      },
      {
        heading: "Leaving and deleting",
        paragraphs: [
          "Any member can leave a workspace from workspace settings. Leaving removes your access to all channels and DMs in that workspace. Your messages remain visible to other members.",
          "Workspace owners can delete a workspace. Deletion is permanent — all channels, messages, and attachments in that workspace are removed.",
        ],
      },
      {
        heading: "URL structure",
        paragraphs: [
          "Workspace-scoped routes follow the pattern /w/{slug}/channels/{id}. Legacy routes without a workspace slug redirect to the appropriate workspace context. DMs use /channels/{id}/chat for backward compatibility.",
        ],
      },
    ],
  },
  {
    slug: "channels-and-dms",
    title: "Channels & DMs",
    description:
      "Channels, direct messages, threads, reactions, formatting, and GitHub previews.",
    lastUpdated: "June 12, 2026",
    sections: [
      {
        paragraphs: [
          "Channels are persistent chat rooms scoped to a workspace. DMs are private conversations between two members. Both support the same messaging features: Markdown, code blocks, threads, reactions, attachments, and GitHub link previews.",
        ],
      },
      {
        heading: "Channel types",
        bullets: [
          "Public — listed in the sidebar for all workspace members; anyone can join and post",
          "Private — hidden from non-members; access requires an invitation from an existing member",
          "DM — a channel with kind=dm containing exactly two participants",
        ],
      },
      {
        heading: "Creating and managing channels",
        paragraphs: [
          "Create a channel from the sidebar (+ button) or from the workspace home. Choose a name, visibility (public or private), and optionally assign it to a section.",
          "Channel creators and members can rename channels, move them between sections, and delete channels they own. Members can leave a channel without leaving the workspace.",
          "On the Free plan, workspaces are limited to 10 channels (excluding DMs). Pro removes this limit.",
        ],
      },
      {
        heading: "Channel sections",
        paragraphs: [
          "Sections are folders in the sidebar that group related channels — for example Frontend, Backend, and Infrastructure. Create sections from the sidebar, drag or assign channels to them, and collapse sections to reduce clutter.",
          "Sections are a UI organization layer only. They do not affect permissions or message routing.",
        ],
      },
      {
        heading: "Direct messages",
        paragraphs: [
          "Open the DMs view from the icon rail to see your active direct conversations. Start a new DM by selecting a workspace member. DMs support every feature available in channels: threads, reactions, Markdown, code blocks, attachments, and GitHub previews.",
          "You can leave a DM conversation. The other participant retains access to the message history.",
        ],
      },
      {
        heading: "Threads",
        paragraphs: [
          "Hover over a message and select Reply in thread to start a threaded conversation. Thread replies appear in a side panel and do not clutter the main channel timeline.",
          "The channel shows a summary bar under the parent message with the reply count. Click it to open the thread. Thread URLs include a ?thread= query parameter for direct linking.",
        ],
      },
      {
        heading: "Reactions",
        paragraphs: [
          "Hover over any message and click the reaction button to add an emoji reaction. Reactions are stored per message and visible to all channel members. Click an existing reaction to toggle your own.",
        ],
      },
      {
        heading: "Message formatting",
        bullets: [
          "Markdown — bold, italic, lists, links, and headings render in messages",
          "Inline code — wrap text in backticks for `inline code`",
          "Code blocks — use triple backticks for fenced blocks with syntax highlighting",
          "Emoji — insert from the emoji picker in the composer",
          "@mentions — type @ followed by a member name to mention them",
        ],
      },
      {
        heading: "GitHub link previews",
        paragraphs: [
          "Paste a GitHub URL for a pull request, issue, or commit and DevTalk fetches a rich preview card via the GitHub API. Previews show the title, status, author, and repository context inline — no need to leave the chat.",
          "Previews require the link to be a public GitHub resource. Private repository previews depend on GitHub API access.",
        ],
      },
      {
        heading: "Real-time delivery",
        paragraphs: [
          "Messages appear instantly for all channel members via Supabase Realtime. You do not need to refresh the page. Edited messages show an edited label with the update timestamp.",
          "Date dividers separate messages by day. Timestamps appear on hover.",
        ],
      },
    ],
  },
  {
    slug: "file-attachments",
    title: "File attachments",
    description:
      "Upload, share, and access files in channel messages.",
    lastUpdated: "June 12, 2026",
    sections: [
      {
        paragraphs: [
          "DevTalk supports file attachments in channel and DM messages. Attach files from the paperclip button in the message composer. Images render inline; all other file types appear as downloadable cards showing the filename and size.",
        ],
      },
      {
        heading: "How uploads work",
        paragraphs: [
          "When you attach a file, the client uploads it to Supabase Storage via POST /api/attachments. The server validates your channel membership, file size, and filename before storing the file.",
          "After a successful upload, attachment metadata (id, name, path, size, mimeType) is included in the message payload when you send. The message can contain text, attachments, or both.",
        ],
      },
      {
        heading: "Limits",
        bullets: [
          "Maximum file size: 50 MB per file",
          "Maximum attachments per message: 10",
          "Maximum message text length: 10,000 characters (attachments can be sent without text)",
          "Filenames are sanitized server-side (special characters replaced, max 180 characters)",
        ],
      },
      {
        heading: "Supported file types",
        paragraphs: [
          "DevTalk accepts common file types including images (PNG, JPEG, GIF, WebP), documents (PDF, TXT, MD), archives (ZIP), and code files. The mime type is recorded with each attachment and used to decide whether to render inline (images) or as a download card.",
        ],
      },
      {
        heading: "Access control",
        paragraphs: [
          "Attachments inherit channel access rules. Only members of the channel where a file was posted can upload or download it. Storage policies enforce this at the Supabase Storage layer — direct URLs without a valid session are rejected.",
          "Attachments are stored in the attachments bucket with paths scoped to the channel context. Leaving a channel does not delete files you uploaded; they remain accessible to remaining members.",
        ],
      },
      {
        heading: "Deleting attachments",
        paragraphs: [
          "Deleting a message removes its attachment metadata from the channel timeline. The underlying storage object may be cleaned up according to workspace retention policies.",
        ],
      },
    ],
  },
  {
    slug: "billing",
    title: "Billing & plans",
    description:
      "Free and Pro plans, limits, upgrades, and subscription management.",
    lastUpdated: "June 12, 2026",
    sections: [
      {
        paragraphs: [
          "DevTalk offers two plans: Free for small teams getting started, and Pro for teams that need unlimited scale. Billing is per account, processed monthly through Stripe.",
        ],
      },
      {
        heading: "Free plan",
        paragraphs: [
          "The Free plan is available to every account at no cost. No credit card is required.",
        ],
        bullets: [
          "Up to 10 channels per workspace (DMs do not count toward this limit)",
          "90 days of message history — older messages are hidden from the UI and search",
          "Threads, emoji reactions, Markdown, and syntax-highlighted code blocks",
          "GitHub link previews for PRs, issues, and commits",
          "File attachments (up to 50 MB per file, 10 per message)",
          "Search within the 90-day message window",
        ],
      },
      {
        heading: "Pro plan — $8 / month",
        paragraphs: [
          "Pro removes the Free plan limits and adds priority support. Billing is monthly per account.",
        ],
        bullets: [
          "Unlimited channels per workspace",
          "Unlimited message history — no cutoff date",
          "Full-text search across your entire message archive",
          "Priority email support (response within one business day)",
        ],
      },
      {
        heading: "What happens to old messages on Free",
        paragraphs: [
          "Messages older than 90 days are not visible in channels, DMs, threads, or search results on the Free plan. The data is retained in storage — upgrading to Pro immediately restores access to your full history without data loss.",
        ],
      },
      {
        heading: "Upgrading to Pro",
        paragraphs: [
          "Go to Settings → Billing and click Upgrade. You are redirected to Stripe Checkout to enter payment details. After successful payment, a webhook updates your profile subscription_tier to pro and limits are lifted immediately.",
          "Stripe handles all card processing. DevTalk never stores card numbers on its servers.",
        ],
      },
      {
        heading: "Managing your subscription",
        bullets: [
          "Cancel anytime from Settings → Billing — access continues until the end of the current billing period",
          "After cancellation, your account reverts to Free plan limits at the next billing cycle",
          "Invoices and payment history are available through the Stripe customer portal",
          "Failed payments trigger a grace period before Pro features are suspended",
        ],
      },
      {
        heading: "Business plan",
        paragraphs: [
          "Enterprise features (SSO, SCIM, dedicated support) are listed on the pricing page as Contact sales. Email hello@devtalk.app for volume licensing or custom agreements.",
        ],
      },
    ],
  },
  {
    slug: "security",
    title: "Security practices",
    description:
      "Authentication, data isolation, storage access, and vulnerability reporting.",
    lastUpdated: "June 12, 2026",
    sections: [
      {
        paragraphs: [
          "DevTalk is built on Supabase (Auth, PostgreSQL, Storage, Realtime) with row-level security on every tenant-scoped table. All API routes verify session identity and membership before returning data.",
        ],
      },
      {
        heading: "Authentication",
        paragraphs: [
          "Users authenticate via Supabase Auth with email and password. Sessions are managed server-side with HTTP-only cookies through the Next.js Supabase SSR integration.",
        ],
        bullets: [
          "Email verification required on signup",
          "Password reset via time-limited single-use email links",
          "Optional Google OAuth where configured in Supabase",
          "Session invalidation on password change",
        ],
      },
      {
        heading: "Authorization and RLS",
        paragraphs: [
          "PostgreSQL row-level security policies enforce workspace and channel boundaries at the database layer. Even if an API route has a bug, the database rejects unauthorized reads and writes.",
          "Every API handler performs an additional membership check before querying data. Attachments and messages require channel membership; workspace operations require workspace membership.",
        ],
        bullets: [
          "Workspace members can access public channels in their workspace",
          "Private channel access requires a channel_members record",
          "DM access is limited to the two participants",
          "Profile data is scoped to the authenticated user",
        ],
      },
      {
        heading: "Storage security",
        paragraphs: [
          "File attachments and profile avatars are stored in Supabase Storage buckets with bucket-level policies. The attachments bucket allows read and upload only for authenticated users who are members of the target channel.",
          "Upload requests are validated server-side for file size (max 50 MB), filename sanitization, and channel membership before the file reaches storage.",
        ],
      },
      {
        heading: "Transport and infrastructure",
        bullets: [
          "All traffic served over HTTPS (TLS 1.2+)",
          "Application hosted on Vercel with environment secrets outside the repository",
          "Database and storage hosted by Supabase with encrypted connections",
          "Stripe Checkout for payment processing — PCI scope handled by Stripe",
        ],
      },
      {
        heading: "Development practices",
        bullets: [
          "TypeScript strict mode and type-checking in CI",
          "Automated lint and unit/e2e test gates before merge",
          "Dependencies pinned and audited via npm",
          "No secrets committed to the repository (.env files gitignored)",
        ],
      },
      {
        heading: "Reporting a vulnerability",
        paragraphs: [
          "If you discover a security issue, email security@devtalk.app with a description, steps to reproduce, and impact assessment. Do not disclose publicly until we confirm a fix.",
          "We aim to acknowledge valid reports within two business days and provide a timeline for remediation. We coordinate disclosure with researchers who follow responsible disclosure practices.",
        ],
      },
    ],
  },
  {
    slug: "api",
    title: "API reference",
    description:
      "Session-authenticated REST endpoints used by the DevTalk web client.",
    lastUpdated: "June 12, 2026",
    sections: [
      {
        paragraphs: [
          "DevTalk exposes a REST API consumed by the Next.js web application. All endpoints require a valid Supabase session cookie unless noted otherwise. Requests without authentication receive 401 Unauthorized.",
          "Base URL is your DevTalk deployment origin (e.g. https://devtalk.app). All paths below are relative to that origin.",
        ],
      },
      {
        heading: "Authentication",
        paragraphs: [
          "Authenticate by signing in through the web app. The Supabase session cookie is sent automatically with fetch requests from the client. Server-side routes call createClient() to read the session from cookies.",
          "There is no public API key or token-based auth for third-party integrations at this time.",
        ],
      },
      {
        heading: "Messages",
        paragraphs: [
          "GET /api/messages?channelId={uuid} — list messages for a channel. Optional query params: parentId (thread replies), q (search text). Respects plan history cutoff (90 days on Free). Returns 401 if unauthenticated, 400 if channelId missing.",
          "POST /api/messages — send a message. Body (JSON): channelId (required), content (string, max 10000), parentMessageId (optional, for threads), attachments (optional array, max 10). Message must include text or at least one attachment. Returns 201 with the created message.",
        ],
      },
      {
        heading: "Attachments",
        paragraphs: [
          "POST /api/attachments — multipart form upload. Fields: file (required), channelId (required). Validates channel membership and file size (max 50 MB). Returns attachment metadata JSON on success.",
        ],
      },
      {
        heading: "Workspaces",
        paragraphs: [
          "GET /api/workspaces — list workspaces the current user belongs to",
          "POST /api/workspaces — create a workspace. Body: name, slug",
          "GET /api/workspaces/{id} — workspace details",
          "DELETE /api/workspaces/{id} — delete a workspace (owner only)",
          "POST /api/workspaces/{id}/leave — leave a workspace",
        ],
      },
      {
        heading: "Channels",
        paragraphs: [
          "GET /api/channels?workspaceId={uuid} — list channels in a workspace",
          "POST /api/channels — create a channel. Body: name, workspaceId, visibility, sectionId (optional)",
          "GET /api/channels/{id} — channel details",
          "DELETE /api/channels/{id} — delete a channel",
          "POST /api/channels/{id}/leave — leave a channel",
        ],
      },
      {
        heading: "Channel sections",
        paragraphs: [
          "POST /api/channel-sections — create a section. Body: name, workspaceId",
          "PATCH /api/channel-sections/{id} — rename a section",
          "DELETE /api/channel-sections/{id} — delete a section",
        ],
      },
      {
        heading: "Direct messages",
        paragraphs: [
          "POST /api/dms — start or retrieve a DM channel with another workspace member. Body: workspaceId, userId",
        ],
      },
      {
        heading: "Threads",
        paragraphs: [
          "GET /api/threads — list thread summaries for the current user (recent replies across channels)",
        ],
      },
      {
        heading: "Reactions",
        paragraphs: [
          "POST /api/reactions — add or toggle an emoji reaction. Body: messageId, emoji",
          "DELETE /api/reactions — remove a reaction. Body: messageId, emoji",
        ],
      },
      {
        heading: "Profile",
        paragraphs: [
          "GET /api/profile — current user profile",
          "PATCH /api/profile — update display name or other profile fields",
          "POST /api/profile/avatar — upload profile avatar (multipart)",
        ],
      },
      {
        heading: "Integrations",
        paragraphs: [
          "GET /api/github/preview?url={githubUrl} — fetch rich preview metadata for a GitHub PR, issue, or commit. Returns 400 for non-GitHub URLs, 502 on GitHub API errors.",
        ],
      },
      {
        heading: "Billing",
        paragraphs: [
          "POST /api/stripe/checkout — create a Stripe Checkout session for Pro upgrade",
          "POST /api/stripe/confirm — confirm checkout completion",
          "POST /api/stripe/webhook — Stripe webhook handler (server-to-server, not for client use)",
        ],
      },
      {
        heading: "Error responses",
        paragraphs: [
          "All errors return JSON with an error field. Common status codes: 400 (validation), 401 (unauthenticated), 403 (forbidden — not a member), 404 (not found), 500 (server error), 502 (upstream failure for GitHub previews).",
        ],
      },
    ],
  },
  {
    slug: "data-processing",
    title: "Data processing",
    description:
      "What data DevTalk collects, why, where it is stored, and how long it is kept.",
    lastUpdated: "June 12, 2026",
    sections: [
      {
        paragraphs: [
          "This document describes how DevTalk processes personal and workspace data. DevTalk processes data solely to provide the chat service. We do not sell personal data, use message content to train AI models, or serve third-party advertising.",
        ],
      },
      {
        heading: "Data we collect",
        bullets: [
          "Account data — email address, hashed password, display name, avatar image",
          "Workspace data — workspace name, slug, membership records",
          "Message data — message text, timestamps, edit history, thread relationships",
          "Attachment data — uploaded files with filename, size, and mime type",
          "Usage metadata — subscription tier, billing status via Stripe customer ID",
          "Reaction data — emoji reactions linked to messages and user IDs",
        ],
      },
      {
        heading: "Purpose of processing",
        bullets: [
          "Provide real-time messaging, search, and file sharing",
          "Authenticate users and enforce workspace/channel access controls",
          "Process subscription payments and manage plan limits",
          "Generate GitHub link previews when users paste GitHub URLs",
          "Send transactional emails (verification, password reset)",
        ],
      },
      {
        heading: "Sub-processors",
        paragraphs: [
          "DevTalk uses the following third-party services to operate. Each processes data only as needed to provide their service:",
        ],
        bullets: [
          "Supabase (supabase.com) — authentication, PostgreSQL database, file storage, realtime subscriptions. Data stored in the region configured for your Supabase project.",
          "Stripe (stripe.com) — subscription billing, payment processing, invoicing. Handles all card data; DevTalk stores only a Stripe customer ID.",
          "Vercel (vercel.com) — application hosting, serverless function execution, edge delivery. Request logs may include IP addresses and user agents.",
          "GitHub API (api.github.com) — fetches public metadata for link previews when users paste GitHub URLs. No GitHub credentials are stored.",
        ],
      },
      {
        heading: "Data location and transfer",
        paragraphs: [
          "Primary data storage (database and file storage) is hosted by Supabase in the region selected at project setup. Application servers run on Vercel's global edge network. Stripe processes payment data according to its own data residency policies.",
          "By using DevTalk, you acknowledge that data may be processed in countries where these sub-processors operate.",
        ],
      },
      {
        heading: "Retention",
        paragraphs: [
          "Message retention depends on your plan:",
        ],
        bullets: [
          "Free plan — messages older than 90 days are hidden from the UI and search but retained in storage",
          "Pro plan — messages are retained indefinitely while the workspace is active",
          "Deleted workspaces — data is removed from active storage; backups may persist for a limited period",
          "Deleted accounts — profile and auth data are removed; messages authored by the user remain visible to other members",
        ],
      },
      {
        heading: "Your rights",
        paragraphs: [
          "Depending on your jurisdiction, you may have the right to access, correct, export, or delete your personal data. To exercise these rights, contact support@devtalk.app with your account email and request details.",
          "For full legal terms governing data use, see our Privacy Policy and Terms of Service.",
        ],
      },
      {
        heading: "Data breach notification",
        paragraphs: [
          "In the event of a data breach affecting personal data, we will notify affected users and relevant authorities as required by applicable law. Security incidents can be reported to security@devtalk.app.",
        ],
      },
    ],
  },
];

export function getDocPage(slug: string) {
  return DOC_PAGES.find((page) => page.slug === slug);
}
