import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type TSettingsCardProps = {
  children: ReactNode;
  className?: string;
};

type TSettingsCardHeaderProps = {
  title: string;
  description?: string;
};

type TSettingsCardBodyProps = { children: ReactNode };
type TSettingsCardFooterProps = { children: ReactNode };
type TFieldLabelProps = { children: ReactNode; htmlFor?: string };
type TFieldHintProps = { children: ReactNode };

export const SettingsCard = ({ children, className }: TSettingsCardProps) => (
  <div className={cn("border-border bg-card overflow-hidden rounded-lg border", className)}>
    {children}
  </div>
);

export const SettingsCardHeader = ({ title, description }: TSettingsCardHeaderProps) => (
  <div className="border-border border-b px-4 py-5 sm:px-6">
    <div className="text-foreground text-base font-semibold tracking-tight">{title}</div>
    {description && <div className="text-muted-foreground mt-0.5 text-sm">{description}</div>}
  </div>
);

export const SettingsCardBody = ({ children }: TSettingsCardBodyProps) => (
  <div className="flex flex-col gap-5 px-4 py-6 sm:px-6">{children}</div>
);

export const SettingsCardFooter = ({ children }: TSettingsCardFooterProps) => (
  <div className="border-border bg-muted/40 flex justify-end border-t px-4 py-3.5 sm:px-6">
    {children}
  </div>
);

export const FieldLabel = ({ children, htmlFor }: TFieldLabelProps) => (
  <label htmlFor={htmlFor} className="text-foreground mb-1.5 block text-sm font-medium">
    {children}
  </label>
);

export const FieldHint = ({ children }: TFieldHintProps) => (
  <p className="text-muted-foreground mt-1 text-xs leading-relaxed">{children}</p>
);
