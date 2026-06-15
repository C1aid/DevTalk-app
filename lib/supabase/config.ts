const PLACEHOLDER_HOSTS = ["placeholder.supabase.co"];

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  if (!url || !key) return false;
  if (key.includes("placeholder")) return false;

  try {
    const host = new URL(url).hostname;
    return !PLACEHOLDER_HOSTS.includes(host);
  } catch {
    return false;
  }
}

export function getSupabaseConfigError(): string | null {
  if (isSupabaseConfigured()) return null;

  return "Supabase is not configured. Add your project URL and anon key to .env.local, then restart the dev server.";
}

export type AuthErrorContext = "signup" | "login" | "reset";

export function formatSupabaseAuthError(
  message: string,
  context: AuthErrorContext = "login",
): string {
  const lower = message.toLowerCase();

  if (lower.includes("email not confirmed")) {
    return "Confirm your email first — check your inbox for the Supabase verification link.";
  }

  if (lower.includes("rate limit") || lower.includes("too many requests")) {
    const limitNote =
      "Supabase temporarily blocked auth emails for this project — the built-in mailer has a very low limit.";

    if (context === "signup") {
      return `${limitNote} Wait about an hour, or create the user in Supabase Dashboard → Authentication → Users (you can disable “Confirm email” while testing).`;
    }

    if (context === "reset") {
      return `${limitNote} Wait about an hour and try again, or reset the password manually in Supabase Dashboard → Authentication → Users.`;
    }

    return `${limitNote} Wait about an hour and try again.`;
  }

  return message;
}

export function formatAuthError(error: unknown): string {
  const configError = getSupabaseConfigError();
  if (configError) return configError;

  if (error instanceof TypeError && error.message === "Failed to fetch") {
    return "Could not reach Supabase. Check NEXT_PUBLIC_SUPABASE_URL in .env.local and restart the dev server.";
  }

  if (error instanceof Error) return error.message;

  return "Something went wrong. Please try again.";
}
