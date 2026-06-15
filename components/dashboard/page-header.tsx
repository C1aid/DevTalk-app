import type { LucideIcon } from "lucide-react";

type PageHeaderProps = {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
};

export function PageHeader({
  title,
  description,
  icon: Icon,
  action,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        {Icon && (
          <div className="liquid-glass flex size-9 shrink-0 items-center justify-center rounded-xl sm:size-10">
            <Icon className="size-4 text-white sm:size-5" />
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
            {title}
          </h1>
          <p className="mt-1 text-sm text-gray-300">{description}</p>
        </div>
      </div>
      {action && <div className="w-full shrink-0 sm:w-auto">{action}</div>}
    </div>
  );
}
