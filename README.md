# DevTalk

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

**Live:** [dev-talk-two-iota.vercel.app](https://dev-talk-two-iota.vercel.app)

Team chat for developers — workspaces, channels, DMs, threads, and real-time messaging. No AI upsells, no enterprise bloat.

| Plan | Channels | History | Price |
|------|----------|---------|-------|
| Free | 10 | 90 days | $0 |
| Pro | Unlimited | Unlimited | $8/mo |

---

## Tech Stack

| Category | Stack |
|----------|-------|
| Framework | [Next.js](https://nextjs.org/) 14 (App Router), [React](https://react.dev/) 18 |
| Language | [TypeScript](https://www.typescriptlang.org/) 5 (strict) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) 3, shadcn/ui, liquid-glass UI |
| Backend | [Supabase](https://supabase.com/) — Auth, PostgreSQL, RLS, Realtime, Storage |
| Messaging | Markdown, threads, reactions, attachments, GitHub link previews |
| Billing | [Stripe](https://stripe.com/) Checkout + webhooks |
| State | [Zustand](https://zustand.docs.pmnd.rs/), [TanStack Query](https://tanstack.com/query) |
| Tests | [Vitest](https://vitest.dev/), [Playwright](https://playwright.dev/) |
| CI | GitHub Actions |

**Requirements:** Node.js **18+**, npm **9+**. Dev server: **http://localhost:3001**.

---

## Features

### Messaging
- Real-time channels and DMs scoped to workspaces
- Threads, emoji reactions, @mentions
- Markdown, syntax-highlighted code blocks, GitHub link previews
- File attachments (up to 50 MB) and voice messages
- Edit and delete own text messages

### Workspaces & access
- Workspace switcher with channel sections
- Public and private channels
- Workspace roles: **Owner**, **Admin**, **Member**
- Channel posting mode: all members or admins only (announcement channels)
- Member list with online presence (online / away / DND / offline)

### Auth & billing
- Email/password auth, optional Google OAuth
- Profile: display name, avatar, presence status
- Stripe Pro upgrade from Settings

### Marketing site
- Landing page, docs, changelog, security, legal pages

### In progress
- Activity feed, global file browser, pins, global search — UI placeholders only

---

## Quick start

```bash
git clone https://github.com/C1aid/devtalk-app.git
cd devtalk-app
npm install
cp .env.local.example .env.local
```

1. Fill in `.env.local` (see [Environment variables](#environment-variables))
2. Link Supabase and apply migrations (see [Database](#database))
3. Configure Stripe webhook for local dev (see [Stripe](#stripe))
4. `npm run dev` → **http://localhost:3001**

---

## Environment variables

Copy `.env.local.example` and set:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (webhooks, admin ops) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_PRO_PRICE_ID` | Pro monthly price ID |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret |
| `NEXT_PUBLIC_APP_URL` | App base URL (see below) |
| `NEXT_PUBLIC_SENTRY_DSN` | Optional error tracking |

**URLs by environment**

| Environment | `NEXT_PUBLIC_APP_URL` |
|-------------|------------------------|
| Local | `http://localhost:3001` |
| Production | `https://dev-talk-two-iota.vercel.app` |

Do not commit `.env.local`.

---

## Database

Migrations live in `supabase/migrations/` (001–017).

### Supabase CLI (recommended)

```bash
npm install -g supabase
supabase login
supabase link --project-ref <your-project-ref>
supabase db push
```

### Manual setup

Run each file in order via Supabase **SQL Editor** if you are not using the CLI.

| Range | Highlights |
|-------|------------|
| 001–004 | Profiles, RLS, Pro tier enum |
| 005–011 | Channels, messages, reactions, DMs, sections |
| 012–013 | Workspaces, workspace RLS fix |
| 014 | Message attachments + storage bucket |
| 015–017 | Roles, presence, posting permissions, message soft-delete |

### Auth redirect URLs

Configure in Supabase → **Authentication → URL Configuration**:

| Setting | Production |
|---------|------------|
| Site URL | `https://dev-talk-two-iota.vercel.app` |
| Redirect URLs | `https://dev-talk-two-iota.vercel.app/auth/callback` |
| | `http://localhost:3001/auth/callback` |

For local dev, you can disable email confirmation under **Authentication → Providers → Email**.

---

## Stripe

1. Create product **DevTalk Pro** with a monthly price (test mode)
2. Copy price ID → `STRIPE_PRO_PRICE_ID`
3. Add webhook endpoint:

   **Production:** `https://dev-talk-two-iota.vercel.app/api/stripe/webhook`

   Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

4. Copy signing secret → `STRIPE_WEBHOOK_SECRET` (Vercel + local as needed)

**Local webhooks**

```bash
stripe listen --forward-to localhost:3001/api/stripe/webhook
```

Use the `whsec_...` from `stripe listen` in `.env.local` while developing locally.

Test card: `4242 4242 4242 4242`

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server (port 3001) |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run lint` | ESLint |
| `npm run type-check` | TypeScript |
| `npm run test:unit` | Vitest |
| `npm run test:e2e` | Playwright |

---

## Project layout

```
app/
  (auth)/              Login, signup, password reset
  (dashboard)/         Chat UI, settings, workspace routes
  api/                 REST handlers (messages, channels, stripe, …)
  docs/                Documentation pages
  about/, security/, … Marketing & legal pages
components/
  chat/                Messages, composer, members, presence
  landing/             Marketing landing sections
  marketing/           Header, footer, content shells
lib/
  chat/                Queries, permissions, attachments
  presence/            Status helpers
  supabase/            Client, middleware, admin
supabase/migrations/   SQL migrations
tests/                 Unit + e2e
```

### Routing

```
/w/[slug]/channels/[id]   Workspace channel
/channels/[id]/chat       DM (legacy path)
/settings                 Account & billing
```

Legacy `/channels/[id]` redirects to the workspace or DM route.

---

## Deploy (Vercel)

1. Import repo in [Vercel](https://vercel.com)
2. Set all env vars from `.env.local.example`
3. Set `NEXT_PUBLIC_APP_URL=https://dev-talk-two-iota.vercel.app`
4. Configure Supabase redirect URLs (see [Database](#database))
5. Configure Stripe webhook (see [Stripe](#stripe))

CI on `main`: lint → type-check → unit tests → build → e2e.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Profile not found | Run migrations; profile is created via `/api/profile` |
| Workspace create RLS error | Ensure migration **013** is applied after **012** |
| Checkout redirect wrong domain | Set `NEXT_PUBLIC_APP_URL` and redeploy |
| Stripe Pro not activating | Check webhook URL, `STRIPE_WEBHOOK_SECRET`, event deliveries in Stripe Dashboard |
| Auth redirect fails | Match Site URL and redirect URL to the same domain |

---

## Author

**Egor Ermilov**

- GitHub: [C1aid](https://github.com/C1aid)
- LinkedIn: [Egor-Ermilov](https://www.linkedin.com/in/egor-ermilov-049402348/)

---

## License

[MIT](./LICENSE)
