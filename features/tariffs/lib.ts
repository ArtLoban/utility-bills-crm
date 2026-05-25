// Internal helpers shared between tariffs/actions.ts and the future Stage 5 composite action.
// Not a "use server" file — these are plain functions, not Next.js server action endpoints.

import { tariffs } from "@/lib/db/schema/tariffs";
import type { TTariff } from "@/lib/db/schema/tariffs";
import type { TContractId } from "@/lib/db/schema/contracts";
import type { DB } from "@/lib/db/client";

// Stage 5 will import insertTariffInternal with a shared tx that also covers
// service + contract + meter creation in one atomic operation.
export type TDbTransaction = Parameters<Parameters<DB["transaction"]>[0]>[0];

export const insertTariffInternal = async (
  tx: TDbTransaction,
  data: {
    contractId: TContractId;
    rateT1?: string | null;
    rateT2?: string | null;
    rateT3?: string | null;
    fixedAmount?: string | null;
    validFrom: Date;
    validTo?: Date | null;
    notes?: string | null;
  },
): Promise<TTariff> => {
  const [tariff] = await tx
    .insert(tariffs)
    .values({
      contractId: data.contractId,
      rateT1: data.rateT1 ?? null,
      rateT2: data.rateT2 ?? null,
      rateT3: data.rateT3 ?? null,
      fixedAmount: data.fixedAmount ?? null,
      validFrom: data.validFrom,
      validTo: data.validTo ?? null,
      notes: data.notes ?? null,
    })
    .returning();
  return tariff!;
};
