import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";

type PlaceholderPageProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export function PlaceholderPage({ title, description, icon }: PlaceholderPageProps) {
  const Icon = icon;

  return (
    <div className="lg:mx-auto lg:max-w-3xl">
      <PageHeader title={title} description={description} icon={Icon} />
      <div className="glass-card mt-6 p-8 text-center">
        <p className="text-muted-foreground">Coming soon in a future update.</p>
      </div>
    </div>
  );
}
