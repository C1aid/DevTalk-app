import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type GitHubPreview = {
  type: "pr" | "issue" | "commit" | "repo";
  title: string;
  description: string | null;
  url: string;
};

function parseGitHubUrl(url: string): { owner: string; repo: string; type: string; id?: string } | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== "github.com") return null;
    const parts = parsed.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return null;

    const [owner, repo, segment, id] = parts;
    if (!owner || !repo) return null;
    if (segment === "pull" && id) {
      return { owner, repo, type: "pr", id };
    }
    if (segment === "issues" && id) {
      return { owner, repo, type: "issue", id };
    }
    if (segment === "commit" && id) {
      return { owner, repo, type: "commit", id };
    }
    if (parts.length === 2) {
      return { owner, repo, type: "repo" };
    }
    return null;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "url required" }, { status: 400 });
  }

  const parsed = parseGitHubUrl(url);
  if (!parsed) {
    return NextResponse.json({ error: "Not a GitHub URL" }, { status: 400 });
  }

  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "DevTalk-App",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    let apiUrl: string;
    let type: GitHubPreview["type"] = "repo";

    if (parsed.type === "pr") {
      apiUrl = `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/pulls/${parsed.id}`;
      type = "pr";
    } else if (parsed.type === "issue") {
      apiUrl = `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/issues/${parsed.id}`;
      type = "issue";
    } else if (parsed.type === "commit") {
      apiUrl = `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/commits/${parsed.id}`;
      type = "commit";
    } else {
      apiUrl = `https://api.github.com/repos/${parsed.owner}/${parsed.repo}`;
      type = "repo";
    }

    const res = await fetch(apiUrl, { headers, next: { revalidate: 300 } });

    if (!res.ok) {
      return NextResponse.json({ error: "GitHub API error" }, { status: 502 });
    }

    const data = (await res.json()) as Record<string, unknown>;

    let title: string;
    let description: string | null = null;

    if (type === "commit") {
      const commit = data.commit as { message?: string } | undefined;
      title = (commit?.message?.split("\n")[0] ?? parsed.id) as string;
      description = parsed.id ?? null;
    } else if (type === "repo") {
      title = (data.full_name as string) ?? `${parsed.owner}/${parsed.repo}`;
      description = (data.description as string) ?? null;
    } else {
      title = (data.title as string) ?? url;
      description = (data.body as string)?.slice(0, 200) ?? null;
    }

    const preview: GitHubPreview = { type, title, description, url };
    return NextResponse.json(preview);
  } catch {
    return NextResponse.json({ error: "Failed to fetch preview" }, { status: 500 });
  }
}
