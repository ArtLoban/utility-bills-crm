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
import { meterServices } from "@/lib/db/schema/meter-services";
import { readings } from "@/lib/db/schema/readings";

import { availableConsumptionServiceTypes, monthlyConsumptionByService } from "../query";

// Service types are seeded via migration — look up by code.
let electricityTypeId: TServiceTypeId;
let gasTypeId: TServiceTypeId;

let userId: UserId;
let otherUserId: UserId;
let propertyId: PropertyId;
let otherPropertyId: PropertyId;

// Meter IDs for test cases
let elecMeter1Z: MeterId; // 1-zone electricity
let elecMeter2Z: MeterId; // 2-zone electricity
let otherPropMeter: MeterId; // other user's meter — must NOT appear
let replacedMeter: MeterId; // old meter in replacement test
let newMeter: MeterId; // new meter in replacement test

beforeAll(async () => {
  // --- Look up seeded service types ---
  const sts = await db
    .select({ id: serviceTypes.id, code: serviceTypes.code })
    .from(serviceTypes)
    .where(inArray(serviceTypes.code, ["electricity", "gas"]));

  electricityTypeId = sts.find((s) => s.code === "electricity")!.id;
  gasTypeId = sts.find((s) => s.code === "gas")!.id;

  // --- Users ---
  const insertedUsers = await db
    .insert(users)
    .values([
      { email: "meter-query-test-user@test.invalid", name: "Meter Query Test User" },
      { email: "meter-query-other-user@test.invalid", name: "Meter Query Other User" },
    ])
    .returning({ id: users.id });

  userId = insertedUsers[0]!.id;
  otherUserId = insertedUsers[1]!.id;

  // --- Properties ---
  const insertedProps = await db
    .insert(properties)
    .values([
      { name: "Meter Query Test Property", type: "apartment" },
      { name: "Meter Query Other Property", type: "house" },
    ])
    .returning({ id: properties.id });

  propertyId = insertedProps[0]!.id;
  otherPropertyId = insertedProps[1]!.id;

  // --- Property access ---
  await db.insert(propertyAccess).values([
    { propertyId, userId, propertyRole: PROPERTY_ROLES.OWNER, grantedBy: userId },
    {
      propertyId: otherPropertyId,
      userId: otherUserId,
      propertyRole: PROPERTY_ROLES.OWNER,
      grantedBy: otherUserId,
    },
  ]);

  // --- Services (consumption is attributed through the meter↔service link, Slice B3) ---
  const mainServices = await db
    .insert(services)
    .values([
      { propertyId, serviceTypeId: electricityTypeId },
      { propertyId, serviceTypeId: gasTypeId },
      { propertyId: otherPropertyId, serviceTypeId: electricityTypeId },
    ])
    .returning({
      id: services.id,
      propertyId: services.propertyId,
      serviceTypeId: services.serviceTypeId,
    });

  const elecSvcMain = mainServices.find(
    (s) => s.propertyId === propertyId && s.serviceTypeId === electricityTypeId,
  )!.id;
  const gasSvcMain = mainServices.find(
    (s) => s.propertyId === propertyId && s.serviceTypeId === gasTypeId,
  )!.id;
  const elecSvcOther = mainServices.find((s) => s.propertyId === otherPropertyId)!.id;

  // --- Meters ---
  const insertedMeters = await db
    .insert(meters)
    .values([
      // 1-zone electricity meter on main property
      {
        propertyId,
        serviceTypeId: electricityTypeId,
        zoneCount: 1,
        validFrom: new Date("2024-01-01T00:00:00Z"),
        serialNumber: "MQT-1Z",
      },
      // 2-zone electricity meter on main property (different property/type combo — not allowed by
      // the exclusion constraint, so we use a fresh property slot via otherPropertyId for the 2Z test)
      // Actually the exclusion constraint prevents two active meters of the same service type on the
      // same property. The 2-zone test runs against a third property added below.
      // For simplicity: add a separate property for the 2-zone meter test.
      {
        propertyId,
        serviceTypeId: gasTypeId,
        zoneCount: 1,
        validFrom: new Date("2024-01-01T00:00:00Z"),
        serialNumber: "MQT-GAS",
      },
      // Meter on other user's property — must NOT appear in userId queries
      {
        propertyId: otherPropertyId,
        serviceTypeId: electricityTypeId,
        zoneCount: 1,
        validFrom: new Date("2024-01-01T00:00:00Z"),
        serialNumber: "MQT-OTHER",
      },
    ])
    .returning({ id: meters.id });

  elecMeter1Z = insertedMeters[0]!.id;
  const gasMeter = insertedMeters[1]!.id;
  otherPropMeter = insertedMeters[2]!.id;

  // Link each meter to the service it feeds (Slice B3 attribution).
  await db.insert(meterServices).values([
    { meterId: elecMeter1Z, serviceId: elecSvcMain },
    { meterId: gasMeter, serviceId: gasSvcMain },
    { meterId: otherPropMeter, serviceId: elecSvcOther },
  ]);

  // --- 2-zone meter: add a third property for this test ---
  const [twoZoneProp] = await db
    .insert(properties)
    .values([{ name: "Meter Query 2Zone Property", type: "apartment" }])
    .returning({ id: properties.id });

  const twoZonePropId = twoZoneProp!.id;

  await db
    .insert(propertyAccess)
    .values([
      { propertyId: twoZonePropId, userId, propertyRole: PROPERTY_ROLES.OWNER, grantedBy: userId },
    ]);
  const [svc2z] = await db
    .insert(services)
    .values([{ propertyId: twoZonePropId, serviceTypeId: electricityTypeId }])
    .returning({ id: services.id });

  const [m2z] = await db
    .insert(meters)
    .values([
      {
        propertyId: twoZonePropId,
        serviceTypeId: electricityTypeId,
        zoneCount: 2,
        validFrom: new Date("2024-01-01T00:00:00Z"),
        serialNumber: "MQT-2Z",
      },
    ])
    .returning({ id: meters.id });

  elecMeter2Z = m2z!.id;
  await db.insert(meterServices).values({ meterId: elecMeter2Z, serviceId: svc2z!.id });

  // --- 4th property for the meter replacement test ---
  const [replaceProp] = await db
    .insert(properties)
    .values([{ name: "Meter Query Replace Property", type: "apartment" }])
    .returning({ id: properties.id });

  const replacePropId = replaceProp!.id;

  await db
    .insert(propertyAccess)
    .values([
      { propertyId: replacePropId, userId, propertyRole: PROPERTY_ROLES.OWNER, grantedBy: userId },
    ]);
  const [svcReplace] = await db
    .insert(services)
    .values([{ propertyId: replacePropId, serviceTypeId: electricityTypeId }])
    .returning({ id: services.id });

  const replacedMeters = await db
    .insert(meters)
    .values([
      // Old meter: valid Jan → replaced Feb 15
      {
        propertyId: replacePropId,
        serviceTypeId: electricityTypeId,
        zoneCount: 1,
        validFrom: new Date("2024-01-01T00:00:00Z"),
        validTo: new Date("2024-02-15T00:00:00Z"),
        serialNumber: "MQT-OLD",
      },
      // New meter: valid from Feb 15 onward
      {
        propertyId: replacePropId,
        serviceTypeId: electricityTypeId,
        zoneCount: 1,
        validFrom: new Date("2024-02-15T00:00:00Z"),
        serialNumber: "MQT-NEW",
      },
    ])
    .returning({ id: meters.id });

  replacedMeter = replacedMeters[0]!.id;
  newMeter = replacedMeters[1]!.id;

  // Both the closed and the replacement meter feed the same service (replacement inherits the
  // link in production — Slice B2); the aggregate must sum deltas across both.
  await db.insert(meterServices).values([
    { meterId: replacedMeter, serviceId: svcReplace!.id },
    { meterId: newMeter, serviceId: svcReplace!.id },
  ]);

  // Store twoZonePropId for cleanup
  (globalThis as Record<string, unknown>).__meterQueryTwoZonePropId = twoZonePropId;
  (globalThis as Record<string, unknown>).__meterQueryReplacePropId = replacePropId;
});

