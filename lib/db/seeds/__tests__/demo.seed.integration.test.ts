import { afterAll, describe, expect, it } from "vitest";
import { spawnSync } from "child_process";
import { and, count, eq, inArray } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema/auth";
import type { UserId } from "@/lib/db/schema/auth";
import { properties, propertyAccess, PROPERTY_ROLES } from "@/lib/db/schema/properties";
import type { PropertyId } from "@/lib/db/schema/properties";
import { providers } from "@/lib/db/schema/providers";
import { services } from "@/lib/db/schema/services";
import { bills } from "@/lib/db/schema/bills";
import { payments } from "@/lib/db/schema/payments";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const runSeed = (): void => {
  const result = spawnSync("node_modules/.bin/tsx", ["lib/db/seeds/demo.seed.ts"], {
    cwd: process.cwd(),
    env: { ...process.env },
    encoding: "utf-8",
    timeout: 120_000,
  });
  if (result.status !== 0) {
    throw new Error(`seed:demo failed (exit ${result.status}):\n${result.stderr || result.stdout}`);
  }
};

type TDemoSnapshot = {
  users: number;
  providers: number;
  properties: number;
  services: number;
  bills: number;
  payments: number;
};

const snapshotDemoData = async (): Promise<TDemoSnapshot> => {
  const demoUserRows = await db.select({ id: users.id }).from(users).where(eq(users.isDemo, true));

  const demoUserIds = demoUserRows.map((r) => r.id);

  if (demoUserIds.length === 0) {
    return { users: 0, providers: 0, properties: 0, services: 0, bills: 0, payments: 0 };
  }

  const demoPropRows = await db
    .select({ id: propertyAccess.propertyId })
    .from(propertyAccess)
    .where(
      and(
        inArray(propertyAccess.userId, demoUserIds),
        eq(propertyAccess.propertyRole, PROPERTY_ROLES.OWNER),
      ),
    );

  const demoPropIds = demoPropRows.map((r) => r.id);

  const [providerCount] = await db
    .select({ value: count() })
    .from(providers)
    .where(inArray(providers.ownerId, demoUserIds));

  if (demoPropIds.length === 0) {
    return {
      users: demoUserIds.length,
      providers: providerCount!.value,
      properties: 0,
      services: 0,
      bills: 0,
      payments: 0,
    };
  }

  const [serviceCount] = await db
    .select({ value: count() })
    .from(services)
    .where(inArray(services.propertyId, demoPropIds));

  const demoSvcRows = await db
    .select({ id: services.id })
    .from(services)
    .where(inArray(services.propertyId, demoPropIds));

  const demoSvcIds = demoSvcRows.map((r) => r.id);

  const [billCount] = await db
    .select({ value: count() })
    .from(bills)
    .where(inArray(bills.serviceId, demoSvcIds));

  const [paymentCount] = await db
    .select({ value: count() })
    .from(payments)
    .where(inArray(payments.serviceId, demoSvcIds));

  return {
    users: demoUserIds.length,
    providers: providerCount!.value,
    properties: demoPropIds.length,
    services: serviceCount!.value,
    bills: billCount!.value,
    payments: paymentCount!.value,
  };
};

// ---------------------------------------------------------------------------
// Cleanup
// ---------------------------------------------------------------------------

// IDs of non-demo fixtures created by the reseed-scope test
let scopeTestUserId: UserId | null = null;
let scopeTestPropertyId: PropertyId | null = null;

afterAll(async () => {
  // Wipe demo data
  const demoUserRows = await db.select({ id: users.id }).from(users).where(eq(users.isDemo, true));

  const demoUserIds = demoUserRows.map((r) => r.id);

  if (demoUserIds.length > 0) {
    const demoPropRows = await db
      .select({ id: propertyAccess.propertyId })
      .from(propertyAccess)
      .where(
        and(
          inArray(propertyAccess.userId, demoUserIds),
          eq(propertyAccess.propertyRole, PROPERTY_ROLES.OWNER),
        ),
      );

    const demoPropIds = demoPropRows.map((r) => r.id);

    if (demoPropIds.length > 0) {
      await db.delete(properties).where(inArray(properties.id, demoPropIds));
    }

    await db.delete(providers).where(inArray(providers.ownerId, demoUserIds));
    await db.delete(users).where(inArray(users.id, demoUserIds));
  }

  // Wipe non-demo fixtures from reseed-scope test
  if (scopeTestPropertyId) {
    await db.delete(properties).where(eq(properties.id, scopeTestPropertyId));
  }
  if (scopeTestUserId) {
    await db.delete(users).where(eq(users.id, scopeTestUserId));
  }
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("demo seed: idempotency", () => {
  it("running the seed twice produces identical row counts", async () => {
    runSeed();
    const first = await snapshotDemoData();

    runSeed();
    const second = await snapshotDemoData();

    expect(second).toEqual(first);

    // Sanity: the expected dataset shape is present
    expect(first.users).toBe(2);
    expect(first.properties).toBe(3);
  }, 120_000);
});

describe("demo seed: reseed scope", () => {
  it("reseed does not touch non-demo users or their properties", async () => {
    runSeed();

    // Insert a non-demo user + property that must survive the next seed run
    const [insertedUser] = await db
      .insert(users)
      .values({ email: "scope-guard@test.invalid", name: "Scope Guard" })
      .returning({ id: users.id });

    scopeTestUserId = insertedUser!.id;

    const [insertedProperty] = await db
      .insert(properties)
      .values({ name: "Scope Guard Property", type: "house" })
      .returning({ id: properties.id });

    scopeTestPropertyId = insertedProperty!.id;

    // Re-seed — wipe must stay scoped to isDemo users
    runSeed();

    const survivingUser = await db.query.users.findFirst({
      where: eq(users.id, scopeTestUserId),
    });

    const survivingProperty = await db.query.properties.findFirst({
      where: eq(properties.id, scopeTestPropertyId),
    });

    expect(survivingUser).toBeDefined();
    expect(survivingProperty).toBeDefined();
  }, 120_000);
});
