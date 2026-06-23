import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema/auth";
import type { UserId } from "@/lib/db/schema/auth";
import { properties, propertyAccess } from "@/lib/db/schema/properties";
import type { PropertyId } from "@/lib/db/schema/properties";
import { services } from "@/lib/db/schema/services";
import { serviceTypes } from "@/lib/db/schema/service-types";
import type { TServiceTypeId } from "@/lib/db/schema/service-types";
import { auth } from "@/lib/auth";

import { getAdminPropertiesList } from "../query";
import { loadAdminPropertiesParams } from "../query-params";

vi.mock("next/navigation", () => ({ notFound: vi.fn() }));

// --- Auth mock ---

const mockAdmin = () =>
  vi.mocked(auth).mockResolvedValue({
    user: { id: "admin-query-test-id", systemRole: "admin" },
  } as unknown as Awaited<ReturnType<typeof auth>>);

// --- Fixtures ---

let userId1: UserId;
let userId2: UserId;
let propActiveApartment: PropertyId; // apartment, active, owner = user1
let propActiveHouse: PropertyId; // house, active, owner = user1 + user2
let propDeletedCottage: PropertyId; // cottage, deleted, owner = user1
let serviceTypeId1: TServiceTypeId;
let serviceTypeId2: TServiceTypeId;

const TEST_PROPERTY_IDS = new Set<string>();

beforeAll(async () => {
  const sts = await db.select({ id: serviceTypes.id }).from(serviceTypes).limit(2);
  serviceTypeId1 = sts[0]!.id;
  serviceTypeId2 = sts[1]!.id;

  const insertedUsers = await db
    .insert(users)
    .values([
      { email: "admin-query-prop-test-user1@test.invalid", name: "Query Prop Test User1" },
      { email: "admin-query-prop-test-user2@test.invalid", name: "Query Prop Test User2" },
    ])
    .returning({ id: users.id });
  userId1 = insertedUsers[0]!.id;
  userId2 = insertedUsers[1]!.id;

  const insertedProps = await db
    .insert(properties)
    .values([
      { name: "Query Test Active Apartment", type: "apartment" },
      { name: "Query Test Active House", type: "house" },
      { name: "Query Test Deleted Cottage", type: "cottage" },
    ])
    .returning({ id: properties.id });
  propActiveApartment = insertedProps[0]!.id;
  propActiveHouse = insertedProps[1]!.id;
  propDeletedCottage = insertedProps[2]!.id;

  TEST_PROPERTY_IDS.add(propActiveApartment);
  TEST_PROPERTY_IDS.add(propActiveHouse);
  TEST_PROPERTY_IDS.add(propDeletedCottage);

  // Soft-delete the cottage
  await db
    .update(properties)
    .set({ deletedAt: new Date("2025-02-20T10:00:00.000Z") })
    .where(eq(properties.id, propDeletedCottage));

  // property_access: user1 owns apartment and cottage; user1+user2 both own house
  await db.insert(propertyAccess).values([
    { propertyId: propActiveApartment, userId: userId1, propertyRole: "owner", grantedBy: userId1 },
    {
      propertyId: propActiveHouse,
      userId: userId1,
      propertyRole: "owner",
      grantedBy: userId1,
    },
    {
      propertyId: propActiveHouse,
      userId: userId2,
      propertyRole: "owner",
      grantedBy: userId1,
    },
    { propertyId: propDeletedCottage, userId: userId1, propertyRole: "owner", grantedBy: userId1 },
  ]);

  // Services on apartment: one active + one soft-deleted → count should be 1
  const svcs = await db
    .insert(services)
    .values([
      { propertyId: propActiveApartment, serviceTypeId: serviceTypeId1 },
      { propertyId: propActiveApartment, serviceTypeId: serviceTypeId2 },
    ])
    .returning({ id: services.id });

  // Soft-delete the second service
  await db.update(services).set({ deletedAt: new Date() }).where(eq(services.id, svcs[1]!.id));
});

afterAll(async () => {
  await db.delete(propertyAccess).where(eq(propertyAccess.userId, userId1));
  await db.delete(propertyAccess).where(eq(propertyAccess.userId, userId2));
  await db.delete(services).where(eq(services.propertyId, propActiveApartment));
  await db.delete(properties).where(eq(properties.id, propActiveApartment));
  await db.delete(properties).where(eq(properties.id, propActiveHouse));
  await db.delete(properties).where(eq(properties.id, propDeletedCottage));
  await db.delete(users).where(eq(users.id, userId1));
  await db.delete(users).where(eq(users.id, userId2));
});

beforeEach(() => {
  mockAdmin();
});

// Helper: run list query and filter to test fixtures only.
const listFixtures = async (rawOverrides: Record<string, string> = {}) => {
  const params = await loadAdminPropertiesParams({
    status: "all",
    pageSize: "100",
    ...rawOverrides,
  });
  const result = await getAdminPropertiesList(params);
  return result.data.filter((r) => TEST_PROPERTY_IDS.has(r.id));
};

