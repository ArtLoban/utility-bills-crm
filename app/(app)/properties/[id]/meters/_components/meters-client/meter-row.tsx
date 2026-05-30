"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { IconBadge } from "@/components/icon-badge";
import type { TMeter } from "@/lib/db/schema/meters";
import type { TServiceType } from "@/lib/db/schema/service-types";
import { getServiceTypeVisuals, TServiceTypeCode } from "@/features/services/service-type";

type TProps = {
  meter: TMeter;
  serviceType: TServiceType;
  propertyId: string;
  canMutate: boolean;
};

const ZONE_LABELS: Record<number, string> = {
  1: "Single zone",
  2: "Two zones",
  3: "Three zones",
};

const MeterRow = ({ meter, serviceType, propertyId, canMutate }: TProps) => {
  const router = useRouter();
  const { color, Icon } = getServiceTypeVisuals(serviceType.code as TServiceTypeCode);
  const isHistorical = meter.validTo !== null;

  return (
    <div
      className="flex items-center gap-3.5 rounded-lg border border-zinc-200 bg-white px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900"
      style={{ boxShadow: "0 1px 2px rgba(24,24,27,0.04)" }}
    >
      <IconBadge icon={Icon} color={color} />

      <Link
        href={`/properties/${propertyId}/meters/${meter.id}`}
        className="min-w-0 flex-1 no-underline"
      >
        <p
          className="font-medium text-zinc-950 dark:text-zinc-50"
          style={{ fontSize: 13.5, marginBottom: 2 }}
        >
          {serviceType.code.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} meter
          {isHistorical && (
            <span
              className="ml-2 rounded text-zinc-400 dark:text-zinc-500"
              style={{ fontSize: 11, fontWeight: 500 }}
            >
              Historical
            </span>
          )}
        </p>
        <p className="text-zinc-500 dark:text-zinc-400" style={{ fontSize: 12 }}>
          {ZONE_LABELS[meter.zoneCount] ?? `${meter.zoneCount} zones`}
          {meter.serialNumber && (
            <>
              <span className="mx-1.5 text-zinc-300 dark:text-zinc-700">·</span>
              <span style={{ fontFamily: "ui-monospace, monospace" }}>{meter.serialNumber}</span>
            </>
          )}
        </p>
      </Link>

      {canMutate && !isHistorical && (
        <button
          onClick={() => router.push(`/properties/${propertyId}/meters/${meter.id}/replace`)}
          className="shrink-0 cursor-pointer rounded-md border border-zinc-200 bg-transparent text-xs font-medium text-zinc-500 hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-50"
          style={{ height: 28, padding: "0 10px" }}
        >
          Replace
        </button>
      )}
    </div>
  );
};

export { MeterRow };
