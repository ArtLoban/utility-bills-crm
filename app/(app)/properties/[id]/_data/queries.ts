import { cache } from "react";

import { requireUser } from "@/lib/auth/guards";
import { propertyByIdForUser } from "@/lib/db/access/properties";
import type { PropertyId, TProperty, TPropertyRole } from "@/lib/db/schema/properties";
import { NotFoundError, ok } from "@/lib/errors";
import type { Result } from "@/lib/errors";

// Named by screen purpose, not field composition (per DATA_MODEL.md type naming convention).
// Tab content (Overview / Meters / Sharing) and service list are added in later steps.
export type TPropertyDetail = TProperty & {
  role: TPropertyRole;
};

export const getPropertyDetail = cache(
  async (propertyId: PropertyId): Promise<Result<TPropertyDetail, NotFoundError>> => {
    const userId = await requireUser();
    const result = await propertyByIdForUser(userId, propertyId);
    if (!result.ok) return result;

    return ok({ ...result.value.property, role: result.value.role });
  },
);
