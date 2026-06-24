import { type ReactNode } from "react";

type TProps = {
  label: string;
  children: ReactNode;
};

export const ReadOnlyField = ({ label, children }: TProps) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-sm leading-none font-normal">{label}</span>
    <div className="bg-muted text-foreground flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium">
      {children}
    </div>
  </div>
);
