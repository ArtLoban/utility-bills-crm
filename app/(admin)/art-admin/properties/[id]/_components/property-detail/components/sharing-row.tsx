import { cn } from "@/lib/utils";

type TRole = "Owner" | "Editor" | "Viewer";

type TProps = {
  initials: string;
  name: string;
  role: TRole;
  isLast: boolean;
};

export const SharingRow = ({ initials, name, role, isLast }: TProps) => (
  <div className={cn("flex items-center gap-3 py-3", !isLast && "border-border border-b")}>
    <div className="bg-muted text-muted-foreground flex size-[30px] shrink-0 items-center justify-center rounded-full text-[10.5px] font-semibold">
      {initials}
    </div>
    <span className="flex-1 text-sm font-medium">{name}</span>
    <span className="text-muted-foreground text-sm">{role}</span>
  </div>
);
