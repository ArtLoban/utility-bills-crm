import { eq } from "drizzle-orm";

import { requireUser } from "@/lib/auth/guards";
import { db } from "@/lib/db/client";
import { meterByIdForUser } from "@/lib/db/access/meters";
import {
  readingsByMeterId,
  mostRecentReadingForMeter,
  previousReadingForMeter,
  readingByIdForUser,
} from "@/lib/db/access/readings";
import type { MeterId, TMeter } from "@/lib/db/schema/meters";
import type { ReadingId, TReading } from "@/lib/db/schema/readings";
import { serviceTypes as serviceTypesTable } from "@/lib/db/schema/service-types";
import type { TServiceType } from "@/lib/db/schema/service-types";
import { appError, err, ok } from "@/lib/errors";
import type { Result, TAppError } from "@/lib/errors";

export type TMeterDetailData = {
  meter: TMeter;
  serviceType: TServiceType;
};

export const getMeterDetail = async (
  meterId: MeterId,
): Promise<Result<TMeterDetailData, TAppError>> => {
  const userId = await requireUser();
  const meterResult = await meterByIdForUser(userId, meterId);
  if (!meterResult.ok) return meterResult;

  const meter = meterResult.value;

  const [serviceType] = await db
    .select()
    .from(serviceTypesTable)
    .where(eq(serviceTypesTable.id, meter.serviceTypeId))
    .limit(1);

  if (!serviceType) return err(appError.notFound("serviceType", meter.serviceTypeId));

  return ok({ meter, serviceType });
};

export const getMeterReadings = async (
  meterId: MeterId,
): Promise<Result<TReading[], TAppError>> => {
  const userId = await requireUser();

  return readingsByMeterId(userId, meterId);
};

export const getMostRecentReading = async (
  meterId: MeterId,
): Promise<Result<TReading | null, TAppError>> => {
  const userId = await requireUser();

  return mostRecentReadingForMeter(userId, meterId);
};

export const getReading = async (readingId: ReadingId): Promise<Result<TReading, TAppError>> => {
  const userId = await requireUser();

  return readingByIdForUser(userId, readingId);
};

export const getPreviousReading = async (
  meterId: MeterId,
  before: Date,
): Promise<Result<TReading | null, TAppError>> => {
  const userId = await requireUser();

  return previousReadingForMeter(userId, meterId, before);
};
