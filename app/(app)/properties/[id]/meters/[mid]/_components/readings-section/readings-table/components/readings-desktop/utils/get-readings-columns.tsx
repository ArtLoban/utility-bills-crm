import type { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { DateCell } from "@/components/data-table/cells/date-cell";
import { UNIT_LABELS } from "@/lib/constants/zones";
import { READINGS_SORT_COLUMNS } from "@/features/readings/types";
import type { TMeter } from "@/lib/db/schema/meters";
import type { TReading } from "@/lib/db/schema/readings";
import type { TServiceType } from "@/lib/db/schema/service-types";

import { ReadingValueCell } from "../../reading-value-cell";
import { ReadingRowActions } from "../../reading-row-actions";

type TTranslateFn = ReturnType<typeof useTranslations<"meters.detail">>;

type TZoneColumn = {
  key: "valueT1" | "valueT2" | "valueT3";
  header: string;
};

export const getReadingsColumns = (
  t: TTranslateFn,
  meter: TMeter,
  serviceType: TServiceType,
  canMutate: boolean,
): ColumnDef<TReading>[] => {
  const unitLabel = serviceType.unit ? UNIT_LABELS[serviceType.unit] : "";
  const withUnit = (label: string) =>
    unitLabel ? t("series.withUnit", { label, unit: unitLabel }) : label;

  const zoneFields: TZoneColumn[] =
    meter.zoneCount === 1
      ? [{ key: "valueT1", header: t("series.value") }]
      : [
          { key: "valueT1", header: t("series.t1") },
          { key: "valueT2", header: t("series.t2") },
        ];

  if (meter.zoneCount === 3) zoneFields.push({ key: "valueT3", header: t("series.t3") });

  const valueColumns = zoneFields.map(
    ({ key, header }): ColumnDef<TReading> => ({
      id: key,
      header: withUnit(header),
      enableSorting: false,
      cell: ({ row }) => <ReadingValueCell value={row.original[key]} />,
    }),
  );

  return [
    {
      id: READINGS_SORT_COLUMNS.READ_AT,
      accessorFn: (row) => row.readAt,
      header: t("readings.columns.date"),
      cell: ({ row }) => <DateCell value={row.original.readAt} />,
      enableSorting: true,
    },
    ...valueColumns,
    {
      id: "notes",
      accessorFn: (row) => row.notes,
      header: t("readings.columns.notes"),
      enableSorting: false,
      cell: ({ row }) => (
        <span className="text-muted-foreground block max-w-48 truncate">
          {row.original.notes ?? ""}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <ReadingRowActions reading={row.original} meter={meter} canMutate={canMutate} />
      ),
      meta: { align: "center", width: 64 },
    },
  ];
};
