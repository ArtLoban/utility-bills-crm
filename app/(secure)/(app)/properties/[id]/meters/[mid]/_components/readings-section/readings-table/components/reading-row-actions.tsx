"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { ActionsMenu } from "@/components/actions-menu";
import type { TAction } from "@/components/actions-menu/types";
import { ROUTES } from "@/lib/routes";
import type { TReading } from "@/lib/db/schema/readings";
import type { TMeter } from "@/lib/db/schema/meters";

import { useReadingsTable } from "../context";

type TProps = {
  reading: TReading;
  meter: TMeter;
  canMutate: boolean;
};

export const ReadingRowActions = ({ reading, meter, canMutate }: TProps) => {
  const t = useTranslations("meters.detail.readings");
  const { requestDelete } = useReadingsTable();

  if (!canMutate) return null;

  const items: TAction[] = [
    {
      kind: "link",
      label: t("edit"),
      icon: <Pencil size={14} />,
      href: `${ROUTES.properties}/${meter.propertyId}/meters/${meter.id}/reading/${reading.id}/edit`,
    },
    { kind: "separator" },
    {
      kind: "item",
      label: t("delete.menuItem"),
      icon: <Trash2 size={14} />,
      destructive: true,
      onSelect: () => requestDelete(reading),
    },
  ];

  return <ActionsMenu items={items} />;
};
