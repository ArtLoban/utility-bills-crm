// Internal helpers shared between meters/actions.ts and the future Stage 5.3 composite action.
// Not a "use server" file — these are plain functions, not Next.js server action endpoints.

import { meters } from "@/lib/db/schema/meters";
import type { TMeter, MeterId } from "@/lib/db/schema/meters";
import { meterServices } from "@/lib/db/schema/meter-services";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { TServiceId } from "@/lib/db/schema/services";
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

// Writes the explicit meter↔service links (Slice B2). Callers decide which services a meter feeds:
// the create form passes the user's selection, replacement inherits the closed meter's links, and
// the service-setup composite links the meter to the service it was created for. No-op on an empty
// list. The (meter, service) partial-unique index guards against duplicate active links.
export const insertMeterServiceLinks = async (
  tx: TDbTransaction,
  meterId: MeterId,
  serviceIds: TServiceId[],
): Promise<void> => {
  if (serviceIds.length === 0) return;
  await tx.insert(meterServices).values(serviceIds.map((serviceId) => ({ meterId, serviceId })));
};

export type { TDbTransaction, MeterId };
