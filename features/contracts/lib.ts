// Internal helpers shared between contracts/actions.ts and future Stage 5 composite action.
// Not a "use server" file — these are plain functions, not Next.js server action endpoints.

import { contracts } from "@/lib/db/schema/contracts";
import type { TContract } from "@/lib/db/schema/contracts";
import type { ProviderId } from "@/lib/db/schema/providers";
import type { TServiceId } from "@/lib/db/schema/services";
import type { DB } from "@/lib/db/client";

// Stage 5 will import insertContractInternal with a shared tx that also covers
// service + tariff + meter creation in one atomic operation.
export type TDbTransaction = Parameters<Parameters<DB["transaction"]>[0]>[0];

export const insertContractInternal = async (
  tx: TDbTransaction,
  data: {
    serviceId: TServiceId;
    providerId: ProviderId;
    validFrom: Date;
    validTo?: Date | null;
    notes?: string | null;
  },
): Promise<TContract> => {
  const [contract] = await tx
    .insert(contracts)
    .values({
      serviceId: data.serviceId,
      providerId: data.providerId,
      validFrom: data.validFrom,
      validTo: data.validTo ?? null,
      notes: data.notes ?? null,
    })
    .returning();
  return contract!;
};
