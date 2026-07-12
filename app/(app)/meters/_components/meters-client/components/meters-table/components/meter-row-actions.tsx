"use client";

import { Eye, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import type { TAction } from "@/components/actions-menu/types";
import { ActionsMenu } from "@/components/actions-menu";
import type { TMeterGlobalRow } from "@/lib/db/access/meters";
import { PROPERTY_ROLES } from "@/lib/db/schema/properties";
import { ROUTES } from "@/lib/routes";

type TProps = {
  row: TMeterGlobalRow;
};

export const MeterRowActions = ({ row }: TProps) => {
  const t = useTranslations("meters.list");

  const meterHref = `${ROUTES.properties}/${row.property.id}/meters/${row.meter.id}`;
  const canSubmitReading = row.role !== PROPERTY_ROLES.VIEWER && row.meter.validTo === null;

  const items: TAction[] = [
    {
      kind: "link",
      label: t("actions.viewDetails"),
      icon: <Eye size={14} />,
      href: meterHref,
    },
    ...(canSubmitReading
      ? [
          {
            kind: "link",
            label: t("actions.submitReading"),
            icon: <Plus size={14} />,
            href: `${meterHref}/reading/new`,
          } satisfies TAction,
        ]
      : []),
  ];

  return <ActionsMenu items={items} />;
};
