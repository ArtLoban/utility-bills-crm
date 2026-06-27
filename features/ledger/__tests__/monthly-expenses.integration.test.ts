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
import { bills } from "@/lib/db/schema/bills";

import { monthlyExpensesByService } from "../query";

// Service types are seeded via migration — look up by code.
let electricityTypeId: TServiceTypeId;
let gasTypeId: TServiceTypeId;

let userId: UserId;
let otherUserId: UserId;
let propertyId: PropertyId;
let otherPropertyId: PropertyId;
let electricityServiceId: TServiceId;
let gasServiceId: TServiceId;
let otherPropertyServiceId: TServiceId;

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
      { email: "monthly-expenses-test-user@test.invalid", name: "Monthly Expenses Test User" },
      { email: "monthly-expenses-other-user@test.invalid", name: "Monthly Expenses Other User" },
    ])
    .returning({ id: users.id });

  userId = insertedUsers[0]!.id;
  otherUserId = insertedUsers[1]!.id;

  // --- Properties ---
  const insertedProps = await db
    .insert(properties)
    .values([
      { name: "Monthly Expenses Test Property", type: "apartment" },
      { name: "Monthly Expenses Other Property", type: "house" },
    ])
    .returning({ id: properties.id });

  propertyId = insertedProps[0]!.id;
  otherPropertyId = insertedProps[1]!.id;

  // --- Property access ---
  await db.insert(propertyAccess).values([
    { propertyId, userId, propertyRole: PROPERTY_ROLES.OWNER, grantedBy: userId },
    // otherUserId owns otherProperty, not the main property
    {
      propertyId: otherPropertyId,
      userId: otherUserId,
      propertyRole: PROPERTY_ROLES.OWNER,
      grantedBy: otherUserId,
    },
  ]);

  // --- Services ---
  const insertedServices = await db
    .insert(services)
    .values([
      { propertyId, serviceTypeId: electricityTypeId },
      { propertyId, serviceTypeId: gasTypeId },
      { propertyId: otherPropertyId, serviceTypeId: electricityTypeId },
    ])
    .returning({ id: services.id });

  electricityServiceId = insertedServices[0]!.id;
  gasServiceId = insertedServices[1]!.id;
  otherPropertyServiceId = insertedServices[2]!.id;

  // --- Bills for the main user's property ---
  // Electricity: 3 months (Jan–Mar 2025)
  // Gas: 2 months (Jan–Feb 2025), gap in Mar
  // Other property (not accessible to userId): some bills that must NOT appear
  await db.insert(bills).values([
    {
      serviceId: electricityServiceId,
      periodStart: "2025-01-01",
      periodEnd: "2025-01-31",
      periodMonth: "2025-01-01",
      amount: "100.00",
    },
    {
      serviceId: electricityServiceId,
      periodStart: "2025-02-01",
      periodEnd: "2025-02-28",
      periodMonth: "2025-02-01",
      amount: "120.00",
    },
    {
      serviceId: electricityServiceId,
      periodStart: "2025-03-01",
      periodEnd: "2025-03-31",
      periodMonth: "2025-03-01",
      amount: "140.00",
    },
    {
      serviceId: gasServiceId,
      periodStart: "2025-01-01",
      periodEnd: "2025-01-31",
      periodMonth: "2025-01-01",
      amount: "200.00",
    },
    {
      serviceId: gasServiceId,
      periodStart: "2025-02-01",
      periodEnd: "2025-02-28",
      periodMonth: "2025-02-01",
      amount: "250.00",
    },
    // Other property's bill — must NOT appear in userId's results
    {
      serviceId: otherPropertyServiceId,
      periodStart: "2025-01-01",
      periodEnd: "2025-01-31",
      periodMonth: "2025-01-01",
      amount: "999.00",
    },
  ]);
});

afterAll(async () => {
  // Deleting properties cascades to services, bills, propertyAccess.
  await db.delete(properties).where(inArray(properties.id, [propertyId, otherPropertyId]));
  await db.delete(users).where(inArray(users.id, [userId, otherUserId]));
});

