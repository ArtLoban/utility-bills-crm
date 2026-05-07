import { type ReactNode } from "react";

type TProps = {
  label: string;
  optional?: boolean;
  error?: string;
  children: ReactNode;
};

export const FormField = ({ label, optional, error, children }: TProps) => (
  <div>
    <label className="mb-1.5 block text-sm font-medium text-zinc-950 dark:text-zinc-50">
      {label}
      {optional && (
        <span className="ml-1 font-normal text-zinc-500 dark:text-zinc-400">(optional)</span>
      )}
    </label>
    {children}
    {error && <p className="text-destructive mt-1 text-xs">{error}</p>}
  </div>
);
