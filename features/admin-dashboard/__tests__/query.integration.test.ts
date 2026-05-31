import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { count, eq, isNull, isNotNull } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema/auth";
import type { UserId } from "@/lib/db/schema/auth";
import { properties } from "@/lib/db/schema/properties";
import type { PropertyId } from "@/lib/db/schema/properties";
import { auth } from "@/lib/auth";

import { getAdminDashboardStats } from "../query";

vi.mock("next/navigation", () => ({ notFound: vi.fn() }));

// --- Auth mock ---

const mockAdmin = () =>
  vi.mocked(auth).mockResolvedValue({
    user: { id: "admin-stats-test-id", systemRole: "admin" },
  } as unknown as Awaited<ReturnType<typeof auth>>);

const mockNonAdmin = () =>
  vi.mocked(auth).mockResolvedValue({
    user: { id: "regular-stats-test-id", systemRole: "user" },
  } as unknown as Awaited<ReturnType<typeof auth>>);

// --- Fixtures ---
// Two users: one active, one soft-deleted.
// Two properties: one active, one soft-deleted.
// These fixtures let us assert:
//   - active counts include active rows and exclude soft-deleted ones
//   - soft-deleted sum includes both the deleted user and deleted property

let activeUserId: UserId;
let deletedUserId: UserId;
let activePropertyId: PropertyId;
let deletedPropertyId: PropertyId;

beforeAll(async () => {
  const insertedUsers = await db
    .insert(users)
    .values([
      { email: "admin-stats-test-active@test.invalid", name: "Stats Test Active" },
      { email: "admin-stats-test-deleted@test.invalid", name: "Stats Test Deleted" },
    ])
    .returning({ id: users.id });

  activeUserId = insertedUsers[0]!.id;
  deletedUserId = insertedUsers[1]!.id;

  await db.update(users).set({ deletedAt: new Date() }).where(eq(users.id, deletedUserId));

  const insertedProps = await db
    .insert(properties)
    .values([
      { name: "Admin Stats Test Active Prop", type: "apartment" },
      { name: "Admin Stats Test Deleted Prop", type: "house" },
    ])
    .returning({ id: properties.id });

  activePropertyId = insertedProps[0]!.id;
  deletedPropertyId = insertedProps[1]!.id;

  await db
    .update(properties)
    .set({ deletedAt: new Date() })
    .where(eq(properties.id, deletedPropertyId));
});

beforeEach(() => {
  mockAdmin();
});

afterAll(async () => {
  await db.delete(properties).where(eq(properties.id, activePropertyId));
  await db.delete(properties).where(eq(properties.id, deletedPropertyId));
  await db.delete(users).where(eq(users.id, activeUserId));
  await db.delete(users).where(eq(users.id, deletedUserId));
});

// --- Tests ---

describe("requireAdmin enforcement", () => {
  it("calls notFound() for a non-admin user", async () => {
    const { notFound } = await import("next/navigation");
    mockNonAdmin();
    // notFound() mock doesn't throw (unlike real Next.js), so assertAdmin falls through to
    // throw result.error — we expect both the rejection and the notFound call.
    await expect(getAdminDashboardStats()).rejects.toThrow();
    expect(notFound).toHaveBeenCalled();
  });
});

describe("active counts", () => {
  it("users count matches direct DB count of non-deleted users", async () => {
    const stats = await getAdminDashboardStats();
    const [row] = await db.select({ c: count() }).from(users).where(isNull(users.deletedAt));
    expect(stats.users).toBe(Number(row!.c));
  });

  it("properties count matches direct DB count of non-deleted properties", async () => {
    const stats = await getAdminDashboardStats();
    const [row] = await db
      .select({ c: count() })
      .from(properties)
      .where(isNull(properties.deletedAt));
    expect(stats.properties).toBe(Number(row!.c));
  });

  it("active fixture is included, soft-deleted fixture is excluded", async () => {
    const stats = await getAdminDashboardStats();
    // deletedUserId has deletedAt set — users count must not include it
    // We verify by checking the active count is consistent with direct queries
    const [activeUsersRow] = await db
      .select({ c: count() })
      .from(users)
      .where(isNull(users.deletedAt));
    const [deletedUsersRow] = await db
      .select({ c: count() })
      .from(users)
      .where(isNotNull(users.deletedAt));
    expect(stats.users).toBe(Number(activeUsersRow!.c));
    expect(stats.users).not.toBe(Number(activeUsersRow!.c) + Number(deletedUsersRow!.c));
  });
});

describe("soft-deleted count (properties only)", () => {
  it("equals the count of soft-deleted properties", async () => {
    const stats = await getAdminDashboardStats();
    const [row] = await db
      .select({ c: count() })
      .from(properties)
      .where(isNotNull(properties.deletedAt));
    // Our fixture contributes 1 soft-deleted property; DB may have more
    expect(stats.softDeleted).toBe(Number(row!.c));
  });

  it("does not count soft-deleted users (non-property entity)", async () => {
    // deletedUserId has deletedAt set; it must not appear in softDeleted
    const stats = await getAdminDashboardStats();
    const [propertiesDeletedRow] = await db
      .select({ c: count() })
      .from(properties)
      .where(isNotNull(properties.deletedAt));
    expect(stats.softDeleted).toBe(Number(propertiesDeletedRow!.c));
    // The deleted user is excluded: softDeleted is purely a property count
  });

  it("increases by 1 when a property is soft-deleted and decreases active count accordingly", async () => {
    const before = await getAdminDashboardStats();

    await db
      .update(properties)
      .set({ deletedAt: new Date() })
      .where(eq(properties.id, activePropertyId));

    const after = await getAdminDashboardStats();
    expect(after.softDeleted).toBe(before.softDeleted + 1);
    expect(after.properties).toBe(before.properties - 1);

    // Restore
    await db.update(properties).set({ deletedAt: null }).where(eq(properties.id, activePropertyId));
  });
});
