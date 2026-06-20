"use client";

import { type ReactNode } from "react";

import { RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

type TProps = {
  value: string;
  id: string;
  label: string;
  active: boolean;
  children?: ReactNode;
};

export const ModeRadioCard = ({ value, id, label, active, children }: TProps) => (
  <div
    className={cn(
      "rounded-md border px-3.5 py-3 transition-colors",
      active ? "border-brand bg-brand-bg" : "border-border",
    )}
  >
    <label htmlFor={id} className="flex cursor-pointer items-center gap-2.5">
      <RadioGroupItem value={value} id={id} />
      <span className="text-foreground text-sm font-semibold tracking-[-0.1px]">{label}</span>
    </label>
    {active && children ? (
      <div className="border-brand-border mt-3.5 border-t pt-3.5">{children}</div>
    ) : null}
  </div>
);
