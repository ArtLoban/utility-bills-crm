import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { inArray } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema/auth";
import type { UserId } from "@/lib/db/schema/auth";
import { properties, propertyAccess, PROPERTY_ROLES } from "@/lib/db/schema/properties";
import type { PropertyId } from "@/lib/db/schema/properties";
import { services } from "@/lib/db/schema/services";
import { serviceTypes } from "@/lib/db/schema/service-types";
import type { TServiceTypeId } from "@/lib/db/schema/service-types";
import { meters } from "@/lib/db/schema/meters";
import type { MeterId } from "@/lib/db/schema/meters";
import { readings } from "@/lib/db/schema/readings";

import { missingCurrentMonthReadings } from "../reads";

// Service types are seeded via migration — look up by code.
let electricityTypeId: TServiceTypeId;

let userId: UserId;
let missingPropertyId: PropertyId; // two active electricity services + one active meter, no reading
let hasReadingPropertyId: PropertyId; // one service + one active meter WITH a current-month reading

let missingMeterId: MeterId;
let hasReadingMeterId: MeterId;

// A timestamp guaranteed to fall inside the current calendar month (UTC): the 15th at noon.
const currentMonthReadAt = (): Date => {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 15, 12, 0, 0));
};

beforeAll(async () => {
  electricityTypeId = (
    await db
      .select({ id: serviceTypes.id })
      .from(serviceTypes)
      .where(inArray(serviceTypes.code, ["electricity"]))
  )[0]!.id;

  userId = (
    await db
      .insert(users)
      .values({ email: "reads-fanout-test-user@test.invalid", name: "Reads Fanout Test User" })
      .returning({ id: users.id })
  )[0]!.id;

  const insertedProps = await db
    .insert(properties)
    .values([
      { name: "Reads Fanout Missing Property", type: "apartment" },
      { name: "Reads Fanout HasReading Property", type: "apartment" },
    ])
    .returning({ id: properties.id });

  missingPropertyId = insertedProps[0]!.id;
  hasReadingPropertyId = insertedProps[1]!.id;

  await db.insert(propertyAccess).values([
    {
      propertyId: missingPropertyId,
      userId,
      propertyRole: PROPERTY_ROLES.OWNER,
      grantedBy: userId,
    },
    {
      propertyId: hasReadingPropertyId,
      userId,
      propertyRole: PROPERTY_ROLES.OWNER,
      grantedBy: userId,
    },
  ]);

  // The regression: two active services of the SAME type on one property. Before the fix the
  // services→meters join fanned the single meter out into one row per service.
  await db.insert(services).values([
    { propertyId: missingPropertyId, serviceTypeId: electricityTypeId, name: "Main flat" },
    { propertyId: missingPropertyId, serviceTypeId: electricityTypeId, name: "Studio" },
    { propertyId: hasReadingPropertyId, serviceTypeId: electricityTypeId },
  ]);

  const insertedMeters = await db
    .insert(meters)
    .values([
      {
        propertyId: missingPropertyId,
        serviceTypeId: electricityTypeId,
        zoneCount: 1,
        validFrom: new Date("2024-01-01T00:00:00Z"),
        serialNumber: "RF-MISSING",
      },
      {
        propertyId: hasReadingPropertyId,
        serviceTypeId: electricityTypeId,
        zoneCount: 1,
        validFrom: new Date("2024-01-01T00:00:00Z"),
        serialNumber: "RF-HASREADING",
      },
    ])
    .returning({ id: meters.id });

  missingMeterId = insertedMeters[0]!.id;
  hasReadingMeterId = insertedMeters[1]!.id;

  // Positive control: this meter already has a reading this month → it must NOT be flagged.
  await db.insert(readings).values({
    meterId: hasReadingMeterId,
    readAt: currentMonthReadAt(),
    valueT1: "1000",
    createdBy: userId,
  });
});

afterAll(async () => {
  // Deleting properties cascades to services, meters, readings, propertyAccess.
  await db
    .delete(properties)
    .where(inArray(properties.id, [missingPropertyId, hasReadingPropertyId]));
  await db.delete(users).where(inArray(users.id, [userId]));
});

describe("missingCurrentMonthReadings — fan-out with multiple services of one type", () => {
  it("counts a meter with several same-type services once, and skips meters already read", async () => {
    const result = await missingCurrentMonthReadings(userId);

    // Only the missing-reading meter surfaces — exactly one row, not one per service.
    expect(result).toHaveLength(1);
    expect(result[0]!.meterId).toBe(missingMeterId);

    // Duplicate-free by meter.
    const meterIds = result.map((r) => r.meterId);
    expect(new Set(meterIds).size).toBe(meterIds.length);

    // The meter that already has a current-month reading is not a phantom entry.
    expect(meterIds).not.toContain(hasReadingMeterId);
  });
});
