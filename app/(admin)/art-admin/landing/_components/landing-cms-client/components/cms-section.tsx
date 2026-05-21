import { type ReactNode } from "react";

type TProps = {
  icon: ReactNode;
  title: string;
  description?: string;
  children: ReactNode;
};

export const CmsSection = ({ icon, title, description, children }: TProps) => (
  <div className="border-border bg-card mb-5 overflow-hidden rounded-[10px] border">
    <div className="border-border flex items-start gap-3 border-b px-6 pt-[18px] pb-4">
      <div className="bg-muted text-muted-foreground mt-px flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-foreground font-semibold tracking-tight text-[var(--font-size-md)]">
          {title}
        </div>
        {description && (
          <div className="text-muted-foreground mt-0.5 text-[12.5px]">{description}</div>
        )}
      </div>
    </div>
    <div className="p-[22px_24px]">{children}</div>
  </div>
);
