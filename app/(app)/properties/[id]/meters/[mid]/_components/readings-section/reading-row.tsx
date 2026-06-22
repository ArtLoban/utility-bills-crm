"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { SubmitReadingModal } from "@/features/readings/components/submit-reading-modal";
import { formatReadingValue } from "@/features/readings/format";
import { formatDisplayDate } from "@/lib/format/date";
import type { TReading } from "@/lib/db/schema/readings";
import type { TMeter } from "@/lib/db/schema/meters";
import type { TServiceType } from "@/lib/db/schema/service-types";

type TProps = {
  reading: TReading;
  meter: TMeter;
  serviceType: TServiceType;
  propertyName: string;
  lastReadingBeforeThis: TReading | null;
  canMutate: boolean;
};

export const ReadingRow = ({
  reading,
  meter,
  serviceType,
  propertyName,
  lastReadingBeforeThis,
  canMutate,
}: TProps) => {
  const t = useTranslations("meters.detail.readings");
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
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
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={() => setEditOpen(true)}
              aria-label={t("edit")}
            >
              <Pencil className="size-3.5" strokeWidth={1.75} />
            </Button>
          )}
        </TableCell>
      </TableRow>

      {canMutate && (
        <SubmitReadingModal
          open={editOpen}
          onOpenChange={setEditOpen}
          meter={meter}
          serviceType={serviceType}
          propertyName={propertyName}
          lastReading={lastReadingBeforeThis}
          reading={reading}
        />
      )}
    </>
  );
};
