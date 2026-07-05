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

import { readingsForPeriod } from "../query";

// readingsForPeriod resolves the reading pair for the expected-amount hint. Slice B3 moves that
// resolution onto the explicit meter↔service link: with two meters of the same type on a property,
// it must return the readings of the meter linked to *this* service, not an arbitrary same-type one.

let userId: UserId;
let propertyId: PropertyId;
let electricityTypeId: TServiceTypeId;
let gasTypeId: TServiceTypeId;

let serviceA: TServiceId; // fed by meter A
let serviceB: TServiceId; // fed by meter B
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
      { propertyId, serviceTypeId: gasTypeId, name: "Gas" },
    ])
    .returning({ id: services.id, serviceTypeId: services.serviceTypeId, name: services.name });

  serviceA = svcs.find((s) => s.name === "Main")!.id;
  serviceB = svcs.find((s) => s.name === "Studio")!.id;
  gasServiceNoMeter = svcs.find((s) => s.serviceTypeId === gasTypeId)!.id;

  // Two active electricity meters on one property — allowed since Slice B1.
  const ms = await db
    .insert(meters)
    .values([
      {
        propertyId,
        serviceTypeId: electricityTypeId,
        zoneCount: 1,
        validFrom: new Date("2025-01-01T00:00:00Z"),
        serialNumber: "RFP-A",
      },
      {
        propertyId,
        serviceTypeId: electricityTypeId,
        zoneCount: 1,
        validFrom: new Date("2025-01-01T00:00:00Z"),
        serialNumber: "RFP-B",
      },
    ])
    .returning({ id: meters.id });

  const meterA = ms[0]!.id;
  const meterB = ms[1]!.id;

  await db.insert(meterServices).values([
    { meterId: meterA, serviceId: serviceA },
    { meterId: meterB, serviceId: serviceB },
  ]);

  // Distinct value ranges so the returned pair unambiguously identifies its meter.
  await db.insert(readings).values([
    {
      meterId: meterA,
      readAt: new Date("2025-01-15T10:00:00Z"),
      valueT1: "100",
      createdBy: userId,
    },
    {
      meterId: meterA,
      readAt: new Date("2025-02-15T10:00:00Z"),
      valueT1: "150",
      createdBy: userId,
    },
    {
      meterId: meterB,
      readAt: new Date("2025-01-15T10:00:00Z"),
      valueT1: "900",
      createdBy: userId,
    },
    {
      meterId: meterB,
      readAt: new Date("2025-02-15T10:00:00Z"),
      valueT1: "999",
      createdBy: userId,
    },
  ]);
});

afterAll(async () => {
  await db.delete(properties).where(inArray(properties.id, [propertyId]));
  await db.delete(users).where(inArray(users.id, [userId]));
});

describe("readingsForPeriod — resolves the meter via the explicit link (Slice B3)", () => {
  it("returns the linked meter's pair for service A, not the other same-type meter", async () => {
    const { curr, prev } = await readingsForPeriod(serviceA, "2025-02-28");
    expect(curr).not.toBeNull();
    expect(prev).not.toBeNull();
    expect(parseFloat(curr!.valueT1)).toBe(150);
    expect(parseFloat(prev!.valueT1)).toBe(100);
  });

  it("returns service B's own linked meter, disambiguating two meters of one type", async () => {
    const { curr, prev } = await readingsForPeriod(serviceB, "2025-02-28");
    expect(parseFloat(curr!.valueT1)).toBe(999);
    expect(parseFloat(prev!.valueT1)).toBe(900);
  });

  it("returns a null pair when the service has no linked meter", async () => {
    const pair = await readingsForPeriod(gasServiceNoMeter, "2025-02-28");
    expect(pair).toEqual({ curr: null, prev: null });
  });
});
