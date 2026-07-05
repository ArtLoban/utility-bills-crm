import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { and, eq, inArray, isNull } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema/auth";
import type { UserId } from "@/lib/db/schema/auth";
import { properties, propertyAccess, PROPERTY_ROLES } from "@/lib/db/schema/properties";
import type { PropertyId } from "@/lib/db/schema/properties";
import { providers } from "@/lib/db/schema/providers";
import type { ProviderId } from "@/lib/db/schema/providers";
import { serviceTypes } from "@/lib/db/schema/service-types";
import type { TServiceTypeId } from "@/lib/db/schema/service-types";
import { services } from "@/lib/db/schema/services";
import { contracts } from "@/lib/db/schema/contracts";
import { tariffs } from "@/lib/db/schema/tariffs";
import { meters } from "@/lib/db/schema/meters";
import { meterServices } from "@/lib/db/schema/meter-services";
import { ERROR_CODES } from "@/lib/errors";
import { auth } from "@/lib/auth";
import { createServiceWithSetup } from "../actions.composite";
import type { TCreateServiceWithSetupInput } from "../schema";

// --- Fixtures (populated in beforeAll) ---

let testUserId: UserId;
let testViewerUserId: UserId;
let testPropertyId: PropertyId;
let testProviderId: ProviderId;
let testMeteredServiceTypeId: TServiceTypeId;

// --- beforeAll: insert test fixtures directly (bypasses auth) ---

beforeAll(async () => {
  const [owner] = await db
    .insert(users)
    .values({ email: "test-composite-owner@test.invalid", name: "Test Owner" })
    .returning({ id: users.id });
  testUserId = owner!.id;

  const [viewer] = await db
    .insert(users)
    .values({ email: "test-composite-viewer@test.invalid", name: "Test Viewer" })
    .returning({ id: users.id });
  testViewerUserId = viewer!.id;

  const [property] = await db
    .insert(properties)
    .values({ name: "Test Property", type: "apartment" })
    .returning({ id: properties.id });
  testPropertyId = property!.id;

  await db.insert(propertyAccess).values([
    {
      propertyId: testPropertyId,
      userId: testUserId,
      propertyRole: PROPERTY_ROLES.OWNER,
      grantedBy: testUserId,
    },
    {
      propertyId: testPropertyId,
      userId: testViewerUserId,
      propertyRole: PROPERTY_ROLES.VIEWER,
      grantedBy: testUserId,
    },
  ]);

  const [provider] = await db
    .insert(providers)
    .values({ name: "Test Provider", ownerId: testUserId })
    .returning({ id: providers.id });
  testProviderId = provider!.id;

  // Look up any seeded metered + single-zone service type.
  const [serviceType] = await db
    .select({ id: serviceTypes.id })
    .from(serviceTypes)
    .where(
      and(
        eq(serviceTypes.measurementType, "metered"),
        eq(serviceTypes.supportsZones, false),
        eq(serviceTypes.isActive, true),
      ),
    )
    .limit(1);

  if (!serviceType) {
    throw new Error(
      "No metered/single-zone service type found — run seeds before integration tests",
    );
  }
  testMeteredServiceTypeId = serviceType.id;
});

// --- afterEach: hard-delete test-created service records in FK order ---

afterEach(async () => {
  // Collect service IDs created for testProperty in this test
  const serviceRows = await db
    .select({ id: services.id })
    .from(services)
    .where(eq(services.propertyId, testPropertyId));

  if (serviceRows.length > 0) {
    const serviceIds = serviceRows.map((r) => r.id);
    const contractRows = await db
      .select({ id: contracts.id })
      .from(contracts)
      .where(inArray(contracts.serviceId, serviceIds));

    if (contractRows.length > 0) {
      const contractIds = contractRows.map((r) => r.id);
      await db.delete(tariffs).where(inArray(tariffs.contractId, contractIds));
    }
    await db.delete(contracts).where(inArray(contracts.serviceId, serviceIds));
  }

  await db.delete(meters).where(eq(meters.propertyId, testPropertyId));
  await db.delete(services).where(eq(services.propertyId, testPropertyId));
});

// --- afterAll: hard-delete test fixtures ---

afterAll(async () => {
  await db.delete(propertyAccess).where(eq(propertyAccess.propertyId, testPropertyId));
  await db.delete(properties).where(eq(properties.id, testPropertyId));
  await db.delete(providers).where(eq(providers.id, testProviderId));
  await db.delete(users).where(inArray(users.id, [testUserId, testViewerUserId]));
});

// --- Input factory ---

const makeInput = (
  overrides?: Partial<TCreateServiceWithSetupInput>,
): TCreateServiceWithSetupInput => ({
  propertyId: testPropertyId,
  serviceTypeId: testMeteredServiceTypeId,
  providerId: testProviderId,
  contractValidFrom: "2024-01-01",
  tariffValidFrom: "2024-01-01",
  rateT1: "5.50",
  ...overrides,
});

