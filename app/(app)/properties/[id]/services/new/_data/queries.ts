import { asc, eq } from "drizzle-orm";

import { requireUser } from "@/lib/auth/guards";
import { db } from "@/lib/db/client";
import { servicesByPropertyId } from "@/lib/db/access/services";
import { providersByUserId } from "@/lib/db/access/providers";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { TProvider } from "@/lib/db/schema/providers";
import { serviceTypes } from "@/lib/db/schema/service-types";
import type { TServiceType, TServiceTypeId } from "@/lib/db/schema/service-types";
import { NotFoundError, ok } from "@/lib/errors";
import type { Result, TAppError } from "@/lib/errors";

export type TAddServicePageData = {
  allServiceTypes: TServiceType[];
  existingTypeIds: TServiceTypeId[];
  providers: TProvider[];
};

export const getAddServicePageData = async (
  propertyId: PropertyId,
): Promise<Result<TAddServicePageData, TAppError>> => {
  const userId = await requireUser();

  const [allServiceTypes, existingResult, providers] = await Promise.all([
    db
      .select()
      .from(serviceTypes)
      .where(eq(serviceTypes.isActive, true))
      .orderBy(asc(serviceTypes.sortOrder)),
    servicesByPropertyId(userId, propertyId),
    providersByUserId(userId),
  ]);

  if (!existingResult.ok) return existingResult;

  const existingTypeIds = existingResult.value.map(({ service }) => service.serviceTypeId);

  return ok({ allServiceTypes, existingTypeIds, providers });
};
