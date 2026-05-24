import { asc, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { servicesByPropertyId } from "@/lib/db/access/services";
import type { UserId } from "@/lib/db/schema/auth";
import type { PropertyId } from "@/lib/db/schema/properties";
import { serviceTypes } from "@/lib/db/schema/service-types";
import type { TServiceType, TServiceTypeId } from "@/lib/db/schema/service-types";
import { NotFoundError, err, ok } from "@/lib/errors";
import type { Result } from "@/lib/errors";

export type TAddServicePageData = {
  allServiceTypes: TServiceType[];
  existingTypeIds: TServiceTypeId[];
};

export const getAddServicePageData = async (
  propertyId: PropertyId,
): Promise<Result<TAddServicePageData, NotFoundError>> => {
  const session = await auth();
  if (!session?.user.id) return err(new NotFoundError("property", propertyId));

  const userId = session.user.id as UserId;

  const [allServiceTypes, existingResult] = await Promise.all([
    db
      .select()
      .from(serviceTypes)
      .where(eq(serviceTypes.isActive, true))
      .orderBy(asc(serviceTypes.sortOrder)),
    servicesByPropertyId(userId, propertyId),
  ]);

  if (!existingResult.ok) return existingResult;

  const existingTypeIds = existingResult.value.map(({ service }) => service.serviceTypeId);

  return ok({ allServiceTypes, existingTypeIds });
};
