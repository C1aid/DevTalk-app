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
    description: "Create your workspace and send your first message in DevTalk.",
    lastUpdated: "June 12, 2026",
    sections: [
      {
        paragraphs: [
          "DevTalk is a team chat workspace for developers. After you sign up, you land in your default workspace with a general channel ready to use.",
        ],
      },
      {
        heading: "1. Create an account",
        paragraphs: [
          "Go to Sign up, confirm your email, and complete your profile with a display name. Avatars can be uploaded from Settings at any time.",
        ],
      },
      {
        heading: "2. Invite your team",
        paragraphs: [
          "Share your workspace with teammates by sending them your workspace URL. Members can join public channels immediately; private channels require an invite from a channel member.",
        ],
      },
      {
        heading: "3. Organize channels",
        paragraphs: [
          "Create channels per project or squad, group them into sections, and use threads to keep side discussions out of the main timeline.",
        ],
        bullets: [
          "Public channels are visible to everyone in the workspace.",
          "Private channels are invite-only.",
          "DMs support direct 1:1 conversations with the same messaging features.",
        ],
      },
      {
        heading: "4. Upgrade when you need scale",
        paragraphs: [
          "The Free plan includes 90 days of history and up to 10 channels. Pro unlocks unlimited channels, unlimited history, and full-text search across your archive.",
        ],
      },
    ],
  },
  {
    slug: "workspaces",
    title: "Workspaces",
    description: "How workspaces, membership, and switching work in DevTalk.",
    lastUpdated: "June 12, 2026",
    sections: [
      {
        paragraphs: [
          "A workspace is the top-level container for your team. Channels, DMs, and message history are scoped to the workspace you are currently viewing.",
        ],
      },
      {
        heading: "Creating and switching",
        paragraphs: [
          "Use the workspace switcher in the sidebar to move between workspaces you belong to. Owners can create additional workspaces from the switcher menu.",
        ],
      },
      {
        heading: "Roles and access",
        paragraphs: [
          "Workspace members can access public channels and DMs they participate in. Channel-level privacy controls who can read and post in a given channel.",
        ],
        bullets: [
          "Leave a workspace from workspace settings if you no longer need access.",
          "Deleting a workspace removes channels and messages for all members.",
        ],
      },
    ],
  },
  {
    slug: "channels-and-dms",
    title: "Channels & DMs",
    description: "Public and private channels, direct messages, threads, and reactions.",
    lastUpdated: "June 12, 2026",
    sections: [
      {
        paragraphs: [
          "Channels are persistent rooms for team conversations. DMs are private conversations between two members.",
        ],
      },
      {
        heading: "Channel sections",
        paragraphs: [
          "Group related channels into sections in the sidebar — for example Frontend, Backend, and Ops — to keep large workspaces navigable.",
        ],
      },
      {
        heading: "Threads",
        paragraphs: [
          "Reply in a thread to branch a discussion without flooding the main channel. Thread summaries show reply counts and deep-link back to the parent message.",
        ],
      },
      {
        heading: "Formatting & previews",
        paragraphs: [
          "Messages support Markdown, syntax-highlighted code blocks, emoji reactions, and rich previews for GitHub pull requests, issues, and commits.",
        ],
      },
    ],
  },
  {
    slug: "file-attachments",
    title: "File attachments",
    description: "Upload and share files in channel messages.",
    lastUpdated: "June 12, 2026",
    sections: [
      {
        paragraphs: [
          "Attach files from the message composer. Images render inline; other file types appear as downloadable cards with size and filename.",
        ],
      },
      {
        heading: "Limits",
        paragraphs: [
          "Attachments are stored per workspace and respect channel membership. Only members of a channel can upload or view files posted in that channel.",
        ],
        bullets: [
          "Supported: common image, document, archive, and code file types.",
          "Maximum file size per upload is enforced server-side.",
          "Deleting a message removes its attachment metadata from the channel timeline.",
        ],
      },
    ],
  },
  {
    slug: "billing",
    title: "Billing & plans",
    description: "Free and Pro plans, upgrades, and invoices.",
    lastUpdated: "June 12, 2026",
    sections: [
      {
        paragraphs: [
          "DevTalk offers a Free plan for small teams and a Pro plan for growing teams that need unlimited history and channels.",
        ],
      },
      {
        heading: "Free",
        bullets: [
          "Up to 10 channels per workspace",
          "90 days of message history",
          "Threads, reactions, Markdown, and GitHub previews",
          "Search within the 90-day window",
        ],
      },
      {
        heading: "Pro — $8 / month",
        bullets: [
          "Unlimited channels",
          "Unlimited message history",
          "Full-text search across the archive",
          "Priority support",
        ],
      },
      {
        heading: "Managing your subscription",
        paragraphs: [
          "Upgrade from Settings → Billing. Payments are processed securely through Stripe. You can cancel anytime; access continues until the end of the billing period.",
        ],
      },
    ],
  },
  {
    slug: "security",
    title: "Security practices",
    description: "How DevTalk protects accounts, data, and workspace access.",
    lastUpdated: "June 12, 2026",
    sections: [
      {
        paragraphs: [
          "DevTalk is built on Supabase Auth and PostgreSQL with row-level security on every tenant-scoped table.",
        ],
      },
      {
        heading: "Authentication",
        bullets: [
          "Email/password with secure session handling",
          "Password reset via time-limited email links",
          "Optional OAuth providers where configured",
        ],
      },
      {
        heading: "Data isolation",
        paragraphs: [
          "Workspace data is isolated at the database layer. API routes verify membership before returning channels, messages, or attachments.",
        ],
      },
      {
        heading: "Reporting issues",
        paragraphs: [
          "If you discover a security concern, contact security@devtalk.app with reproduction steps. We aim to acknowledge reports within two business days.",
        ],
      },
    ],
  },
  {
    slug: "api",
    title: "API reference",
    description: "HTTP endpoints used by the DevTalk web application.",
    lastUpdated: "June 12, 2026",
    sections: [
      {
        paragraphs: [
          "DevTalk exposes a session-authenticated REST API consumed by the web client. All endpoints require a valid Supabase session unless noted otherwise.",
        ],
      },
      {
        heading: "Messages",
        bullets: [
          "GET /api/messages?channelId= — list messages for a channel",
          "POST /api/messages — send a message (supports Markdown and attachments JSON)",
        ],
      },
      {
        heading: "Attachments",
        bullets: [
          "POST /api/attachments — multipart upload for channel file attachments",
        ],
      },
      {
        heading: "Workspaces & channels",
        bullets: [
          "GET/POST /api/workspaces — list and create workspaces",
          "GET/POST /api/channels — list and create channels",
          "POST /api/channel-sections — organize channels into sections",
        ],
      },
      {
        heading: "Integrations",
        bullets: [
          "GET /api/github/preview?url= — unfurl GitHub PR, issue, or commit links",
        ],
      },
    ],
  },
  {
    slug: "data-processing",
    title: "Data processing",
    description: "How DevTalk processes customer data.",
    lastUpdated: "June 12, 2026",
    sections: [
      {
        paragraphs: [
          "DevTalk processes account, workspace, and message data solely to provide the chat service. We do not sell personal data or use message content to train AI models.",
        ],
      },
      {
        heading: "Sub-processors",
        bullets: [
          "Supabase — authentication, database, file storage, realtime",
          "Stripe — subscription billing and invoicing",
          "Vercel — application hosting and edge delivery",
        ],
      },
      {
        heading: "Retention",
        paragraphs: [
          "Message retention follows your plan: 90 days on Free, unlimited on Pro. Deleted workspaces are removed from active storage according to our backup schedule.",
        ],
      },
    ],
  },
];

export function getDocPage(slug: string) {
  return DOC_PAGES.find((page) => page.slug === slug);
}
