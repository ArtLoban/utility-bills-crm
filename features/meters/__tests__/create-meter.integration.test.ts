import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { and, eq, inArray, isNull } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema/auth";
import type { UserId } from "@/lib/db/schema/auth";
import { properties, propertyAccess, PROPERTY_ROLES } from "@/lib/db/schema/properties";
import type { PropertyId } from "@/lib/db/schema/properties";
import { serviceTypes } from "@/lib/db/schema/service-types";
import type { TServiceTypeId } from "@/lib/db/schema/service-types";
import { services } from "@/lib/db/schema/services";
import type { TServiceId } from "@/lib/db/schema/services";
import { meters } from "@/lib/db/schema/meters";
import type { MeterId } from "@/lib/db/schema/meters";
import { meterServices } from "@/lib/db/schema/meter-services";
import { ERROR_CODES } from "@/lib/errors";
import { auth } from "@/lib/auth";
import { getAvailableServiceTypesForMeter } from "@/app/(app)/properties/[id]/meters/_data/queries";

import { createMeter, replaceMeter } from "../actions";

let userId: UserId;
let propertyId: PropertyId;
let electricityTypeId: TServiceTypeId;
let gasTypeId: TServiceTypeId;
let elecServiceA: TServiceId;
let elecServiceB: TServiceId;
let gasService: TServiceId;

const asOwner = () =>
  vi
    .mocked(auth)
    .mockResolvedValue({ user: { id: userId } } as unknown as Awaited<ReturnType<typeof auth>>);

beforeAll(async () => {
  const sts = await db
    .select({ id: serviceTypes.id, code: serviceTypes.code })
    .from(serviceTypes)
    .where(inArray(serviceTypes.code, ["electricity", "gas"]));
  electricityTypeId = sts.find((s) => s.code === "electricity")!.id;
  gasTypeId = sts.find((s) => s.code === "gas")!.id;

  const [owner] = await db
    .insert(users)
    .values({ email: "create-meter-test@test.invalid", name: "Create Meter Test" })
    .returning({ id: users.id });
  userId = owner!.id;

  const [property] = await db
    .insert(properties)
    .values({ name: "Create Meter Property", type: "apartment" })
    .returning({ id: properties.id });
  propertyId = property!.id;

  await db
    .insert(propertyAccess)
    .values({ propertyId, userId, propertyRole: PROPERTY_ROLES.OWNER, grantedBy: userId });

  // Two electricity services (same type) + one gas service, on one property.
  const svc = await db
    .insert(services)
    .values([
      { propertyId, serviceTypeId: electricityTypeId, name: "Main" },
      { propertyId, serviceTypeId: electricityTypeId, name: "Studio" },
      { propertyId, serviceTypeId: gasTypeId },
    ])
    .returning({ id: services.id, serviceTypeId: services.serviceTypeId });

  const elec = svc.filter((s) => s.serviceTypeId === electricityTypeId).map((s) => s.id);
  elecServiceA = elec[0]!;
  elecServiceB = elec[1]!;
  gasService = svc.find((s) => s.serviceTypeId === gasTypeId)!.id;
});

afterEach(async () => {
  // Deleting meters cascades to meter_services.
  await db.delete(meters).where(eq(meters.propertyId, propertyId));
  vi.clearAllMocks();
});

afterAll(async () => {
  await db.delete(properties).where(eq(properties.id, propertyId));
  await db.delete(users).where(eq(users.id, userId));
});

const activeLinks = (meterId: MeterId) =>
  db
    .select({ serviceId: meterServices.serviceId })
    .from(meterServices)
    .where(and(eq(meterServices.meterId, meterId), isNull(meterServices.deletedAt)));

describe("createMeter — explicit service links (Slice B2)", () => {
  it("writes a link per selected service (one meter feeding several services)", async () => {
    asOwner();
    const result = await createMeter({
      propertyId,
      serviceTypeId: electricityTypeId,
      serviceIds: [elecServiceA, elecServiceB],
      zoneCount: 1,
      validFrom: "2024-01-01T00:00:00Z",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const links = await activeLinks(result.value.id);
    expect(links.map((l) => l.serviceId).sort()).toEqual([elecServiceA, elecServiceB].sort());
  });

  it("allows a second active meter of a type that already has one", async () => {
    asOwner();
    const first = await createMeter({
      propertyId,
      serviceTypeId: electricityTypeId,
      serviceIds: [elecServiceA],
      zoneCount: 1,
      validFrom: "2024-01-01T00:00:00Z",
    });
    const second = await createMeter({
      propertyId,
      serviceTypeId: electricityTypeId,
      serviceIds: [elecServiceB],
      zoneCount: 1,
      validFrom: "2024-01-01T00:00:00Z",
    });

    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);

    const active = await db
      .select({ id: meters.id })
      .from(meters)
      .where(
        and(
          eq(meters.propertyId, propertyId),
          eq(meters.serviceTypeId, electricityTypeId),
          isNull(meters.validTo),
          isNull(meters.deletedAt),
        ),
      );
    expect(active).toHaveLength(2);
  });

  it("rejects a service of a different type and creates no meter", async () => {
    asOwner();
    const result = await createMeter({
      propertyId,
      serviceTypeId: electricityTypeId,
      serviceIds: [gasService],
      zoneCount: 1,
      validFrom: "2024-01-01T00:00:00Z",
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe(ERROR_CODES.VALIDATION);
    if (result.error.code === ERROR_CODES.VALIDATION) {
      expect(result.error.message).toBe("validation.serviceIds.invalid");
    }

    const created = await db.select().from(meters).where(eq(meters.propertyId, propertyId));
    expect(created).toHaveLength(0);
  });

  it("replacement inherits the closed meter's links", async () => {
    asOwner();
    const created = await createMeter({
      propertyId,
      serviceTypeId: electricityTypeId,
      serviceIds: [elecServiceA],
      zoneCount: 1,
      validFrom: "2024-01-01T00:00:00Z",
    });
    expect(created.ok).toBe(true);
    if (!created.ok) return;

    const replaced = await replaceMeter({
      currentMeterId: created.value.id,
      replacementDate: "2024-06-01T00:00:00Z",
      zoneCount: 1,
    });
    expect(replaced.ok).toBe(true);
    if (!replaced.ok) return;

    const links = await activeLinks(replaced.value.id);
    expect(links.map((l) => l.serviceId)).toEqual([elecServiceA]);
  });
});

describe("getAvailableServiceTypesForMeter — relaxed filter (Slice B2)", () => {
  it("still offers a type that already has an active meter", async () => {
    asOwner();
    const created = await createMeter({
      propertyId,
      serviceTypeId: electricityTypeId,
      serviceIds: [elecServiceA],
      zoneCount: 1,
      validFrom: "2024-01-01T00:00:00Z",
    });
    expect(created.ok).toBe(true);

    asOwner();
    const available = await getAvailableServiceTypesForMeter(propertyId);
    expect(available.map((st) => st.id)).toContain(electricityTypeId);
  });
});
