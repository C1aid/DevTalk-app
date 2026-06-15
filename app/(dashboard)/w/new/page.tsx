"use client";

import { CreateWorkspaceDialog } from "@/components/workspace/create-workspace-dialog";
import { useRouter } from "next/navigation";
import { workspacePath } from "@/lib/workspace/paths";

export default function NewWorkspacePage() {
  const router = useRouter();

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 pb-8 text-center sm:min-h-[60vh]">
      <h1 className="text-2xl font-semibold text-white">Create your workspace</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        A workspace is your team&apos;s home. Add channels and sections inside it.
      </p>
      <div className="mt-6">
        <CreateWorkspaceDialog
          onCreated={(slug) => router.push(workspacePath(slug))}
          trigger={
            <button type="button" className="btn-brand rounded-lg px-6 py-2.5 text-sm font-medium">
              Create workspace
            </button>
          }
        />
      </div>
    </div>
  );
}