afterAll(async () => {
  // Deleting properties cascades to services, meters, readings, propertyAccess.
  const extraPropIds = [
    (globalThis as Record<string, unknown>).__meterQueryTwoZonePropId as PropertyId,
    (globalThis as Record<string, unknown>).__meterQueryReplacePropId as PropertyId,
  ];
  await db
    .delete(properties)
    .where(inArray(properties.id, [propertyId, otherPropertyId, ...extraPropIds]));
  await db.delete(users).where(inArray(users.id, [userId, otherUserId]));
});

// Helper: insert a reading with only T1
const r1 = (meterId: MeterId, readAt: string, t1: number) => ({
  meterId,
  readAt: new Date(readAt),
  valueT1: String(t1),
});

// Helper: insert a reading with T1+T2
const r2 = (meterId: MeterId, readAt: string, t1: number, t2: number) => ({
  meterId,
  readAt: new Date(readAt),
  valueT1: String(t1),
  valueT2: String(t2),
});

// --- availableConsumptionServiceTypes ---

describe("availableConsumptionServiceTypes", () => {
  it("returns metered service types accessible to the user", async () => {
    const result = await availableConsumptionServiceTypes(userId, {});
    const codes = result.map((s) => s.code);
    expect(codes).toContain("electricity");
    expect(codes).toContain("gas");
  });

  it("excludes service types from other users' meters", async () => {
    const result = await availableConsumptionServiceTypes(otherUserId, {});
    const codes = result.map((s) => s.code);
    // otherUserId only owns the other property with electricity
    expect(codes).toContain("electricity");
    // otherUserId has no gas meter
    expect(codes).not.toContain("gas");
  });

  it("filters by propertyId when provided", async () => {
    // propertyId has electricity + gas meters
    const all = await availableConsumptionServiceTypes(userId, { propertyId });
    const codes = all.map((s) => s.code);
    expect(codes).toContain("electricity");
    expect(codes).toContain("gas");
  });

  it("returns unit for each service type", async () => {
    const result = await availableConsumptionServiceTypes(userId, {});
    const elec = result.find((s) => s.code === "electricity");
    expect(elec?.unit).toBe("kwh");
    const gas = result.find((s) => s.code === "gas");
    expect(gas?.unit).toBe("m3");
  });
});

