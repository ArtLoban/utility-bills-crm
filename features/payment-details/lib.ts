import { paymentDetails } from "@/lib/db/schema/payment-details";
import type { TPaymentDetails } from "@/lib/db/schema/payment-details";
import type { TContractId } from "@/lib/db/schema/contracts";
import type { DB } from "@/lib/db/client";

export type TDbTransaction = Parameters<Parameters<DB["transaction"]>[0]>[0];

export const insertPaymentDetailsInternal = async (
  tx: TDbTransaction,
  data: {
    contractId: TContractId;
    details: string;
    validFrom: Date;
    validTo?: Date | null;
    notes?: string | null;
  },
): Promise<TPaymentDetails> => {
  const [record] = await tx
    .insert(paymentDetails)
    .values({
      contractId: data.contractId,
      details: data.details,
      validFrom: data.validFrom,
      validTo: data.validTo ?? null,
      notes: data.notes ?? null,
    })
    .returning();
  return record!;
};
