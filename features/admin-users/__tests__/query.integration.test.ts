import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { and, eq, isNotNull } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema/auth";
import type { UserId } from "@/lib/db/schema/auth";
import { properties, propertyAccess } from "@/lib/db/schema/properties";
import type { PropertyId } from "@/lib/db/schema/properties";
import { auth } from "@/lib/auth";

import { getAdminUsersList } from "../query";
import { loadAdminUsersParams } from "../query-params";

// next/navigation notFound() is not available outside Next.js request context.
vi.mock("next/navigation", () => ({ notFound: vi.fn() }));

// --- Auth mock (admin session) ---

const mockAdmin = () =>
  vi.mocked(auth).mockResolvedValue({
    user: { id: "admin-test-id", systemRole: "admin" },
  } as unknown as Awaited<ReturnType<typeof auth>>);

// --- Fixtures ---

let adminId: UserId;
let userId1: UserId;
let userId2: UserId;
let deletedUserId: UserId;
let propertyId1: PropertyId;
let propertyId2: PropertyId;

beforeAll(async () => {
  const insertedUsers = await db
    .insert(users)
    .values([
      {
        email: "admin-query-test-admin@test.invalid",
        name: "Admin Test Admin",
        systemRole: "admin",
      },
      { email: "admin-query-test-user1@test.invalid", name: "Admin Test User1" },
      { email: "admin-query-test-user2@test.invalid", name: "Admin Test User2" },
      { email: "admin-query-test-deleted@test.invalid", name: "Admin Test Deleted" },
    ])
    .returning({ id: users.id });

  adminId = insertedUsers[0]!.id;
  userId1 = insertedUsers[1]!.id;
  userId2 = insertedUsers[2]!.id;
  deletedUserId = insertedUsers[3]!.id;

  // Soft-delete one user
  await db.update(users).set({ deletedAt: new Date() }).where(eq(users.id, deletedUserId));

  const insertedProps = await db
    .insert(properties)
    .values([
      { name: "Admin Query Test Prop1", type: "apartment" },
      { name: "Admin Query Test Prop2", type: "house" },
    ])
    .returning({ id: properties.id });

  propertyId1 = insertedProps[0]!.id;
  propertyId2 = insertedProps[1]!.id;
});

beforeEach(() => {
  mockAdmin();
});

afterAll(async () => {
  // Hard-delete all test fixtures
  await db.delete(propertyAccess).where(and(eq(propertyAccess.propertyId, propertyId1)));
  await db.delete(propertyAccess).where(and(eq(propertyAccess.propertyId, propertyId2)));
  await db.delete(properties).where(eq(properties.id, propertyId1));
  await db.delete(properties).where(eq(properties.id, propertyId2));
  await db.delete(users).where(eq(users.id, adminId));
  await db.delete(users).where(eq(users.id, userId1));
  await db.delete(users).where(eq(users.id, userId2));
  await db.delete(users).where(eq(users.id, deletedUserId));
});

const TEST_EMAILS = new Set([
  "admin-query-test-admin@test.invalid",
  "admin-query-test-user1@test.invalid",
  "admin-query-test-user2@test.invalid",
  "admin-query-test-deleted@test.invalid",
]);

// Helper: query with raw URL params (as page.tsx would receive), filter to test fixtures only.
const listFixtures = async (rawOverrides: Record<string, string> = {}) => {
  const params = await loadAdminUsersParams({ status: "all", pageSize: "100", ...rawOverrides });
  const result = await getAdminUsersList(params);
  return result.data.filter((u) => TEST_EMAILS.has(u.email));
};

// --- Tests ---

describe("role filter", () => {
  it("returns only admins when role=admin", async () => {
    const rows = await listFixtures({ systemRole: "admin" });
    expect(rows.every((u) => u.systemRole === "admin")).toBe(true);
    expect(rows.some((u) => u.email === "admin-query-test-admin@test.invalid")).toBe(true);
    expect(rows.some((u) => u.email === "admin-query-test-user1@test.invalid")).toBe(false);
  });

  it("returns only regular users when role=user", async () => {
    const rows = await listFixtures({ systemRole: "user" });
    expect(rows.every((u) => u.systemRole === "user")).toBe(true);
    expect(rows.some((u) => u.email === "admin-query-test-admin@test.invalid")).toBe(false);
  });
});

