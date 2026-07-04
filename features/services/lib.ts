// Internal helpers shared between services/actions.ts and the Stage 5.3 composite action.
// Not a "use server" file — these are plain functions, not Next.js server action endpoints.

import { services } from "@/lib/db/schema/services";
import type { TService } from "@/lib/db/schema/services";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { TServiceTypeId } from "@/lib/db/schema/service-types";
import type { TDbTransaction } from "@/features/contracts/lib";

export const insertServiceInternal = async (
  tx: TDbTransaction,
  data: {
    propertyId: PropertyId;
    serviceTypeId: TServiceTypeId;
    name?: string | null;
    notes?: string | null;
  },
): Promise<TService> => {
  const [service] = await tx
    .insert(services)
    .values({
      propertyId: data.propertyId,
      serviceTypeId: data.serviceTypeId,
      name: data.name ?? null,
      notes: data.notes ?? null,
    })
    .returning();
  return service!;
};

export type { TDbTransaction };