// --- monthlyConsumptionByService ---

describe("monthlyConsumptionByService — base case (1-zone, 3 months)", () => {
  beforeAll(async () => {
    // Insert readings: Jan reading, Feb reading, Mar reading
    // Consumption: Feb = 50, Mar = 70
    await db
      .insert(readings)
      .values([
        r1(elecMeter1Z, "2025-01-15T10:00:00Z", 1000),
        r1(elecMeter1Z, "2025-02-12T10:00:00Z", 1050),
        r1(elecMeter1Z, "2025-03-10T10:00:00Z", 1120),
      ]);
  });

  afterAll(async () => {
    // Clean up readings for this meter
    await db.delete(readings).where(inArray(readings.meterId, [elecMeter1Z]));
  });

  it("returns the correct month axis", async () => {
    const result = await monthlyConsumptionByService(userId, {
      serviceTypeCode: "electricity",
      dateFrom: "2025-01-01",
      dateTo: "2025-03-01",
    });
    expect(result.months).toEqual(["2025-01-01", "2025-02-01", "2025-03-01"]);
  });

  it("computes monthly deltas correctly", async () => {
    const result = await monthlyConsumptionByService(userId, {
      serviceTypeCode: "electricity",
      dateFrom: "2025-01-01",
      dateTo: "2025-03-01",
    });
    // Jan: first reading, no previous → delta assigned to Feb (1050-1000=50), Mar (1120-1050=70)
    // Jan slot itself has no delta landing in Jan because the first reading has no prev
    expect(result.zones).toHaveLength(1);
    expect(result.zones[0]!.key).toBe("t1");
    expect(result.zones[0]!.monthlyConsumption).toEqual([0, 50, 70]);
  });

  it("returns correct unit", async () => {
    const result = await monthlyConsumptionByService(userId, {
      serviceTypeCode: "electricity",
      dateFrom: "2025-01-01",
      dateTo: "2025-01-01",
    });
    expect(result.unit).toBe("kwh");
  });

  it("returns 0 for months before the first reading (range starts before first reading month)", async () => {
    // Range starts in Dec 2024 — no readings there → consumption 0
    const result = await monthlyConsumptionByService(userId, {
      serviceTypeCode: "electricity",
      dateFrom: "2024-12-01",
      dateTo: "2025-02-01",
    });
    expect(result.zones[0]!.monthlyConsumption[0]).toBe(0); // Dec
    expect(result.zones[0]!.monthlyConsumption[1]).toBe(0); // Jan — delta(Jan→Feb) = 50 but that's in Feb
    expect(result.zones[0]!.monthlyConsumption[2]).toBe(50); // Feb
  });
});

describe("monthlyConsumptionByService — gap month", () => {
  beforeAll(async () => {
    // Jan reading, then Mar reading — no Feb reading
    await db
      .insert(readings)
      .values([
        r1(elecMeter1Z, "2025-01-10T10:00:00Z", 500),
        r1(elecMeter1Z, "2025-03-05T10:00:00Z", 600),
      ]);
  });

  afterAll(async () => {
    await db.delete(readings).where(inArray(readings.meterId, [elecMeter1Z]));
  });

  it("shows 0 for the gap month and assigns the full delta to the month of the later reading", async () => {
    const result = await monthlyConsumptionByService(userId, {
      serviceTypeCode: "electricity",
      dateFrom: "2025-01-01",
      dateTo: "2025-03-01",
    });
    // delta Jan→Mar = 100, assigned to month of Mar reading
    expect(result.zones[0]!.monthlyConsumption).toEqual([0, 0, 100]);
  });
});

