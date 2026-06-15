"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { ExternalLink, GitBranch, GitCommit, GitPullRequest } from "lucide-react";

type GitHubPreviewData = {
  type: "pr" | "issue" | "commit" | "repo";
  title: string;
  description: string | null;
  url: string;
};

const GITHUB_URL_REGEX =
  /https?:\/\/github\.com\/[\w.-]+\/[\w.-]+(?:\/(?:pull|issues|commit)\/[\w]+)?/g;

function PreviewIcon({ type }: { type: GitHubPreviewData["type"] }) {
  if (type === "pr") return <GitPullRequest className="size-4" />;
  if (type === "commit") return <GitCommit className="size-4" />;
  return <GitBranch className="size-4" />;
}

function GitHubPreviewCard({ url }: { url: string }) {
  const [preview, setPreview] = useState<GitHubPreviewData | null>(null);

  useEffect(() => {
    void fetch(`/api/github/preview?url=${encodeURIComponent(url)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setPreview(data as GitHubPreviewData | null))
      .catch(() => setPreview(null));
  }, [url]);

  if (!preview) return null;

  return (
    <a
      href={preview.url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2 block rounded-lg border border-white/10 bg-white/5 p-3 transition-smooth hover:border-white/20"
    >
      <div className="flex items-center gap-2 text-xs text-primary">
        <PreviewIcon type={preview.type} />
        <span className="uppercase tracking-wide">{preview.type}</span>
        <ExternalLink className="ml-auto size-3 text-muted-foreground" />
      </div>
      <p className="mt-1 text-sm font-medium text-foreground">{preview.title}</p>
      {preview.description && (
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
          {preview.description}
        </p>
      )}
    </a>
  );
}

export function MessageContent({ content }: { content: string }) {
  const githubUrls = [...new Set(content.match(GITHUB_URL_REGEX) ?? [])];

  return (
    <div className="prose prose-invert prose-sm max-w-none break-words [overflow-wrap:anywhere]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          pre: ({ children }) => (
            <pre className="overflow-x-auto rounded-lg border border-white/10 bg-black/50 p-3 text-xs">
              {children}
            </pre>
          ),
          code: ({ className, children, ...props }) => {
            const isBlock = className?.includes("language-");
            if (isBlock) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code
                className="rounded bg-white/10 px-1 py-0.5 text-[0.85em]"
                {...props}
              >
                {children}
              </code>
            );
          },
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline-offset-2 hover:underline"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
      {githubUrls.map((url) => (
        <GitHubPreviewCard key={url} url={url} />
      ))}
    </div>
  );
}
