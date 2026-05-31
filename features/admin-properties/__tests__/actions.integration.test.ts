import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { properties } from "@/lib/db/schema/properties";
import type { PropertyId } from "@/lib/db/schema/properties";
import { services } from "@/lib/db/schema/services";
import type { TServiceId } from "@/lib/db/schema/services";
import { serviceTypes } from "@/lib/db/schema/service-types";
import type { TServiceTypeId } from "@/lib/db/schema/service-types";
import { auth } from "@/lib/auth";
import { ForbiddenError } from "@/lib/errors";

import { restoreProperty, hardDeleteProperty } from "../actions";

vi.mock("next/navigation", () => ({ notFound: vi.fn() }));

const mockAdmin = () =>
  vi.mocked(auth).mockResolvedValue({
    user: { id: "admin-actions-test-id", systemRole: "admin" },
  } as unknown as Awaited<ReturnType<typeof auth>>);

const mockNonAdmin = () =>
  vi.mocked(auth).mockResolvedValue({
    user: { id: "user-actions-test-id", systemRole: "user" },
  } as unknown as Awaited<ReturnType<typeof auth>>);

let serviceTypeId1: TServiceTypeId;
let serviceTypeId2: TServiceTypeId;

beforeAll(async () => {
  const sts = await db.select({ id: serviceTypes.id }).from(serviceTypes).limit(2);
  serviceTypeId1 = sts[0]!.id;
  serviceTypeId2 = sts[1]!.id;
});

beforeEach(() => {
  mockAdmin();
});

// --- restoreProperty ---

describe("restoreProperty", () => {
  describe("restores property and children stamped with matching deletedAt", () => {
    let propId: PropertyId;
    let svcId: TServiceId;
    const stamp = new Date("2025-03-10T10:00:00.000Z");

    beforeAll(async () => {
      const [prop] = await db
        .insert(properties)
        .values({ name: "Admin Actions Test — Restore Cascade", type: "apartment" })
        .returning({ id: properties.id });
      propId = prop!.id;

      const [svc] = await db
        .insert(services)
        .values({ propertyId: propId, serviceTypeId: serviceTypeId1 })
        .returning({ id: services.id });
      svcId = svc!.id;

      await db.update(properties).set({ deletedAt: stamp }).where(eq(properties.id, propId));
      await db.update(services).set({ deletedAt: stamp }).where(eq(services.id, svcId));
    });

    afterAll(async () => {
      await db.delete(services).where(eq(services.id, svcId));
      await db.delete(properties).where(eq(properties.id, propId));
    });

    it("restores property and cascade-deleted service", async () => {
      const result = await restoreProperty(propId);
      expect(result.ok).toBe(true);

      const propRow = await db
        .select({ deletedAt: properties.deletedAt })
        .from(properties)
        .where(eq(properties.id, propId));
      expect(propRow[0]!.deletedAt).toBeNull();

      const svcRow = await db
        .select({ deletedAt: services.deletedAt })
        .from(services)
        .where(eq(services.id, svcId));
      expect(svcRow[0]!.deletedAt).toBeNull();
    });
  });

  describe("does not restore child with earlier independent deletedAt", () => {
    let propId: PropertyId;
    let svcCascadeId: TServiceId;
    let svcIndependentId: TServiceId;
    const earlyStamp = new Date("2025-01-01T00:00:00.000Z");
    const cascadeStamp = new Date("2025-03-15T12:00:00.000Z");

    beforeAll(async () => {
      const [prop] = await db
        .insert(properties)
        .values({ name: "Admin Actions Test — Independent Delete", type: "house" })
        .returning({ id: properties.id });
      propId = prop!.id;

      const svcs = await db
        .insert(services)
        .values([
          { propertyId: propId, serviceTypeId: serviceTypeId1 },
          { propertyId: propId, serviceTypeId: serviceTypeId2 },
        ])
        .returning({ id: services.id });
      svcCascadeId = svcs[0]!.id;
      svcIndependentId = svcs[1]!.id;

      // svcIndependent was deleted before the cascade
      await db
        .update(services)
        .set({ deletedAt: earlyStamp })
        .where(eq(services.id, svcIndependentId));
      // Property + svcCascade share the cascade stamp
      await db.update(properties).set({ deletedAt: cascadeStamp }).where(eq(properties.id, propId));
      await db
        .update(services)
        .set({ deletedAt: cascadeStamp })
        .where(eq(services.id, svcCascadeId));
    });

    afterAll(async () => {
      await db.delete(services).where(eq(services.propertyId, propId));
      await db.delete(properties).where(eq(properties.id, propId));
    });

    it("restores property and cascade-deleted service, leaves independent service deleted", async () => {
      const result = await restoreProperty(propId);
      expect(result.ok).toBe(true);

      const propRow = await db
        .select({ deletedAt: properties.deletedAt })
        .from(properties)
        .where(eq(properties.id, propId));
      expect(propRow[0]!.deletedAt).toBeNull();

      const svcCascadeRow = await db
        .select({ deletedAt: services.deletedAt })
        .from(services)
        .where(eq(services.id, svcCascadeId));
      expect(svcCascadeRow[0]!.deletedAt).toBeNull();

      const svcIndependentRow = await db
        .select({ deletedAt: services.deletedAt })
        .from(services)
        .where(eq(services.id, svcIndependentId));
      // earlyStamp — not restored because it predates the cascade stamp
      expect(svcIndependentRow[0]!.deletedAt).toEqual(earlyStamp);
    });
  });

  it("returns NOT_DELETED error for an active (non-deleted) property", async () => {
    const [prop] = await db
      .insert(properties)
      .values({ name: "Admin Actions Test — NOT_DELETED", type: "cottage" })
      .returning({ id: properties.id });
    const propId = prop!.id;
    try {
      const result = await restoreProperty(propId);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error.message).toBe("NOT_DELETED");

      // No write: property remains active
      const row = await db
        .select({ deletedAt: properties.deletedAt })
        .from(properties)
        .where(eq(properties.id, propId));
      expect(row[0]!.deletedAt).toBeNull();
    } finally {
      await db.delete(properties).where(eq(properties.id, propId));
    }
  });

  it("non-admin → throws ForbiddenError", async () => {
    mockNonAdmin();
    await expect(restoreProperty("00000000-0000-0000-0000-000000000000")).rejects.toBeInstanceOf(
      ForbiddenError,
    );
  });
});