// --- Tests ---

describe("createServiceWithSetup", () => {
  it("success with meter — creates service, contract, tariff, and meter", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: testUserId } } as unknown as Awaited<
      ReturnType<typeof auth>
    >);

    const result = await createServiceWithSetup(
      makeInput({
        meter: {
          zoneCount: 1,
          meterValidFrom: "2024-01-01T00:00:00Z",
        },
      }),
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const serviceId = result.value.id;

    // Service exists with correct links
    const [service] = await db
      .select()
      .from(services)
      .where(and(eq(services.id, serviceId), isNull(services.deletedAt)));
    expect(service).toBeDefined();
    expect(service!.propertyId).toBe(testPropertyId);
    expect(service!.serviceTypeId).toBe(testMeteredServiceTypeId);

    // Contract linked to service
    const [contract] = await db
      .select()
      .from(contracts)
      .where(and(eq(contracts.serviceId, serviceId), isNull(contracts.deletedAt)));
    expect(contract).toBeDefined();
    expect(contract!.providerId).toBe(testProviderId);

    // Tariff linked to contract
    const [tariff] = await db
      .select()
      .from(tariffs)
      .where(and(eq(tariffs.contractId, contract!.id), isNull(tariffs.deletedAt)));
    expect(tariff).toBeDefined();
    // DB stores NUMERIC as string with full precision (e.g. "5.5000"), compare numerically
    expect(parseFloat(tariff!.rateT1 ?? "")).toBe(5.5);

    // Meter linked to property + service type
    const [meter] = await db
      .select()
      .from(meters)
      .where(
        and(
          eq(meters.propertyId, testPropertyId),
          eq(meters.serviceTypeId, testMeteredServiceTypeId),
          isNull(meters.deletedAt),
        ),
      );
    expect(meter).toBeDefined();
    expect(meter!.zoneCount).toBe(1);
  });

  it("success without meter — creates service, contract, tariff; no meter row", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: testUserId } } as unknown as Awaited<
      ReturnType<typeof auth>
    >);

    const result = await createServiceWithSetup(makeInput());

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const serviceId = result.value.id;

    // Service and contract exist
    const [contract] = await db
      .select()
      .from(contracts)
      .where(and(eq(contracts.serviceId, serviceId), isNull(contracts.deletedAt)));
    expect(contract).toBeDefined();

    // Tariff exists
    const [tariff] = await db
      .select()
      .from(tariffs)
      .where(and(eq(tariffs.contractId, contract!.id), isNull(tariffs.deletedAt)));
    expect(tariff).toBeDefined();

    // No meter created
    const meterRows = await db
      .select()
      .from(meters)
      .where(
        and(
          eq(meters.propertyId, testPropertyId),
          eq(meters.serviceTypeId, testMeteredServiceTypeId),
        ),
      );
    expect(meterRows).toHaveLength(0);
  });

  it("allows a second meter of an already-metered type and links it to the new service", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: testUserId } } as unknown as Awaited<
      ReturnType<typeof auth>
    >);

    // A pre-existing active meter of the same type no longer blocks creating another — Slice B1
    // removed the temporal exclusion constraint, and multiple meters per type are now allowed.
    await db.insert(meters).values({
      propertyId: testPropertyId,
      serviceTypeId: testMeteredServiceTypeId,
      zoneCount: 1,
      validFrom: new Date("2020-01-01"),
      validTo: null,
    });

    const result = await createServiceWithSetup(
      makeInput({
        meter: {
          zoneCount: 1,
          meterValidFrom: "2020-01-01T00:00:00Z",
        },
      }),
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    // Two active meters of the type now coexist on the property.
    const activeMeters = await db
      .select({ id: meters.id })
      .from(meters)
      .where(
        and(
          eq(meters.propertyId, testPropertyId),
          eq(meters.serviceTypeId, testMeteredServiceTypeId),
          isNull(meters.validTo),
          isNull(meters.deletedAt),
        ),
      );
    expect(activeMeters).toHaveLength(2);

    // The newly created meter is explicitly linked to the newly created service (Slice B2).
    const links = await db
      .select({ serviceId: meterServices.serviceId })
      .from(meterServices)
      .where(eq(meterServices.serviceId, result.value.id));
    expect(links).toHaveLength(1);
  });

  it("permission denial — viewer receives NotFoundError, nothing is created", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: testViewerUserId } } as unknown as Awaited<
      ReturnType<typeof auth>
    >);

    const result = await createServiceWithSetup(makeInput());

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe(ERROR_CODES.NOT_FOUND);

    // No service was created
    const created = await db.select().from(services).where(eq(services.propertyId, testPropertyId));
    expect(created).toHaveLength(0);
  });
});
