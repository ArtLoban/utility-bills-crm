"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/link-button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ROUTES } from "@/lib/routes";

type TProps = {
  isLinked: boolean;
  newHref: string;
};

export const AddReminderButton = ({ isLinked, newHref }: TProps) => {
  const t = useTranslations("reminders");

  if (isLinked) {
    return <LinkButton href={newHref} icon={Plus} text={t("add")} variant="default" />;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {/* A disabled button emits no pointer events, so the tooltip hangs off a focusable span. */}
        <span tabIndex={0}>
          <Button size="sm" disabled>
            <Plus size={14} />
            {t("add")}
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <Link href={ROUTES.settings} className="underline underline-offset-2">
          {t("addDisabledTooltip")}
        </Link>
      </TooltipContent>
    </Tooltip>
  );
};
