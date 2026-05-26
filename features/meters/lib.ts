// Internal helpers shared between meters/actions.ts and the future Stage 5.3 composite action.
// Not a "use server" file — these are plain functions, not Next.js server action endpoints.

import { meters } from "@/lib/db/schema/meters";
import type { TMeter, MeterId } from "@/lib/db/schema/meters";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { TServiceTypeId } from "@/lib/db/schema/service-types";
// Stage 5.3 will import insertMeterInternal with a shared tx covering service + contract + meter.
import type { TDbTransaction } from "@/features/tariffs/lib";

export const insertMeterInternal = async (
  tx: TDbTransaction,
  data: {
    propertyId: PropertyId;
    serviceTypeId: TServiceTypeId;
    serialNumber?: string | null;
    zoneCount: 1 | 2 | 3;
    installedAt?: Date | null;
    validFrom: Date;
    validTo?: Date | null;
    notes?: string | null;
  },
): Promise<TMeter> => {
  const [meter] = await tx
    .insert(meters)
    .values({
      propertyId: data.propertyId,
      serviceTypeId: data.serviceTypeId,
      serialNumber: data.serialNumber ?? null,
      zoneCount: data.zoneCount,
      installedAt: data.installedAt ?? null,
      validFrom: data.validFrom,
      validTo: data.validTo ?? null,
      notes: data.notes ?? null,
    })
    .returning();
  return meter!;
};

export type { TDbTransaction, MeterId };
