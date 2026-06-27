import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { eq, inArray } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema/auth";
import type { UserId } from "@/lib/db/schema/auth";
import { properties, propertyAccess, PROPERTY_ROLES } from "@/lib/db/schema/properties";
import type { PropertyId } from "@/lib/db/schema/properties";
import { services } from "@/lib/db/schema/services";
import type { TServiceId } from "@/lib/db/schema/services";
import { serviceTypes } from "@/lib/db/schema/service-types";
import { reminders, REMINDER_ANCHOR_TYPES } from "@/lib/db/schema/notifications";
import type { ReminderId } from "@/lib/db/schema/notifications";
import { ERROR_CODES } from "@/lib/errors";
import { auth } from "@/lib/auth";
import { createReminder, editReminder, deleteReminder } from "../actions";

// --- Fixtures ---

let ownerUserId: UserId;
let editorUserId: UserId;
let viewerUserId: UserId;
let outsiderUserId: UserId; // exists, but has no access to the test property
let testPropertyId: PropertyId;
let testServiceId: TServiceId;

const MISSING_SERVICE_ID = "00000000-0000-0000-0000-000000000000" as TServiceId;
const MISSING_REMINDER_ID = "00000000-0000-0000-0000-000000000000" as ReminderId;

const mockAuth = (userId: UserId) =>
  vi
    .mocked(auth)
    .mockResolvedValue({ user: { id: userId } } as unknown as Awaited<ReturnType<typeof auth>>);

// Demo sessions are gated before any DB access — the id only needs to be syntactically valid.
const mockDemoAuth = () =>
  vi.mocked(auth).mockResolvedValue({
    user: { id: ownerUserId, isDemo: true },
  } as unknown as Awaited<ReturnType<typeof auth>>);

// Inserts a baseline reminder owned by ownerUserId on the test service; returns its id.
const seedReminder = async (): Promise<ReminderId> => {
  const [row] = await db
    .insert(reminders)
    .values({
      userId: ownerUserId,
      serviceId: testServiceId,
      anchorType: REMINDER_ANCHOR_TYPES.DAY_OF_MONTH,
      anchorValue: 10,
      text: "original",
    })
    .returning({ id: reminders.id });
  return row!.id;
};

beforeAll(async () => {
  // Service types are seeded via migration — look up by code.
  const [electricityType] = await db
    .select({ id: serviceTypes.id })
    .from(serviceTypes)
    .where(eq(serviceTypes.code, "electricity"))
    .limit(1);

  const insertedUsers = await db
    .insert(users)
    .values([
      { email: "test-reminders-owner@test.invalid", name: "Reminders Owner" },
      { email: "test-reminders-editor@test.invalid", name: "Reminders Editor" },
      { email: "test-reminders-viewer@test.invalid", name: "Reminders Viewer" },
      { email: "test-reminders-outsider@test.invalid", name: "Reminders Outsider" },
    ])
    .returning({ id: users.id });

  ownerUserId = insertedUsers[0]!.id;
  editorUserId = insertedUsers[1]!.id;
  viewerUserId = insertedUsers[2]!.id;
  outsiderUserId = insertedUsers[3]!.id;

  const [property] = await db
    .insert(properties)
    .values({ name: "Test Reminders Property", type: "apartment" })
    .returning({ id: properties.id });
  testPropertyId = property!.id;

  await db.insert(propertyAccess).values([
    {
      propertyId: testPropertyId,
      userId: ownerUserId,
      propertyRole: PROPERTY_ROLES.OWNER,
      grantedBy: ownerUserId,
    },
    {
      propertyId: testPropertyId,
      userId: editorUserId,
      propertyRole: PROPERTY_ROLES.EDITOR,
      grantedBy: ownerUserId,
    },
    {
      propertyId: testPropertyId,
      userId: viewerUserId,
      propertyRole: PROPERTY_ROLES.VIEWER,
      grantedBy: ownerUserId,
    },
  ]);

  const [service] = await db
    .insert(services)
    .values({ propertyId: testPropertyId, serviceTypeId: electricityType!.id })
    .returning({ id: services.id });
  testServiceId = service!.id;
});

// Hard-delete all reminders on the test service between tests — no uniqueness to preserve,
// just a clean slate for each case.
beforeEach(async () => {
  await db.delete(reminders).where(eq(reminders.serviceId, testServiceId));
});

