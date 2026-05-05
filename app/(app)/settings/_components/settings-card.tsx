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
type TFieldLabelProps = { children: ReactNode };
type TFieldHintProps = { children: ReactNode };

const SettingsCard = ({ children, className }: TSettingsCardProps) => (
  <div
    className={cn(
      "overflow-hidden rounded-[10px] border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900",
      className,
    )}
  >
    {children}
  </div>
);

const SettingsCardHeader = ({ title, description }: TSettingsCardHeaderProps) => (
  <div className="border-b border-zinc-200 px-6 py-[22px] dark:border-zinc-800">
    <div className="text-base font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
      {title}
    </div>
    {description && (
      <div className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{description}</div>
    )}
  </div>
);

const SettingsCardBody = ({ children }: TSettingsCardBodyProps) => (
  <div className="flex flex-col gap-5 p-6">{children}</div>
);

const SettingsCardFooter = ({ children }: TSettingsCardFooterProps) => (
  <div className="flex justify-end border-t border-zinc-200 bg-zinc-50 px-6 py-[14px] dark:border-zinc-800 dark:bg-zinc-950">
    {children}
  </div>
);

const FieldLabel = ({ children }: TFieldLabelProps) => (
  <label className="mb-1.5 block text-sm font-medium text-zinc-950 dark:text-zinc-50">
    {children}
  </label>
);

const FieldHint = ({ children }: TFieldHintProps) => (
  <p className="mt-[5px] text-xs leading-[1.55] text-zinc-500 dark:text-zinc-400">{children}</p>
);

export {
  SettingsCard,
  SettingsCardHeader,
  SettingsCardBody,
  SettingsCardFooter,
  FieldLabel,
  FieldHint,
};
