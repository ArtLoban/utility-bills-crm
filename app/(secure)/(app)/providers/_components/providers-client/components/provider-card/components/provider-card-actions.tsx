"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ROUTES } from "@/lib/routes";
import type { TProviderWithUsage } from "@/app/(secure)/(app)/providers/_data/queries";
import { useProvidersList } from "../../../context";

type TProps = {
  provider: TProviderWithUsage;
};

export const ProviderCardActions = ({ provider }: TProps) => {
  const t = useTranslations("providers");
  const { requestDelete } = useProvidersList();

  const canDelete = provider.usageCount === 0;

  return (
    <div className="flex shrink-0 items-center gap-1.5 pt-px">
      <Button variant="outline" size="icon" className="h-8 w-8" asChild>
        <Link href={`${ROUTES.providers}/${provider.id}/edit`} aria-label={t("actions.edit")}>
          <Pencil size={14} />
        </Link>
      </Button>

      {canDelete ? (
        <Button
          variant="outline"
          size="icon"
          className="text-destructive hover:text-destructive h-8 w-8"
          onClick={() => requestDelete(provider)}
          aria-label={t("actions.delete")}
        >
          <Trash2 size={14} />
        </Button>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled
                aria-label={t("actions.delete")}
              >
                <Trash2 size={14} />
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent side="top">{t("delete.inUseTooltip")}</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};
