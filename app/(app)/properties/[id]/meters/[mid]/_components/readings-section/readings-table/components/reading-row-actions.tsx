"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import type { TReading } from "@/lib/db/schema/readings";
import type { TMeter } from "@/lib/db/schema/meters";

type TProps = {
  reading: TReading;
  meter: TMeter;
  canMutate: boolean;
};

export const ReadingRowActions = ({ reading, meter, canMutate }: TProps) => {
  const t = useTranslations("meters.detail.readings");

  if (!canMutate) return null;

  return (
    <Button variant="ghost" size="icon" className="size-7" asChild aria-label={t("edit")}>
      <Link
        href={`${ROUTES.properties}/${meter.propertyId}/meters/${meter.id}/reading/${reading.id}/edit`}
      >
        <Pencil className="size-3.5" strokeWidth={1.75} />
      </Link>
    </Button>
  );
};
