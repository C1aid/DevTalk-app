import { FolderOpen } from "lucide-react";
import { PlaceholderPage } from "@/components/dashboard/placeholder-page";

export default function FilesPage() {
  return (
    <PlaceholderPage
      title="Files"
      description="Shared files and attachments from channels."
      icon={FolderOpen}
    />
  );
}
