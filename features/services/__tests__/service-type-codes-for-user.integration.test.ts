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

import { serviceTypeCodesForUser } from "../query";

// Service types are seeded via migration — look up by code.
let electricityTypeId: TServiceTypeId;
let gasTypeId: TServiceTypeId;
let coldWaterTypeId: TServiceTypeId;
let heatingTypeId: TServiceTypeId;
let otherTypeId: TServiceTypeId;

let userId: UserId;
let otherUserId: UserId;
// propertyA: electricity, gas, two custom `other` (Garage, Storage)
// propertyB: cold_water only — used to prove property scoping
let propertyAId: PropertyId;
let propertyBId: PropertyId;
// propertyC: owned by otherUser, NOT accessible to userId — its heating must never appear
let propertyCId: PropertyId;

beforeAll(async () => {
  const sts = await db
    .select({ id: serviceTypes.id, code: serviceTypes.code })
    .from(serviceTypes)
    .where(inArray(serviceTypes.code, ["electricity", "gas", "cold_water", "heating", "other"]));

  electricityTypeId = sts.find((s) => s.code === "electricity")!.id;
  gasTypeId = sts.find((s) => s.code === "gas")!.id;
  coldWaterTypeId = sts.find((s) => s.code === "cold_water")!.id;
  heatingTypeId = sts.find((s) => s.code === "heating")!.id;
  otherTypeId = sts.find((s) => s.code === "other")!.id;

  const insertedUsers = await db
    .insert(users)
    .values([
      { email: "service-type-codes-test-user@test.invalid", name: "Service Type Codes Test User" },
      {
        email: "service-type-codes-other-user@test.invalid",
        name: "Service Type Codes Other User",
      },
    ])
    .returning({ id: users.id });

  userId = insertedUsers[0]!.id;
  otherUserId = insertedUsers[1]!.id;

  const insertedProps = await db
    .insert(properties)
    .values([
      { name: "Service Type Codes Property A", type: "apartment" },
      { name: "Service Type Codes Property B", type: "house" },
      { name: "Service Type Codes Property C", type: "house" },
    ])
    .returning({ id: properties.id });

  propertyAId = insertedProps[0]!.id;
  propertyBId = insertedProps[1]!.id;
  propertyCId = insertedProps[2]!.id;

  await db.insert(propertyAccess).values([
    { propertyId: propertyAId, userId, propertyRole: PROPERTY_ROLES.OWNER, grantedBy: userId },
    { propertyId: propertyBId, userId, propertyRole: PROPERTY_ROLES.OWNER, grantedBy: userId },
    // propertyC belongs to otherUser only — userId has no access.
    {
      propertyId: propertyCId,
      userId: otherUserId,
      propertyRole: PROPERTY_ROLES.OWNER,
      grantedBy: otherUserId,
    },
  ]);

  await db.insert(services).values([
    { propertyId: propertyAId, serviceTypeId: electricityTypeId },
    { propertyId: propertyAId, serviceTypeId: gasTypeId },
    // Two custom `other` services — must collapse into a single "other" code.
    { propertyId: propertyAId, serviceTypeId: otherTypeId, name: "Garage" },
    { propertyId: propertyAId, serviceTypeId: otherTypeId, name: "Storage" },
    { propertyId: propertyBId, serviceTypeId: coldWaterTypeId },
    // Inaccessible to userId — heating must never surface in userId's results.
    { propertyId: propertyCId, serviceTypeId: heatingTypeId },
  ]);
});

afterAll(async () => {
  // Deleting properties cascades to services and propertyAccess.
  await db
    .delete(properties)
    .where(inArray(properties.id, [propertyAId, propertyBId, propertyCId]));
  await db.delete(users).where(inArray(users.id, [userId, otherUserId]));
});

describe("serviceTypeCodesForUser", () => {
  it("returns the user's distinct service-type codes in catalog order", async () => {
    const codes = await serviceTypeCodesForUser(userId);

    // sortOrder: electricity < gas < cold_water < other (other is last in the catalog).
    expect(codes).toEqual(["electricity", "gas", "cold_water", "other"]);
  });

  it("collapses multiple custom `other` services into a single `other` code", async () => {
    const codes = await serviceTypeCodesForUser(userId);

    expect(codes.filter((c) => c === "other")).toHaveLength(1);
  });

  it("narrows to a single property when propertyId is provided", async () => {
    const codes = await serviceTypeCodesForUser(userId, { propertyId: propertyAId });

    // propertyA has electricity, gas and the custom `other` services — but not cold_water.
    expect(codes).toEqual(["electricity", "gas", "other"]);
  });

  it("excludes service types on properties the user cannot access", async () => {
    const codes = await serviceTypeCodesForUser(userId);

    // heating lives on propertyC (otherUser's) — never accessible to userId.
    expect(codes).not.toContain("heating");
  });

  it("returns an empty list for a user with no accessible properties", async () => {
    const strangerUserId = "00000000-0000-0000-0000-000000000002" as UserId;
    const codes = await serviceTypeCodesForUser(strangerUserId);

    expect(codes).toEqual([]);
  });

  it("returns the full set of the user's types regardless of any service selection (bug regression)", async () => {
    // The function takes no service-type filter, so the option list can never collapse to a
    // single selected service — the root cause of the dashboard dropdown bug.
    const codes = await serviceTypeCodesForUser(userId);

    expect(codes.length).toBeGreaterThan(1);
    expect(codes).toEqual(expect.arrayContaining(["electricity", "gas"]));
  });
});