// --- hardDeleteProperty ---

describe("hardDeleteProperty", () => {
  it("returns NOT_SOFT_DELETED for an active property, no deletion", async () => {
    const [prop] = await db
      .insert(properties)
      .values({ name: "Admin Actions Test — NOT_SOFT_DELETED", type: "apartment" })
      .returning({ id: properties.id });
    const propId = prop!.id;
    try {
      const result = await hardDeleteProperty(propId);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error.message).toBe("NOT_SOFT_DELETED");

      // Property still in DB
      const rows = await db
        .select({ id: properties.id })
        .from(properties)
        .where(eq(properties.id, propId));
      expect(rows).toHaveLength(1);
    } finally {
      await db.delete(properties).where(eq(properties.id, propId));
    }
  });

  it("physically removes soft-deleted property and FK-cascaded children", async () => {
    const [prop] = await db
      .insert(properties)
      .values({ name: "Admin Actions Test — Hard Delete", type: "house" })
      .returning({ id: properties.id });
    const propId = prop!.id;

    const [svc] = await db
      .insert(services)
      .values({ propertyId: propId, serviceTypeId: serviceTypeId1 })
      .returning({ id: services.id });
    const svcId = svc!.id;

    await db.update(properties).set({ deletedAt: new Date() }).where(eq(properties.id, propId));

    const result = await hardDeleteProperty(propId);
    expect(result.ok).toBe(true);

    const propRows = await db
      .select({ id: properties.id })
      .from(properties)
      .where(eq(properties.id, propId));
    expect(propRows).toHaveLength(0);

    // FK ON DELETE CASCADE removes the service
    const svcRows = await db
      .select({ id: services.id })
      .from(services)
      .where(eq(services.id, svcId));
    expect(svcRows).toHaveLength(0);
  });

  it("non-admin → throws ForbiddenError", async () => {
    mockNonAdmin();
    await expect(hardDeleteProperty("00000000-0000-0000-0000-000000000000")).rejects.toBeInstanceOf(
      ForbiddenError,
    );
  });
});
