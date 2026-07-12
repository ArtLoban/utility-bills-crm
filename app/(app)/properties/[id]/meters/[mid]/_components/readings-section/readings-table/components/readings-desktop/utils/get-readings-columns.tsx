import type { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { DateCell } from "@/components/data-table/cells/date-cell";
import { TextCell } from "@/components/data-table/cells/text-cell";
import { UNIT_LABELS, ZONE_SHORT_TAGS } from "@/lib/constants/zones";
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
    unitLabel ? t("readings.columns.valueWithUnit", { label, unit: unitLabel }) : label;

  const zoneFields: TZoneColumn[] =
    meter.zoneCount === 1
      ? [{ key: "valueT1", header: t("series.value") }]
      : [
          { key: "valueT1", header: ZONE_SHORT_TAGS[0] },
          { key: "valueT2", header: ZONE_SHORT_TAGS[1] },
        ];

  if (meter.zoneCount === 3) zoneFields.push({ key: "valueT3", header: ZONE_SHORT_TAGS[2] });

  const valueColumns = zoneFields.map(
    ({ key, header }): ColumnDef<TReading> => ({
      id: key,
      header: withUnit(header),
      enableSorting: false,
      cell: ({ row }) => <ReadingValueCell value={row.original[key]} />,
      meta: { width: 140 },
    }),
  );

  return [
    {
      id: READINGS_SORT_COLUMNS.READ_AT,
      accessorFn: (row) => row.readAt,
      header: t("readings.columns.date"),
      cell: ({ row }) => <DateCell value={row.original.readAt} />,
      enableSorting: true,
      meta: { width: 120 },
    },
    ...valueColumns,
    {
      id: "notes",
      accessorFn: (row) => row.notes,
      header: t("readings.columns.notes"),
      enableSorting: false,
      cell: ({ row }) => <TextCell value={row.original.notes} className="max-w-64" />,
    },
    {
      id: "actions",
      header: t("readings.columns.actions"),
      enableSorting: false,
      cell: ({ row }) => (
        <ReadingRowActions reading={row.original} meter={meter} canMutate={canMutate} />
      ),
      meta: { align: "center", width: 100 },
    },
  ];
};
