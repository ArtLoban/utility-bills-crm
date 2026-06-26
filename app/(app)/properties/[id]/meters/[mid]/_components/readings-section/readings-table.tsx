"use client";

import { useTranslations } from "next-intl";

import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UNIT_LABELS } from "@/lib/constants/zones";
import type { TReading } from "@/lib/db/schema/readings";
import type { TMeter } from "@/lib/db/schema/meters";
import type { TServiceType } from "@/lib/db/schema/service-types";
import { ReadingRow } from "./reading-row";

type TProps = {
  readings: TReading[];
  meter: TMeter;
  serviceType: TServiceType;
  canMutate: boolean;
};

const HEAD_CLASS = "text-muted-foreground px-4 text-xs font-medium tracking-wide uppercase";

export const ReadingsTable = ({ readings, meter, serviceType, canMutate }: TProps) => {
  const t = useTranslations("meters.detail");
  const unitLabel = serviceType.unit ? UNIT_LABELS[serviceType.unit] : "";
  const withUnit = (label: string) =>
    unitLabel ? t("series.withUnit", { label, unit: unitLabel }) : label;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className={HEAD_CLASS}>{t("readings.columns.date")}</TableHead>
          {meter.zoneCount === 1 ? (
            <TableHead className={HEAD_CLASS}>{withUnit(t("series.value"))}</TableHead>
          ) : (
            <>
              <TableHead className={HEAD_CLASS}>{withUnit(t("series.t1"))}</TableHead>
              <TableHead className={HEAD_CLASS}>{withUnit(t("series.t2"))}</TableHead>
              {meter.zoneCount === 3 && (
                <TableHead className={HEAD_CLASS}>{withUnit(t("series.t3"))}</TableHead>
              )}
            </>
          )}
          <TableHead className={HEAD_CLASS}>{t("readings.columns.notes")}</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {readings.map((reading) => (
          <ReadingRow key={reading.id} reading={reading} meter={meter} canMutate={canMutate} />
        ))}
      </TableBody>
    </Table>
  );
};