describe("monthlyExpensesByService", () => {
  it("returns empty services array when user has no accessible properties", async () => {
    // Use a random UUID that has no property access
    const strangerUserId = "00000000-0000-0000-0000-000000000001" as UserId;
    const result = await monthlyExpensesByService(strangerUserId, {
      dateFrom: "2025-01-01",
      dateTo: "2025-03-01",
    });

    expect(result.months).toHaveLength(3);
    expect(result.services).toHaveLength(0);
  });

  it("returns the correct month axis for the requested range", async () => {
    const result = await monthlyExpensesByService(userId, {
      dateFrom: "2025-01-01",
      dateTo: "2025-03-01",
    });

    expect(result.months).toEqual(["2025-01-01", "2025-02-01", "2025-03-01"]);
  });

  it("includes months with no bills (gap months get amount 0)", async () => {
    // Gas has no March bill — must appear as 0 in month[2]
    const result = await monthlyExpensesByService(userId, {
      dateFrom: "2025-01-01",
      dateTo: "2025-03-01",
    });

    const gas = result.services.find((s) => s.code === "gas");
    expect(gas).toBeDefined();
    expect(gas!.monthlyAmounts).toEqual([200, 250, 0]);
  });

  it("returns correct amounts aligned to the month axis", async () => {
    const result = await monthlyExpensesByService(userId, {
      dateFrom: "2025-01-01",
      dateTo: "2025-03-01",
    });

    const elec = result.services.find((s) => s.code === "electricity");
    expect(elec).toBeDefined();
    expect(elec!.monthlyAmounts).toEqual([100, 120, 140]);
  });

  it("scopes results to the requesting user's accessible properties only", async () => {
    // otherProperty has a 999 UAH electricity bill but userId has no access to it.
    // Access is scoped via propertyAccess JOIN — the 999 bill must not appear.
    const result = await monthlyExpensesByService(userId, {
      dateFrom: "2025-01-01",
      dateTo: "2025-01-01",
    });

    const elec = result.services.find((s) => s.code === "electricity");
    // Only userId's property's electricity bill (100) — not otherProperty's (999)
    expect(elec?.monthlyAmounts[0]).toBe(100);
  });

  it("filters by propertyId when provided", async () => {
    // userId has access to two properties; filter to propertyId only
    // otherPropertyId is not accessible to userId anyway, but the filter is still applied
    const result = await monthlyExpensesByService(userId, {
      dateFrom: "2025-01-01",
      dateTo: "2025-03-01",
      propertyId,
    });

    // Should still include electricity and gas from the filtered property
    expect(result.services).toHaveLength(2);
  });

  it("filters by serviceTypeCodes when provided", async () => {
    const result = await monthlyExpensesByService(userId, {
      dateFrom: "2025-01-01",
      dateTo: "2025-03-01",
      serviceTypeCodes: ["electricity"],
    });

    expect(result.services).toHaveLength(1);
    expect(result.services[0]!.code).toBe("electricity");
  });

  it("returns empty services when no bills exist in the given date range", async () => {
    const result = await monthlyExpensesByService(userId, {
      dateFrom: "2024-01-01",
      dateTo: "2024-03-01",
    });

    expect(result.months).toEqual(["2024-01-01", "2024-02-01", "2024-03-01"]);
    expect(result.services).toHaveLength(0);
  });

  it("includes boundary months (dateFrom and dateTo months are inclusive)", async () => {
    // Only request Jan; Feb and Mar bills must not bleed over the axis
    const result = await monthlyExpensesByService(userId, {
      dateFrom: "2025-01-01",
      dateTo: "2025-01-01",
    });

    expect(result.months).toEqual(["2025-01-01"]);
    const elec = result.services.find((s) => s.code === "electricity");
    expect(elec).toBeDefined();
    expect(elec!.monthlyAmounts).toEqual([100]);
  });

  it("returns service codes matching service_types.code", async () => {
    const result = await monthlyExpensesByService(userId, {
      dateFrom: "2025-01-01",
      dateTo: "2025-01-01",
    });

    const codes = result.services.map((s) => s.code).sort();
    expect(codes).toEqual(["electricity", "gas"]);
  });
});
