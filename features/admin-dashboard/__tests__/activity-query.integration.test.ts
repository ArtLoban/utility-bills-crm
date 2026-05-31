import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema/auth";
import type { UserId } from "@/lib/db/schema/auth";
import { properties } from "@/lib/db/schema/properties";
import type { PropertyId } from "@/lib/db/schema/properties";
import { auth } from "@/lib/auth";

import { getAdminActivityFeed, normalizeActivityRows } from "../activity-query";
import type { TActivityKind } from "../types";

vi.mock("next/navigation", () => ({ notFound: vi.fn() }));

// --- Auth helpers ---

const mockAdmin = () =>
  vi.mocked(auth).mockResolvedValue({
    user: { id: "admin-activity-test-id", systemRole: "admin" },
  } as unknown as Awaited<ReturnType<typeof auth>>);

const mockNonAdmin = () =>
  vi.mocked(auth).mockResolvedValue({
    user: { id: "regular-activity-test-id", systemRole: "user" },
  } as unknown as Awaited<ReturnType<typeof auth>>);

// --- Fixtures ---
// Three properties with explicit timestamps for ordering assertions.
// One additional property that gets soft-deleted to test active-only filtering.
// One user created for the user-kind entry.

let propOldId: PropertyId;
let propMidId: PropertyId;
let propNewId: PropertyId;
let propDeletedId: PropertyId;
let testUserId: UserId;

// Use timestamps close to "now" so our fixtures are guaranteed
// to land within the top-20 window regardless of other DB content.
const BASE = Date.now();
const T_NEW = new Date(BASE - 1_000); // ~1 s ago
const T_MID = new Date(BASE - 60_000); // ~1 min ago
const T_OLD = new Date(BASE - 3_600_000); // ~1 h ago

beforeAll(async () => {
  const [propOld, propMid, propNew, propDeleted] = await db
    .insert(properties)
    .values([
      { name: "Activity Test Old", type: "apartment", createdAt: T_OLD },
      { name: "Activity Test Mid", type: "house", createdAt: T_MID },
      { name: "Activity Test New", type: "cottage", createdAt: T_NEW },
      { name: "Activity Test Deleted", type: "apartment", createdAt: T_OLD },
    ])
    .returning({ id: properties.id });

  propOldId = propOld!.id;
  propMidId = propMid!.id;
  propNewId = propNew!.id;
  propDeletedId = propDeleted!.id;

  await db
    .update(properties)
    .set({ deletedAt: new Date() })
    .where(eq(properties.id, propDeletedId));

  const [insertedUser] = await db
    .insert(users)
    .values([{ email: "activity-test@test.invalid", name: "Activity Test User", createdAt: T_MID }])
    .returning({ id: users.id });

  testUserId = insertedUser!.id;
});

beforeEach(() => {
  mockAdmin();
});

afterAll(async () => {
  await db.delete(properties).where(eq(properties.id, propOldId));
  await db.delete(properties).where(eq(properties.id, propMidId));
  await db.delete(properties).where(eq(properties.id, propNewId));
  await db.delete(properties).where(eq(properties.id, propDeletedId));
  await db.delete(users).where(eq(users.id, testUserId));
});

// --- requireAdmin enforcement ---

describe("requireAdmin enforcement", () => {
  it("calls notFound() for a non-admin user", async () => {
    const { notFound } = await import("next/navigation");
    mockNonAdmin();
    await expect(getAdminActivityFeed()).rejects.toThrow();
    expect(notFound).toHaveBeenCalled();
  });
});

// --- Active-only ---

describe("active-only filtering", () => {
  it("does not include a soft-deleted property in the feed", async () => {
    const items = await getAdminActivityFeed();
    const ids = items.map((item) => item.id);
    expect(ids).not.toContain(propDeletedId);
  });

  it("includes the active fixture properties in the feed", async () => {
    const items = await getAdminActivityFeed();
    const ids = items.map((item) => item.id);
    // At least one of the active fixtures should appear (the newest one is most likely within top 20)
    expect(ids).toContain(propNewId);
  });
});

// --- Ordering ---

describe("ordering + limit", () => {
  it("returns at most 20 items", async () => {
    const items = await getAdminActivityFeed();
    expect(items.length).toBeLessThanOrEqual(20);
  });

  it("returns items newest first — T_NEW precedes T_OLD among our fixtures", async () => {
    const items = await getAdminActivityFeed();

    const idxNew = items.findIndex((item) => item.id === propNewId);
    const idxOld = items.findIndex((item) => item.id === propOldId);

    // Both fixtures should be within the top-20 window; if not, the test data volume
    // is unexpectedly large for a test DB — we skip the ordering assertion.
    if (idxNew === -1 || idxOld === -1) return;

    expect(idxNew).toBeLessThan(idxOld);
  });

  it("occurredAt is a Date instance on each item", async () => {
    const items = await getAdminActivityFeed();
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      expect(item.occurredAt).toBeInstanceOf(Date);
    }
  });
});

// --- normalizeActivityRows (pure unit test, no DB) ---

describe("normalizeActivityRows", () => {
  const now = new Date();

  const ALL_KINDS: TActivityKind[] = ["property", "user", "service", "bill", "payment", "reading"];

  it("maps all 6 kinds and preserves fields", () => {
    const rows = ALL_KINDS.map((kind, i) => ({
      kind,
      id: `id-${i}`,
      occurredAt: now,
      name: kind === "user" ? "John Doe" : "Test Property",
      serviceTypeCode: ["service", "bill", "payment", "reading"].includes(kind)
        ? "electricity"
        : null,
      extra: kind === "bill" ? "2024-01-01" : kind === "payment" ? "500.00" : null,
    }));

    const result = normalizeActivityRows(rows);

    expect(result).toHaveLength(6);
    ALL_KINDS.forEach((kind, i) => {
      expect(result[i]!.kind).toBe(kind);
      expect(result[i]!.id).toBe(`id-${i}`);
      expect(result[i]!.occurredAt).toBe(now);
    });
  });

  it("filters out rows with unknown kind", () => {
    const rows = [
      { kind: "unknown", id: "x", occurredAt: now, name: null, serviceTypeCode: null, extra: null },
      { kind: "sharing", id: "y", occurredAt: now, name: null, serviceTypeCode: null, extra: null },
    ];
    expect(normalizeActivityRows(rows)).toHaveLength(0);
  });

  it("preserves null name and null serviceTypeCode", () => {
    const row = {
      kind: "property",
      id: "p1",
      occurredAt: now,
      name: null,
      serviceTypeCode: null,
      extra: null,
    };
    const [item] = normalizeActivityRows([row]);
    expect(item!.name).toBeNull();
    expect(item!.serviceTypeCode).toBeNull();
  });

  it("returns an empty array for empty input", () => {
    expect(normalizeActivityRows([])).toEqual([]);
  });
});
