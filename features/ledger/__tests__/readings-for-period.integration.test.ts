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
import type { MeterId } from "@/lib/db/schema/meters";
import { meterServices } from "@/lib/db/schema/meter-services";
import { readings } from "@/lib/db/schema/readings";

import { readingPairsForPeriod } from "../query";

// readingPairsForPeriod supplies the reading basis for the expected-amount hint. It resolves the
// service's meters through the explicit meter↔service link (Slice B3) and returns one pair per
// active meter — so with two meters of a type it disambiguates which feed a given service, and a
// service fed by several meters yields a pair for each (the hint aggregates over all of them).

let userId: UserId;
let propertyId: PropertyId;
let electricityTypeId: TServiceTypeId;
let gasTypeId: TServiceTypeId;

let serviceA: TServiceId; // fed by meter A only
let serviceB: TServiceId; // fed by meter B only
let serviceBoth: TServiceId; // fed by two meters
let gasServiceNoMeter: TServiceId; // no linked meter

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
      .values({ email: "readings-for-period-test@test.invalid", name: "Readings For Period Test" })
      .returning({ id: users.id })
  )[0]!.id;

  propertyId = (
    await db
      .insert(properties)
      .values({ name: "Readings For Period Property", type: "apartment" })
      .returning({ id: properties.id })
  )[0]!.id;

  await db
    .insert(propertyAccess)
    .values({ propertyId, userId, propertyRole: PROPERTY_ROLES.OWNER, grantedBy: userId });

  const svcs = await db
    .insert(services)
    .values([
      { propertyId, serviceTypeId: electricityTypeId, name: "Main" },
      { propertyId, serviceTypeId: electricityTypeId, name: "Studio" },
      { propertyId, serviceTypeId: electricityTypeId, name: "Both" },
      { propertyId, serviceTypeId: gasTypeId, name: "Gas" },
    ])
    .returning({ id: services.id, serviceTypeId: services.serviceTypeId, name: services.name });

  serviceA = svcs.find((s) => s.name === "Main")!.id;
  serviceB = svcs.find((s) => s.name === "Studio")!.id;
  serviceBoth = svcs.find((s) => s.name === "Both")!.id;
  gasServiceNoMeter = svcs.find((s) => s.serviceTypeId === gasTypeId)!.id;

  // Four active electricity meters on one property — allowed since Slice B1.
  const ms = await db
    .insert(meters)
    .values(
      ["RFP-A", "RFP-B", "RFP-C1", "RFP-C2"].map((serialNumber) => ({
        propertyId,
        serviceTypeId: electricityTypeId,
        zoneCount: 1 as const,
        validFrom: new Date("2025-01-01T00:00:00Z"),
        serialNumber,
      })),
    )
    .returning({ id: meters.id });

  const [meterA, meterB, meterC1, meterC2] = ms.map((m) => m.id);

  await db.insert(meterServices).values([
    { meterId: meterA!, serviceId: serviceA },
    { meterId: meterB!, serviceId: serviceB },
    // serviceBoth is fed by two distinct meters.
    { meterId: meterC1!, serviceId: serviceBoth },
    { meterId: meterC2!, serviceId: serviceBoth },
  ]);

  // Distinct value ranges so a returned pair unambiguously identifies its meter.
  const r = (meterId: MeterId, readAt: string, valueT1: number) => ({
    meterId,
    readAt: new Date(readAt),
    valueT1: String(valueT1),
    createdBy: userId,
  });
  await db
    .insert(readings)
    .values([
      r(meterA!, "2025-01-15T10:00:00Z", 100),
      r(meterA!, "2025-02-15T10:00:00Z", 150),
      r(meterB!, "2025-01-15T10:00:00Z", 900),
      r(meterB!, "2025-02-15T10:00:00Z", 999),
      r(meterC1!, "2025-01-15T10:00:00Z", 10),
      r(meterC1!, "2025-02-15T10:00:00Z", 40),
      r(meterC2!, "2025-01-15T10:00:00Z", 200),
      r(meterC2!, "2025-02-15T10:00:00Z", 260),
    ]);
});

afterAll(async () => {
  await db.delete(properties).where(inArray(properties.id, [propertyId]));
  await db.delete(users).where(inArray(users.id, [userId]));
});

describe("readingPairsForPeriod — reading basis via the explicit link (Slice B3)", () => {
  it("returns service A's own linked meter, not the other same-type meter", async () => {
    const pairs = await readingPairsForPeriod(serviceA, "2025-02-28");
    expect(pairs).toHaveLength(1);
    expect(parseFloat(pairs[0]!.curr!.valueT1)).toBe(150);
    expect(parseFloat(pairs[0]!.prev!.valueT1)).toBe(100);
  });

  it("returns service B's own linked meter, disambiguating two meters of one type", async () => {
    const pairs = await readingPairsForPeriod(serviceB, "2025-02-28");
    expect(pairs).toHaveLength(1);
    expect(parseFloat(pairs[0]!.curr!.valueT1)).toBe(999);
    expect(parseFloat(pairs[0]!.prev!.valueT1)).toBe(900);
  });

  it("returns a pair for every meter when a service is fed by more than one", async () => {
    const pairs = await readingPairsForPeriod(serviceBoth, "2025-02-28");
    expect(pairs).toHaveLength(2);
    // Both meters' current readings are present — the basis covers all of them, not one.
    const currents = pairs.map((p) => parseFloat(p.curr!.valueT1)).sort((a, b) => a - b);
    expect(currents).toEqual([40, 260]);
  });

  it("returns an empty list when the service has no linked meter", async () => {
    const pairs = await readingPairsForPeriod(gasServiceNoMeter, "2025-02-28");
    expect(pairs).toEqual([]);
  });
});
