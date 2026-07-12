import type { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { DateCell } from "@/components/data-table/cells/date-cell";
import { ServiceCell } from "@/components/data-table/cells/service-cell";
import type { TMeterGlobalRow } from "@/lib/db/access/meters";
import { METERS_SORT_COLUMNS } from "@/features/meters/types";

import { LastReadingCell } from "../../last-reading-cell";
import { MeterPropertyCell } from "../../meter-property-cell";
import { MeterRowActions } from "../../meter-row-actions";

type TTranslateFn = ReturnType<typeof useTranslations<"meters.list">>;

export const getMetersColumns = (
  t: TTranslateFn,
  showHistoricalBadge: boolean,
): ColumnDef<TMeterGlobalRow>[] => [
  {
    id: METERS_SORT_COLUMNS.PROPERTY,
    accessorFn: (row) => row.property.name,
    header: t("columns.property"),
    cell: ({ row }) => (
      <MeterPropertyCell row={row.original} showHistoricalBadge={showHistoricalBadge} />
    ),
    enableSorting: true,
  },
  {
    id: METERS_SORT_COLUMNS.SERVICE,
    accessorFn: (row) => row.serviceType.code,
    header: t("columns.service"),
    cell: ({ row }) => <ServiceCell type={row.original.serviceType.code} />,
    enableSorting: true,
  },
  {
    id: "serial",
    accessorFn: (row) => row.meter.serialNumber,
    header: t("columns.serial"),
    cell: ({ row }) => row.original.meter.serialNumber,
  },
  {
    id: "zones",
    accessorFn: (row) => row.meter.zoneCount,
    header: t("columns.zones"),
    cell: ({ row }) => t("zones.count", { count: row.original.meter.zoneCount }),
  },
  {
    id: METERS_SORT_COLUMNS.INSTALLED,
    accessorFn: (row) => row.meter.installedAt,
    header: t("columns.installed"),
    cell: ({ row }) => <DateCell value={row.original.meter.installedAt} />,
    enableSorting: true,
  },
  {
    id: "lastReading",
    accessorFn: (row) => row.lastReading?.readAt,
    header: t("columns.lastReading"),
    cell: ({ row }) => (
      <LastReadingCell
        lastReading={row.original.lastReading}
        zoneCount={row.original.meter.zoneCount}
      />
    ),
  },
  {
    id: "actions",
    header: t("columns.actions"),
    enableSorting: false,
    cell: ({ row }) => <MeterRowActions row={row.original} />,
    meta: { align: "center", width: 100 },
  },
];