describe("monthlyConsumptionByService — 2-zone meter", () => {
  beforeAll(async () => {
    await db
      .insert(readings)
      .values([
        r2(elecMeter2Z, "2025-01-15T10:00:00Z", 1000, 500),
        r2(elecMeter2Z, "2025-02-12T10:00:00Z", 1080, 530),
      ]);
  });

  afterAll(async () => {
    await db.delete(readings).where(inArray(readings.meterId, [elecMeter2Z]));
  });

  it("returns two zones (t1 and t2)", async () => {
    const result = await monthlyConsumptionByService(userId, {
      serviceTypeCode: "electricity",
      dateFrom: "2025-01-01",
      dateTo: "2025-02-01",
    });
    const keys = result.zones.map((z) => z.key);
    expect(keys).toContain("t1");
    expect(keys).toContain("t2");
    expect(result.zones).toHaveLength(2);
  });

  it("computes deltas for both zones correctly", async () => {
    const result = await monthlyConsumptionByService(userId, {
      serviceTypeCode: "electricity",
      dateFrom: "2025-01-01",
      dateTo: "2025-02-01",
    });
    const t1 = result.zones.find((z) => z.key === "t1")!;
    const t2 = result.zones.find((z) => z.key === "t2")!;
    expect(t1.monthlyConsumption).toEqual([0, 80]); // Jan: no prev; Feb: 1080-1000=80
    expect(t2.monthlyConsumption).toEqual([0, 30]); // Feb: 530-500=30
  });
});

describe("monthlyConsumptionByService — access scoping", () => {
  beforeAll(async () => {
    // Insert readings on the other user's meter and on the test user's meter
    await db.insert(readings).values([
      r1(elecMeter1Z, "2025-01-10T10:00:00Z", 100),
      r1(elecMeter1Z, "2025-02-10T10:00:00Z", 150),
      r1(otherPropMeter, "2025-01-10T10:00:00Z", 1000),
      r1(otherPropMeter, "2025-02-10T10:00:00Z", 2000), // would be 1000 if accessible
    ]);
  });

  afterAll(async () => {
    await db.delete(readings).where(inArray(readings.meterId, [elecMeter1Z, otherPropMeter]));
  });

  it("does not include readings from other users' meters", async () => {
    const result = await monthlyConsumptionByService(userId, {
      serviceTypeCode: "electricity",
      dateFrom: "2025-01-01",
      dateTo: "2025-02-01",
    });
    // Only 50 from userId's meter; not 1000 from otherPropMeter
    expect(result.zones[0]!.monthlyConsumption).toEqual([0, 50]);
  });
});

describe("monthlyConsumptionByService — meter replacement", () => {
  beforeAll(async () => {
    // Old meter: readings in Jan and Feb (before replacement Feb 15)
    // New meter: readings starting Feb 15 (fresh counter)
    await db.insert(readings).values([
      r1(replacedMeter, "2024-01-10T10:00:00Z", 100),
      r1(replacedMeter, "2024-02-10T10:00:00Z", 130), // 30 consumed in Jan→Feb
      r1(newMeter, "2024-02-20T10:00:00Z", 5), // new meter starts at 5
      r1(newMeter, "2024-03-10T10:00:00Z", 45), // 40 consumed Feb→Mar
    ]);
  });

  afterAll(async () => {
    await db.delete(readings).where(inArray(readings.meterId, [replacedMeter, newMeter]));
  });

  it("contributes deltas from both meters without double-counting the reset", async () => {
    const result = await monthlyConsumptionByService(userId, {
      serviceTypeCode: "electricity",
      dateFrom: "2024-01-01",
      dateTo: "2024-03-01",
    });
    // Jan: no prev for old meter → 0
    // Feb: old meter delta (130-100=30) + new meter reading Feb 20 has no prev within Feb (first for new meter) → 30
    // Mar: new meter delta (45-5=40) → 40
    expect(result.zones[0]!.monthlyConsumption).toEqual([0, 30, 40]);
  });
});