afterAll(async () => {
  // FK cascade removes services, propertyAccess, and reminders under the property.
  await db.delete(properties).where(eq(properties.id, testPropertyId));
  await db
    .delete(users)
    .where(inArray(users.id, [ownerUserId, editorUserId, viewerUserId, outsiderUserId]));
});

// --- createReminder ---

describe("createReminder", () => {
  it("owner happy path — inserts a day_of_month reminder and returns its id", async () => {
    mockAuth(ownerUserId);
    const result = await createReminder({
      serviceId: testServiceId,
      anchorType: REMINDER_ANCHOR_TYPES.DAY_OF_MONTH,
      anchorValue: 15,
      text: "  Pay electricity  ",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const [row] = await db.select().from(reminders).where(eq(reminders.id, result.value)).limit(1);

    expect(row).toBeDefined();
    expect(row!.userId).toBe(ownerUserId);
    expect(row!.serviceId).toBe(testServiceId);
    expect(row!.anchorType).toBe(REMINDER_ANCHOR_TYPES.DAY_OF_MONTH);
    expect(row!.anchorValue).toBe(15);
    expect(row!.text).toBe("Pay electricity"); // trimmed by the schema
  });

  it("editor happy path — inserts a days_before_end reminder", async () => {
    mockAuth(editorUserId);
    const result = await createReminder({
      serviceId: testServiceId,
      anchorType: REMINDER_ANCHOR_TYPES.DAYS_BEFORE_END,
      anchorValue: 0,
      text: "Last day of month",
    });
    expect(result.ok).toBe(true);
  });

  it("viewer — ForbiddenError (can see the service but cannot mutate)", async () => {
    mockAuth(viewerUserId);
    const result = await createReminder({
      serviceId: testServiceId,
      anchorType: REMINDER_ANCHOR_TYPES.DAY_OF_MONTH,
      anchorValue: 5,
      text: "nope",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe(ERROR_CODES.FORBIDDEN);
  });

  it("outsider with no access — NotFoundError (404-masked)", async () => {
    mockAuth(outsiderUserId);
    const result = await createReminder({
      serviceId: testServiceId,
      anchorType: REMINDER_ANCHOR_TYPES.DAY_OF_MONTH,
      anchorValue: 5,
      text: "nope",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe(ERROR_CODES.NOT_FOUND);
  });

  it("nonexistent service — NotFoundError", async () => {
    mockAuth(ownerUserId);
    const result = await createReminder({
      serviceId: MISSING_SERVICE_ID,
      anchorType: REMINDER_ANCHOR_TYPES.DAY_OF_MONTH,
      anchorValue: 5,
      text: "nope",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe(ERROR_CODES.NOT_FOUND);
  });

  it("demo user — DemoModeError, nothing inserted", async () => {
    mockDemoAuth();
    const result = await createReminder({
      serviceId: testServiceId,
      anchorType: REMINDER_ANCHOR_TYPES.DAY_OF_MONTH,
      anchorValue: 5,
      text: "demo",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe(ERROR_CODES.DEMO_MODE);

    const rows = await db.select().from(reminders).where(eq(reminders.serviceId, testServiceId));
    expect(rows).toHaveLength(0);
  });

  it("day_of_month anchorValue out of range (32) — ValidationError", async () => {
    mockAuth(ownerUserId);
    const result = await createReminder({
      serviceId: testServiceId,
      anchorType: REMINDER_ANCHOR_TYPES.DAY_OF_MONTH,
      anchorValue: 32,
      text: "bad",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe(ERROR_CODES.VALIDATION);
  });

  it("days_before_end anchorValue out of range (28) — ValidationError", async () => {
    mockAuth(ownerUserId);
    const result = await createReminder({
      serviceId: testServiceId,
      anchorType: REMINDER_ANCHOR_TYPES.DAYS_BEFORE_END,
      anchorValue: 28,
      text: "bad",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe(ERROR_CODES.VALIDATION);
  });

  it("blank text (whitespace only) — ValidationError", async () => {
    mockAuth(ownerUserId);
    const result = await createReminder({
      serviceId: testServiceId,
      anchorType: REMINDER_ANCHOR_TYPES.DAY_OF_MONTH,
      anchorValue: 5,
      text: "   ",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe(ERROR_CODES.VALIDATION);
  });

  it("text over 280 characters — ValidationError", async () => {
    mockAuth(ownerUserId);
    const result = await createReminder({
      serviceId: testServiceId,
      anchorType: REMINDER_ANCHOR_TYPES.DAY_OF_MONTH,
      anchorValue: 5,
      text: "a".repeat(281),
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe(ERROR_CODES.VALIDATION);
  });
});

// --- editReminder ---

describe("editReminder", () => {
  it("owner edits their own reminder — anchor and text are updated", async () => {
    const reminderId = await seedReminder();
    mockAuth(ownerUserId);

    const result = await editReminder(reminderId, {
      anchorType: REMINDER_ANCHOR_TYPES.DAYS_BEFORE_END,
      anchorValue: 3,
      text: "updated",
    });
    expect(result.ok).toBe(true);

    const [row] = await db.select().from(reminders).where(eq(reminders.id, reminderId)).limit(1);
    expect(row!.anchorType).toBe(REMINDER_ANCHOR_TYPES.DAYS_BEFORE_END);
    expect(row!.anchorValue).toBe(3);
    expect(row!.text).toBe("updated");
  });

  it("another user's reminder — NotFoundError, row unchanged", async () => {
    const reminderId = await seedReminder(); // owned by ownerUserId
    mockAuth(editorUserId); // property editor, but not the reminder's owner

    const result = await editReminder(reminderId, {
      anchorType: REMINDER_ANCHOR_TYPES.DAY_OF_MONTH,
      anchorValue: 20,
      text: "hijack",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe(ERROR_CODES.NOT_FOUND);

    const [row] = await db.select().from(reminders).where(eq(reminders.id, reminderId)).limit(1);
    expect(row!.text).toBe("original");
  });

  it("nonexistent reminder — NotFoundError", async () => {
    mockAuth(ownerUserId);
    const result = await editReminder(MISSING_REMINDER_ID, {
      anchorType: REMINDER_ANCHOR_TYPES.DAY_OF_MONTH,
      anchorValue: 5,
      text: "x",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe(ERROR_CODES.NOT_FOUND);
  });

  it("demo user — DemoModeError", async () => {
    const reminderId = await seedReminder();
    mockDemoAuth();
    const result = await editReminder(reminderId, {
      anchorType: REMINDER_ANCHOR_TYPES.DAY_OF_MONTH,
      anchorValue: 5,
      text: "x",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe(ERROR_CODES.DEMO_MODE);
  });

  it("invalid anchorValue — ValidationError", async () => {
    const reminderId = await seedReminder();
    mockAuth(ownerUserId);
    const result = await editReminder(reminderId, {
      anchorType: REMINDER_ANCHOR_TYPES.DAYS_BEFORE_END,
      anchorValue: 99,
      text: "x",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe(ERROR_CODES.VALIDATION);
  });
});

// --- deleteReminder ---

describe("deleteReminder", () => {
  it("owner deletes their own reminder — row is hard-removed", async () => {
    const reminderId = await seedReminder();
    mockAuth(ownerUserId);

    const result = await deleteReminder(reminderId);
    expect(result.ok).toBe(true);

    const rows = await db.select().from(reminders).where(eq(reminders.id, reminderId));
    expect(rows).toHaveLength(0);
  });

  it("another user's reminder — NotFoundError, row preserved", async () => {
    const reminderId = await seedReminder(); // owned by ownerUserId
    mockAuth(editorUserId); // property editor, but not the reminder's owner

    const result = await deleteReminder(reminderId);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe(ERROR_CODES.NOT_FOUND);

    const rows = await db.select().from(reminders).where(eq(reminders.id, reminderId));
    expect(rows).toHaveLength(1);
  });

  it("nonexistent reminder — NotFoundError", async () => {
    mockAuth(ownerUserId);
    const result = await deleteReminder(MISSING_REMINDER_ID);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe(ERROR_CODES.NOT_FOUND);
  });

  it("demo user — DemoModeError, row preserved", async () => {
    const reminderId = await seedReminder();
    mockDemoAuth();

    const result = await deleteReminder(reminderId);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe(ERROR_CODES.DEMO_MODE);

    const rows = await db.select().from(reminders).where(eq(reminders.id, reminderId));
    expect(rows).toHaveLength(1);
  });
});
