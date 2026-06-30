import { type ReactNode } from "react";

type TProps = {
  icon: ReactNode;
  title: string;
  description?: string;
  children: ReactNode;
};

export const CmsSection = ({ icon, title, description, children }: TProps) => (
  <div className="border-border bg-card mb-5 overflow-hidden rounded-lg border">
    <div className="border-border flex items-start gap-3 border-b px-6 pt-4.5 pb-4">
      <div className="bg-muted text-muted-foreground mt-px flex size-7.5 shrink-0 items-center justify-center rounded-lg">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-foreground text-sm font-semibold tracking-tight">{title}</div>
        {description && <div className="text-muted-foreground mt-0.5 text-xs">{description}</div>}
      </div>
    </div>
    <div className="px-6 py-5.5">{children}</div>
  </div>
);
