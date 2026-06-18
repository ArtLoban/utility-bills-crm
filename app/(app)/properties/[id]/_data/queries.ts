import { cache } from "react";

import { requireUser } from "@/lib/auth/guards";
import { propertyByIdForUser } from "@/lib/db/access/properties";
import type { PropertyId, TProperty, TPropertyRole } from "@/lib/db/schema/properties";
import { NotFoundError, ok } from "@/lib/errors";
import type { Result, TAppError } from "@/lib/errors";
import { serviceCountsForProperties } from "@/features/services/query";

export type TPropertyDetail = TProperty & {
  role: TPropertyRole;
  serviceCount: number;
};

export const getPropertyDetail = cache(
  async (propertyId: PropertyId): Promise<Result<TPropertyDetail, TAppError>> => {
    const userId = await requireUser();
    const result = await propertyByIdForUser(userId, propertyId);
    if (!result.ok) return result;

    const serviceCounts = await serviceCountsForProperties([propertyId]);

    return ok({
      ...result.value.property,
      role: result.value.role,
      serviceCount: serviceCounts.get(propertyId) ?? 0,
    });
  },
);