describe("monthlyConsumptionByService — link-based attribution (Slice B3)", () => {
  let sepPropId: PropertyId; // two meters, two services of one concept
  let sharedPropId: PropertyId; // one meter feeding two services of one concept

  beforeAll(async () => {
    const props = await db
      .insert(properties)
      .values([
        { name: "B3 Separate Meters Property", type: "apartment" },
        { name: "B3 Shared Meter Property", type: "apartment" },
      ])
      .returning({ id: properties.id });
    sepPropId = props[0]!.id;
    sharedPropId = props[1]!.id;

    await db.insert(propertyAccess).values([
      { propertyId: sepPropId, userId, propertyRole: PROPERTY_ROLES.OWNER, grantedBy: userId },
      { propertyId: sharedPropId, userId, propertyRole: PROPERTY_ROLES.OWNER, grantedBy: userId },
    ]);

    // Separate: two electricity services, two electricity meters, one link each.
    const sepSvcs = await db
      .insert(services)
      .values([
        { propertyId: sepPropId, serviceTypeId: electricityTypeId, name: "Main" },
        { propertyId: sepPropId, serviceTypeId: electricityTypeId, name: "Studio" },
      ])
      .returning({ id: services.id });
    const sepMeters = await db
      .insert(meters)
      .values([
        {
          propertyId: sepPropId,
          serviceTypeId: electricityTypeId,
          zoneCount: 1,
          validFrom: new Date("2025-01-01T00:00:00Z"),
          serialNumber: "B3-SEP-A",
        },
        {
          propertyId: sepPropId,
          serviceTypeId: electricityTypeId,
          zoneCount: 1,
          validFrom: new Date("2025-01-01T00:00:00Z"),
          serialNumber: "B3-SEP-B",
        },
      ])
      .returning({ id: meters.id });
    await db.insert(meterServices).values([
      { meterId: sepMeters[0]!.id, serviceId: sepSvcs[0]!.id },
      { meterId: sepMeters[1]!.id, serviceId: sepSvcs[1]!.id },
    ]);
    await db.insert(readings).values([
      r1(sepMeters[0]!.id, "2025-01-15T10:00:00Z", 1000),
      r1(sepMeters[0]!.id, "2025-02-15T10:00:00Z", 1050), // +50
      r1(sepMeters[1]!.id, "2025-01-15T10:00:00Z", 2000),
      r1(sepMeters[1]!.id, "2025-02-15T10:00:00Z", 2200), // +200
    ]);

    // Shared: one electricity meter feeding two electricity services (two links).
    const sharedSvcs = await db
      .insert(services)
      .values([
        { propertyId: sharedPropId, serviceTypeId: electricityTypeId, name: "Flat" },
        { propertyId: sharedPropId, serviceTypeId: electricityTypeId, name: "Garage" },
      ])
      .returning({ id: services.id });
    const [sharedMeter] = await db
      .insert(meters)
      .values([
        {
          propertyId: sharedPropId,
          serviceTypeId: electricityTypeId,
          zoneCount: 1,
          validFrom: new Date("2025-01-01T00:00:00Z"),
          serialNumber: "B3-SHARED",
        },
      ])
      .returning({ id: meters.id });
    await db.insert(meterServices).values([
      { meterId: sharedMeter!.id, serviceId: sharedSvcs[0]!.id },
      { meterId: sharedMeter!.id, serviceId: sharedSvcs[1]!.id },
    ]);
    await db.insert(readings).values([
      r1(sharedMeter!.id, "2025-01-15T10:00:00Z", 500),
      r1(sharedMeter!.id, "2025-02-15T10:00:00Z", 580), // +80
    ]);
  });

  afterAll(async () => {
    await db.delete(properties).where(inArray(properties.id, [sepPropId, sharedPropId]));
  });

  it("sums both meters when two feed two different services of one concept", async () => {
    const result = await monthlyConsumptionByService(userId, {
      serviceTypeCode: "electricity",
      dateFrom: "2025-01-01",
      dateTo: "2025-02-01",
      propertyId: sepPropId,
    });
    // Feb: meter A (+50) + meter B (+200), each counted once = 250
    expect(result.zones[0]!.monthlyConsumption).toEqual([0, 250]);
  });

  it("counts a meter feeding two services of one concept only once (no double count)", async () => {
    const result = await monthlyConsumptionByService(userId, {
      serviceTypeCode: "electricity",
      dateFrom: "2025-01-01",
      dateTo: "2025-02-01",
      propertyId: sharedPropId,
    });
    // Feb: single meter delta +80 — NOT 160 (would double if joined per link instead of EXISTS)
    expect(result.zones[0]!.monthlyConsumption).toEqual([0, 80]);
  });
});