describe("status filter", () => {
  it("active excludes soft-deleted users (default)", async () => {
    const params = await loadAdminUsersParams({ pageSize: "100" }); // status defaults to "active"
    const result = await getAdminUsersList(params);
    const emails = result.data.map((u) => u.email);
    expect(emails).not.toContain("admin-query-test-deleted@test.invalid");
  });

  it("deleted returns only soft-deleted users", async () => {
    const rows = await listFixtures({ status: "deleted" });
    expect(rows.length).toBe(1);
    expect(rows[0]!.email).toBe("admin-query-test-deleted@test.invalid");
    expect(rows[0]!.deletedAt).not.toBeNull();
  });

  it("all returns both active and soft-deleted users", async () => {
    const rows = await listFixtures({ status: "all" });
    const emails = rows.map((u) => u.email);
    expect(emails).toContain("admin-query-test-user1@test.invalid");
    expect(emails).toContain("admin-query-test-deleted@test.invalid");
  });
});

describe("pagination", () => {
  it("clamps pageSize at 100", async () => {
    const params = await loadAdminUsersParams({ pageSize: "500", status: "all" });
    expect(params.pageSize).toBe(100);
  });

  it("returns empty data with accurate pagination for a page beyond the data", async () => {
    const params = await loadAdminUsersParams({ page: "9999", pageSize: "25", status: "all" });
    const result = await getAdminUsersList(params);
    expect(result.data).toHaveLength(0);
    expect(result.pagination.page).toBe(9999);
    expect(result.pagination.total).toBeGreaterThan(0);
    expect(result.pagination.totalPages).toBeGreaterThanOrEqual(1);
  });
});

describe("sorting", () => {
  it("invalid sortBy falls back to createdAt desc", async () => {
    const params = await loadAdminUsersParams({ sortBy: "nonexistent_column" });
    expect(params.sortBy).toBe("createdAt");
    expect(params.sortOrder).toBe("desc");
  });
});

describe("propertiesCount", () => {
  it("counts only active access rows (deletedAt IS NULL)", async () => {
    // userId1: 2 active + 1 soft-deleted access
    await db
      .delete(propertyAccess)
      .where(and(eq(propertyAccess.userId, userId1), eq(propertyAccess.propertyId, propertyId1)));
    await db
      .delete(propertyAccess)
      .where(and(eq(propertyAccess.userId, userId1), eq(propertyAccess.propertyId, propertyId2)));

    await db.insert(propertyAccess).values([
      { propertyId: propertyId1, userId: userId1, propertyRole: "owner", grantedBy: userId1 },
      { propertyId: propertyId2, userId: userId1, propertyRole: "editor", grantedBy: userId1 },
    ]);
    // Soft-delete one
    await db
      .update(propertyAccess)
      .set({ deletedAt: new Date() })
      .where(
        and(
          eq(propertyAccess.userId, userId1),
          eq(propertyAccess.propertyId, propertyId2),
          isNotNull(propertyAccess.userId),
        ),
      );

    const rows = await listFixtures({ status: "all" });
    const user1Row = rows.find((u) => u.email === "admin-query-test-user1@test.invalid");
    expect(user1Row).toBeDefined();
    // 2 inserted, 1 soft-deleted → should count 1
    expect(user1Row!.propertiesCount).toBe(1);

    // Cleanup
    await db.delete(propertyAccess).where(eq(propertyAccess.userId, userId1));
  });

  it("user with no access rows reports propertiesCount = 0", async () => {
    const rows = await listFixtures({ status: "all" });
    const user2Row = rows.find((u) => u.email === "admin-query-test-user2@test.invalid");
    expect(user2Row).toBeDefined();
    expect(user2Row!.propertiesCount).toBe(0);
  });
});
