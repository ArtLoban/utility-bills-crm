import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { meterByIdForUser } from "@/lib/db/access/meters";
import { readingsByMeterId, mostRecentReadingForMeter } from "@/lib/db/access/readings";
import type { MeterId, TMeter } from "@/lib/db/schema/meters";
import type { TReading } from "@/lib/db/schema/readings";
import { serviceTypes as serviceTypesTable } from "@/lib/db/schema/service-types";
import type { TServiceType } from "@/lib/db/schema/service-types";
import type { UserId } from "@/lib/db/schema/auth";
import { NotFoundError, err, ok } from "@/lib/errors";
import type { Result } from "@/lib/errors";

export type TMeterDetailData = {
  meter: TMeter;
  serviceType: TServiceType;
};

export const getMeterDetail = async (
  meterId: MeterId,
): Promise<Result<TMeterDetailData, NotFoundError>> => {
  const session = await auth();
  if (!session?.user?.id) return err(new NotFoundError("meter", meterId));

  const userId = session.user.id as UserId;
  const meterResult = await meterByIdForUser(userId, meterId);
  if (!meterResult.ok) return meterResult;

  const meter = meterResult.value;

  const [serviceType] = await db
    .select()
    .from(serviceTypesTable)
    .where(eq(serviceTypesTable.id, meter.serviceTypeId))
    .limit(1);

  if (!serviceType) return err(new NotFoundError("serviceType", meter.serviceTypeId));

  return ok({ meter, serviceType });
};

export const getMeterReadings = async (
  meterId: MeterId,
): Promise<Result<TReading[], NotFoundError>> => {
  const session = await auth();
  if (!session?.user?.id) return err(new NotFoundError("meter", meterId));

  const userId = session.user.id as UserId;
  return readingsByMeterId(userId, meterId);
};

export const getMostRecentReading = async (
  meterId: MeterId,
): Promise<Result<TReading | null, NotFoundError>> => {
  const session = await auth();
  if (!session?.user?.id) return err(new NotFoundError("meter", meterId));

  const userId = session.user.id as UserId;
  return mostRecentReadingForMeter(userId, meterId);
};
