import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { inArray } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema/auth";
import type { UserId } from "@/lib/db/schema/auth";
import { properties, propertyAccess, PROPERTY_ROLES } from "@/lib/db/schema/properties";
import type { PropertyId } from "@/lib/db/schema/properties";
import { services } from "@/lib/db/schema/services";
import type { TServiceId } from "@/lib/db/schema/services";
import { serviceTypes } from "@/lib/db/schema/service-types";
import type { TServiceTypeId } from "@/lib/db/schema/service-types";
import { meters } from "@/lib/db/schema/meters";
import { meterServices } from "@/lib/db/schema/meter-services";
import { readings } from "@/lib/db/schema/readings";

import { lastReadingDatesByService } from "../readings";

// lastReadingDatesByService keys the "last reading" per service through the explicit meter↔service
// link (Slice B3), not by shared service type: two services of one type fed by different meters get
// their own dates; a single meter feeding two services gives both the same date.

let userId: UserId;
let propertyId: PropertyId;
let electricityTypeId: TServiceTypeId;
let gasTypeId: TServiceTypeId;

let serviceA: TServiceId; // own meter, read 2025-02-10
let serviceB: TServiceId; // own meter, read 2025-03-20
let serviceC: TServiceId; // shares a meter with D, read 2025-01-05
let serviceD: TServiceId; // shares a meter with C

const iso = (date: Date | undefined): string | undefined => date?.toISOString().slice(0, 10);

beforeAll(async () => {
  const sts = await db
    .select({ id: serviceTypes.id, code: serviceTypes.code })
    .from(serviceTypes)
    .where(inArray(serviceTypes.code, ["electricity", "gas"]));
  electricityTypeId = sts.find((s) => s.code === "electricity")!.id;
  gasTypeId = sts.find((s) => s.code === "gas")!.id;

  userId = (
    await db
      .insert(users)
      .values({
        email: "last-reading-by-service-test@test.invalid",
        name: "Last Reading By Service",
      })
      .returning({ id: users.id })
  )[0]!.id;

  propertyId = (
    await db
      .insert(properties)
      .values({ name: "Last Reading By Service Property", type: "apartment" })
      .returning({ id: properties.id })
  )[0]!.id;

  await db
    .insert(propertyAccess)
    .values({ propertyId, userId, propertyRole: PROPERTY_ROLES.OWNER, grantedBy: userId });

  const svcs = await db
    .insert(services)
    .values([
      { propertyId, serviceTypeId: electricityTypeId, name: "A" },
      { propertyId, serviceTypeId: electricityTypeId, name: "B" },
      { propertyId, serviceTypeId: gasTypeId, name: "C" },
      { propertyId, serviceTypeId: gasTypeId, name: "D" },
    ])
    .returning({ id: services.id, name: services.name });
  serviceA = svcs.find((s) => s.name === "A")!.id;
  serviceB = svcs.find((s) => s.name === "B")!.id;
  serviceC = svcs.find((s) => s.name === "C")!.id;
  serviceD = svcs.find((s) => s.name === "D")!.id;

  const ms = await db
    .insert(meters)
    .values([
      {
        propertyId,
        serviceTypeId: electricityTypeId,
        zoneCount: 1,
        validFrom: new Date("2025-01-01T00:00:00Z"),
        serialNumber: "LR-A",
      },
      {
        propertyId,
        serviceTypeId: electricityTypeId,
        zoneCount: 1,
        validFrom: new Date("2025-01-01T00:00:00Z"),
        serialNumber: "LR-B",
      },
      {
        propertyId,
        serviceTypeId: gasTypeId,
        zoneCount: 1,
        validFrom: new Date("2025-01-01T00:00:00Z"),
        serialNumber: "LR-CD",
      },
    ])
    .returning({ id: meters.id });
  const meterA = ms[0]!.id;
  const meterB = ms[1]!.id;
  const meterCD = ms[2]!.id;

  await db.insert(meterServices).values([
    { meterId: meterA, serviceId: serviceA },
    { meterId: meterB, serviceId: serviceB },
    { meterId: meterCD, serviceId: serviceC },
    { meterId: meterCD, serviceId: serviceD },
  ]);

  await db.insert(readings).values([
    { meterId: meterA, readAt: new Date("2025-01-10T10:00:00Z"), valueT1: "10", createdBy: userId },
    { meterId: meterA, readAt: new Date("2025-02-10T10:00:00Z"), valueT1: "20", createdBy: userId },
    { meterId: meterB, readAt: new Date("2025-03-20T10:00:00Z"), valueT1: "30", createdBy: userId },
    { meterId: meterCD, readAt: new Date("2025-01-05T10:00:00Z"), valueT1: "5", createdBy: userId },
  ]);
});

afterAll(async () => {
  await db.delete(properties).where(inArray(properties.id, [propertyId]));
  await db.delete(users).where(inArray(users.id, [userId]));
});

describe("lastReadingDatesByService (Slice B3)", () => {
  it("gives two same-type services fed by different meters their own dates", async () => {
    const map = await lastReadingDatesByService(propertyId);
    expect(iso(map.get(serviceA))).toBe("2025-02-10");
    expect(iso(map.get(serviceB))).toBe("2025-03-20");
  });

  it("gives both services sharing one meter that meter's date", async () => {
    const map = await lastReadingDatesByService(propertyId);
    expect(iso(map.get(serviceC))).toBe("2025-01-05");
    expect(iso(map.get(serviceD))).toBe("2025-01-05");
  });
});
