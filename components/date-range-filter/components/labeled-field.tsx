import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";

type TProps = {
  label: string;
  children: ReactNode;
};

export const LabeledField = ({ label, children }: TProps) => (
  <div className="flex flex-col gap-1.5">
    <Label className="font-normal">{label}</Label>
    {children}
  </div>
);
