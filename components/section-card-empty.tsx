import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type TProps = {
  icon: LucideIcon;
  caption: string;
  action?: ReactNode;
};

export const SectionCardEmpty = ({ icon: Icon, caption, action }: TProps) => (
  <div className="flex flex-col items-center justify-center gap-3 px-6 py-10">
    <Icon className="text-muted-foreground/40 size-7" />
    <p className="text-muted-foreground text-sm">{caption}</p>
    {action}
  </div>
);
