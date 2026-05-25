import { Card } from "@/components/ui/card";
import { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type TProps = {
  icon: LucideIcon;
  title: string;
  body?: ReactNode;
  cta?: ReactNode;
};

export const EmptyStateCard = ({ icon: Icon, title, body, cta }: TProps) => {
  return (
    <div className="flex justify-center pt-6">
      <Card className="flex w-full max-w-[400px] flex-col items-center gap-4 rounded-lg px-10 py-10 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
          <Icon size={36} strokeWidth={1.5} className="text-muted-foreground/60" />
        </div>

        <div className="flex flex-col items-center gap-0">
          <p className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">{title}</p>
          {body && <p className="mt-2 text-sm leading-relaxed text-zinc-500">{body}</p>}
        </div>

        {cta && <div className="mt-1">{cta}</div>}
      </Card>
    </div>
  );
};