// --- Tests ---

describe("status filter", () => {
  it("active (default) excludes soft-deleted properties", async () => {
    const params = await loadAdminPropertiesParams({ pageSize: "100" }); // default status=active
    const result = await getAdminPropertiesList(params);
    const fixtures = result.data.filter((r) => TEST_PROPERTY_IDS.has(r.id));
    const ids = fixtures.map((r) => r.id);
    expect(ids).toContain(propActiveApartment);
    expect(ids).toContain(propActiveHouse);
    expect(ids).not.toContain(propDeletedCottage);
  });

  it("deleted returns only soft-deleted properties", async () => {
    const rows = await listFixtures({ status: "deleted" });
    expect(rows).toHaveLength(1);
    expect(rows[0]!.id).toBe(propDeletedCottage);
    expect(rows[0]!.deletedAt).not.toBeNull();
  });

  it("all returns both active and soft-deleted", async () => {
    const rows = await listFixtures({ status: "all" });
    const ids = rows.map((r) => r.id);
    expect(ids).toContain(propActiveApartment);
    expect(ids).toContain(propActiveHouse);
    expect(ids).toContain(propDeletedCottage);
  });
});

describe("type filter", () => {
  it("filters by type=apartment", async () => {
    const rows = await listFixtures({ type: "apartment" });
    expect(rows.every((r) => r.type === "apartment")).toBe(true);
    expect(rows.some((r) => r.id === propActiveApartment)).toBe(true);
    expect(rows.some((r) => r.id === propActiveHouse)).toBe(false);
  });

  it("filters by type=house", async () => {
    const rows = await listFixtures({ type: "house" });
    expect(rows.some((r) => r.id === propActiveHouse)).toBe(true);
    expect(rows.some((r) => r.id === propActiveApartment)).toBe(false);
  });
});

describe("owner filter", () => {
  it("returns only properties where user is an active owner", async () => {
    const rows = await listFixtures({ owner: userId2 });
    // user2 only owns the house
    const ids = rows.map((r) => r.id);
    expect(ids).toContain(propActiveHouse);
    expect(ids).not.toContain(propActiveApartment);
  });

  it("includes soft-deleted properties when status=all + owner filter", async () => {
    const rows = await listFixtures({ owner: userId1 });
    // user1 owns apartment + house + cottage; status=all (from listFixtures)
    const ids = rows.map((r) => r.id);
    expect(ids).toContain(propActiveApartment);
    expect(ids).toContain(propActiveHouse);
    expect(ids).toContain(propDeletedCottage);
  });
});

describe("owners aggregation", () => {
  it("returns all owners for a multi-owner property", async () => {
    const rows = await listFixtures();
    const house = rows.find((r) => r.id === propActiveHouse);
    expect(house).toBeDefined();
    const ownerIds = house!.owners.map((o) => o.id);
    expect(ownerIds).toContain(userId1);
    expect(ownerIds).toContain(userId2);
  });

  it("returns empty owners array for a property with no active owner access", async () => {
    // Create a property with no access rows
    const [prop] = await db
      .insert(properties)
      .values({ name: "Query Test No Owners", type: "other" })
      .returning({ id: properties.id });
    const noOwnerId = prop!.id;
    try {
      const params = await loadAdminPropertiesParams({ status: "all", pageSize: "100" });
      const result = await getAdminPropertiesList(params);
      const row = result.data.find((r) => r.id === noOwnerId);
      expect(row).toBeDefined();
      expect(row!.owners).toHaveLength(0);
    } finally {
      await db.delete(properties).where(eq(properties.id, noOwnerId));
    }
  });
});

describe("services count", () => {
  it("counts only active services (deletedAt IS NULL)", async () => {
    // Apartment has 2 services: 1 active + 1 soft-deleted → count = 1
    const rows = await listFixtures({ status: "active" });
    const apartment = rows.find((r) => r.id === propActiveApartment);
    expect(apartment).toBeDefined();
    expect(apartment!.servicesCount).toBe(1);
  });
});

describe("pagination", () => {
  it("clamps pageSize at 100", async () => {
    const params = await loadAdminPropertiesParams({ pageSize: "999", status: "all" });
    expect(params.pageSize).toBe(100);
  });

  it("returns empty data with accurate pagination for a page beyond the data", async () => {
    const params = await loadAdminPropertiesParams({ page: "9999", pageSize: "25", status: "all" });
    const result = await getAdminPropertiesList(params);
    expect(result.data).toHaveLength(0);
    expect(result.pagination.page).toBe(9999);
    expect(result.pagination.total).toBeGreaterThan(0);
    expect(result.pagination.totalPages).toBeGreaterThanOrEqual(1);
  });
});

describe("sorting", () => {
  it("invalid sortBy falls back to createdAt desc", async () => {
    const params = await loadAdminPropertiesParams({ sortBy: "nonexistent_column" });
    expect(params.sortBy).toBe("createdAt");
    expect(params.sortOrder).toBe("desc");
  });
});
