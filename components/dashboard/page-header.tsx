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
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="liquid-glass flex size-10 shrink-0 items-center justify-center rounded-xl">
            <Icon className="size-5 text-white" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            {title}
          </h1>
          <p className="mt-1 text-sm text-gray-300">{description}</p>
        </div>
      </div>
      {action}
    </div>
  );
}
