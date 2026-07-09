import { Card } from "@/components/ui/card";
import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";

type TVariant = "page" | "block";

type TProps = {
  icon: LucideIcon;
  title: string;
  body?: ReactNode;
  cta?: ReactNode;
  variant?: TVariant;
};

export const EmptyStateCard = ({ icon: Icon, title, body, cta, variant = "page" }: TProps) => {
  const content = (
    <>
      <IconBadge icon={Icon} color="var(--neutral-400)" size="xl" />

      <div className="flex flex-col items-center gap-0">
        <p className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">{title}</p>
        {body && <p className="mt-2 text-sm leading-relaxed text-zinc-500">{body}</p>}
      </div>

      {cta && <div className="mt-1">{cta}</div>}
    </>
  );

  if (variant === "block") {
    return (
      <Card className="rounded-lg px-6 py-12">
        <div className="mx-auto flex max-w-sm flex-col items-center gap-4 text-center">
          {content}
        </div>
      </Card>
    );
  }

  return (
    <div className="flex justify-center pt-6">
      <Card className="flex w-full max-w-[400px] flex-col items-center gap-4 rounded-lg px-10 py-10 text-center">
        {content}
      </Card>
    </div>
  );
};
