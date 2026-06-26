"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatReadingValue } from "@/features/readings/format";
import { formatDisplayDate } from "@/lib/format/date";
import { ROUTES } from "@/lib/routes";
import type { TReading } from "@/lib/db/schema/readings";
import type { TMeter } from "@/lib/db/schema/meters";

type TProps = {
  reading: TReading;
  meter: TMeter;
  canMutate: boolean;
};

export const ReadingRow = ({ reading, meter, canMutate }: TProps) => {
  const t = useTranslations("meters.detail.readings");

  return (
    <TableRow>
      <TableCell className="text-muted-foreground px-4">
        {formatDisplayDate(reading.readAt)}
      </TableCell>
      <TableCell className="text-foreground px-4 tabular-nums">
        {formatReadingValue(reading.valueT1)}
      </TableCell>
      {meter.zoneCount >= 2 && (
        <TableCell className="text-foreground px-4 tabular-nums">
          {formatReadingValue(reading.valueT2)}
        </TableCell>
      )}
      {meter.zoneCount === 3 && (
        <TableCell className="text-foreground px-4 tabular-nums">
          {formatReadingValue(reading.valueT3)}
        </TableCell>
      )}
      <TableCell className="text-muted-foreground max-w-48 truncate px-4">
        {reading.notes ?? ""}
      </TableCell>
      <TableCell className="w-10 px-4 text-right">
        {canMutate && (
          <Button variant="ghost" size="icon" className="size-7" asChild aria-label={t("edit")}>
            <Link
              href={`${ROUTES.properties}/${meter.propertyId}/meters/${meter.id}/reading/${reading.id}/edit`}
            >
              <Pencil className="size-3.5" strokeWidth={1.75} />
            </Link>
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};
