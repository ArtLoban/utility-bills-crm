import { accountNumbers } from "@/lib/db/schema/account-numbers";
import type { TAccountNumber } from "@/lib/db/schema/account-numbers";
import type { TContractId } from "@/lib/db/schema/contracts";
import type { DB } from "@/lib/db/client";

export type TDbTransaction = Parameters<Parameters<DB["transaction"]>[0]>[0];

export const insertAccountNumberInternal = async (
  tx: TDbTransaction,
  data: {
    contractId: TContractId;
    value: string;
    validFrom: Date;
    validTo?: Date | null;
    notes?: string | null;
  },
): Promise<TAccountNumber> => {
  const [record] = await tx
    .insert(accountNumbers)
    .values({
      contractId: data.contractId,
      value: data.value,
      validFrom: data.validFrom,
      validTo: data.validTo ?? null,
      notes: data.notes ?? null,
    })
    .returning();
  return record!;
};
