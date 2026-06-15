import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { eq, inArray } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema/auth";
import type { UserId } from "@/lib/db/schema/auth";
import { properties } from "@/lib/db/schema/properties";
import type { PropertyId } from "@/lib/db/schema/properties";
import { services } from "@/lib/db/schema/services";
import type { TServiceId } from "@/lib/db/schema/services";
import { serviceTypes } from "@/lib/db/schema/service-types";
import {
  REMINDER_ANCHOR_TYPES,
  REMINDER_DELIVERY_STATUSES,
  reminderDeliveries,
  reminders,
  telegramChannels,
} from "@/lib/db/schema/notifications";
import { LOCALES } from "@/lib/locale/constants";

// Telegram is mocked: the integration boundary under test is resolve → group → claim → render,
// not the real Bot API. The mock lets us assert recipients, message content, and idempotency.
vi.mock("../telegram", () => ({ sendTelegramMessage: vi.fn() }));

import { sendTelegramMessage } from "../telegram";
import { deliverDueReminders } from "../delivery";

// --- Fixtures ---

const PROPERTY_NAME = "Test Notif Property";
// Per-user Telegram chat ids (slice 3): bigint values beyond int32, distinct per user. Delivery
// now resolves each user's real channel from telegram_channels — no single env chat.
const CHAT_ID_A = 7_700_000_001;
const CHAT_ID_B = 7_700_000_002;

// 2025-03-15 09:00 UTC = 2025-03-15 in Kyiv (UTC+2, before DST). day_of_month(15) fires;
// days_before_end(0) — last day of a 31-day month — does not.
const FIXED_NOW = new Date("2025-03-15T09:00:00Z");
const FIXED_DELIVERY_DATE = "2025-03-15";

const TEXT_A_ELECTRICITY = "A: submit the electricity reading";
const TEXT_A_GAS = "A: gas note (should not fire on the 15th)";
const TEXT_B_ELECTRICITY = "B: pay the electricity bill";
const TEXT_DEMO = "DEMO: must never be delivered";

let userAId: UserId; // en locale
let userBId: UserId; // uk locale
let demoUserId: UserId; // isDemo — excluded from delivery
let testPropertyId: PropertyId;
let electricityServiceId: TServiceId;
let gasServiceId: TServiceId;

const mockSend = vi.mocked(sendTelegramMessage);

beforeAll(async () => {
  const serviceTypeRows = await db
    .select({ id: serviceTypes.id, code: serviceTypes.code })
    .from(serviceTypes)
    .where(inArray(serviceTypes.code, ["electricity", "gas"]));
  const electricityTypeId = serviceTypeRows.find((r) => r.code === "electricity")!.id;
  const gasTypeId = serviceTypeRows.find((r) => r.code === "gas")!.id;

  const insertedUsers = await db
    .insert(users)
    .values([
      { email: "test-notif-a@test.invalid", name: "Notif A", locale: LOCALES.EN },
      { email: "test-notif-b@test.invalid", name: "Notif B", locale: LOCALES.UK },
      { email: "test-notif-demo@test.invalid", name: "Notif Demo", isDemo: true },
    ])
    .returning({ id: users.id });
  userAId = insertedUsers[0]!.id;
  userBId = insertedUsers[1]!.id;
  demoUserId = insertedUsers[2]!.id;

  const [property] = await db
    .insert(properties)
    .values({ name: PROPERTY_NAME, type: "apartment" })
    .returning({ id: properties.id });
  testPropertyId = property!.id;

  const insertedServices = await db
    .insert(services)
    .values([
      { propertyId: testPropertyId, serviceTypeId: electricityTypeId },
      { propertyId: testPropertyId, serviceTypeId: gasTypeId },
    ])
    .returning({ id: services.id, serviceTypeId: services.serviceTypeId });
  electricityServiceId = insertedServices.find((s) => s.serviceTypeId === electricityTypeId)!.id;
  gasServiceId = insertedServices.find((s) => s.serviceTypeId === gasTypeId)!.id;

  await db.insert(reminders).values([
    {
      userId: userAId,
      serviceId: electricityServiceId,
      anchorType: REMINDER_ANCHOR_TYPES.DAY_OF_MONTH,
      anchorValue: 15,
      text: TEXT_A_ELECTRICITY,
    },
    {
      userId: userAId,
      serviceId: gasServiceId,
      anchorType: REMINDER_ANCHOR_TYPES.DAYS_BEFORE_END,
      anchorValue: 0,
      text: TEXT_A_GAS,
    },
    {
      userId: userBId,
      serviceId: electricityServiceId,
      anchorType: REMINDER_ANCHOR_TYPES.DAY_OF_MONTH,
      anchorValue: 15,
      text: TEXT_B_ELECTRICITY,
    },
    {
      userId: demoUserId,
      serviceId: electricityServiceId,
      anchorType: REMINDER_ANCHOR_TYPES.DAY_OF_MONTH,
      anchorValue: 15,
      text: TEXT_DEMO,
    },
  ]);
});

// Reset the ledger + channels and the send mock before each test, then re-establish a channel
// for A and B (not the demo user). Channels are reset per-test so the no-channel case can delete
// one in isolation without leaking into the next test.
beforeEach(async () => {
  await db
    .delete(reminderDeliveries)
    .where(inArray(reminderDeliveries.userId, [userAId, userBId, demoUserId]));
  await db
    .delete(telegramChannels)
    .where(inArray(telegramChannels.userId, [userAId, userBId, demoUserId]));
  await db.insert(telegramChannels).values([
    { userId: userAId, chatId: CHAT_ID_A, label: "User A" },
    { userId: userBId, chatId: CHAT_ID_B, label: "User B" },
  ]);
  mockSend.mockReset();
  mockSend.mockResolvedValue({ ok: true, value: undefined });
});

afterAll(async () => {
  // Cascade: property → services → reminders. Users → their reminders + delivery rows.
  await db.delete(properties).where(eq(properties.id, testPropertyId));
  await db.delete(users).where(inArray(users.id, [userAId, userBId, demoUserId]));
});

// --- Due-today resolution + grouping ---

describe("deliverDueReminders — due-today grouping", () => {
  it("delivers one digest per due user and excludes demo users", async () => {
    const summary = await deliverDueReminders(FIXED_NOW);

    expect(summary).toEqual({
      deliveryDate: FIXED_DELIVERY_DATE,
      dueUsers: 2,
      sent: 2,
      failed: 0,
      skipped: 0,
    });
    expect(mockSend).toHaveBeenCalledTimes(2);

    // Every send went to one of the two users' own resolved channels, and none carried the
    // demo reminder.
    for (const [chatId, message] of mockSend.mock.calls) {
      expect([String(CHAT_ID_A), String(CHAT_ID_B)]).toContain(chatId);
      expect(message).not.toContain(TEXT_DEMO);
    }

    const deliveryRows = await db
      .select()
      .from(reminderDeliveries)
      .where(inArray(reminderDeliveries.userId, [userAId, userBId, demoUserId]));
    expect(deliveryRows).toHaveLength(2); // demo user never claimed
    expect(deliveryRows.every((r) => r.status === REMINDER_DELIVERY_STATUSES.SENT)).toBe(true);
    expect(deliveryRows.every((r) => r.deliveryDate === FIXED_DELIVERY_DATE)).toBe(true);
  });
});

// --- Digest composition ---

describe("deliverDueReminders — digest composition", () => {
  it("renders the en digest with the [Property · Service] header and only the due reminder", async () => {
    await deliverDueReminders(FIXED_NOW);

    const callA = mockSend.mock.calls.find(([, message]) => message.includes(TEXT_A_ELECTRICITY));
    expect(callA).toBeDefined();
    // Electricity fired; the gas (days_before_end 0) reminder did not — only one block.
    expect(callA![1]).toBe(`[${PROPERTY_NAME} · Electricity]\n${TEXT_A_ELECTRICITY}`);
    expect(callA![1]).not.toContain(TEXT_A_GAS);
  });

  it("renders the service name in the recipient's locale (uk)", async () => {
    await deliverDueReminders(FIXED_NOW);

    const callB = mockSend.mock.calls.find(([, message]) => message.includes(TEXT_B_ELECTRICITY));
    expect(callB).toBeDefined();
    expect(callB![1]).toBe(`[${PROPERTY_NAME} · Електроенергія]\n${TEXT_B_ELECTRICITY}`);
  });
});

// --- Idempotency ---

describe("deliverDueReminders — idempotency", () => {
  it("a second run for the same date claims nothing and re-sends nothing", async () => {
    const first = await deliverDueReminders(FIXED_NOW);
    expect(first.sent).toBe(2);

    mockSend.mockClear();
    const second = await deliverDueReminders(FIXED_NOW);

    expect(second).toEqual({
      deliveryDate: FIXED_DELIVERY_DATE,
      dueUsers: 2,
      sent: 0,
      failed: 0,
      skipped: 2,
    });
    expect(mockSend).not.toHaveBeenCalled();

    // Still exactly one ledger row per user — no duplicates from the second run.
    const deliveryRows = await db
      .select()
      .from(reminderDeliveries)
      .where(inArray(reminderDeliveries.userId, [userAId, userBId]));
    expect(deliveryRows).toHaveLength(2);
  });
});

// --- Channel gating ---

describe("deliverDueReminders — channel gating", () => {
  it("skips a due user with no channel without claiming a ledger row", async () => {
    await db.delete(telegramChannels).where(eq(telegramChannels.userId, userBId));

    const summary = await deliverDueReminders(FIXED_NOW);

    expect(summary).toEqual({
      deliveryDate: FIXED_DELIVERY_DATE,
      dueUsers: 2,
      sent: 1,
      failed: 0,
      skipped: 1,
    });

    // Only A was sent; B carried no message.
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend.mock.calls[0]![0]).toBe(String(CHAT_ID_A));

    // A claimed a row; B did not — a later link must not be blocked by a phantom row.
    const rows = await db
      .select()
      .from(reminderDeliveries)
      .where(inArray(reminderDeliveries.userId, [userAId, userBId]));
    expect(rows).toHaveLength(1);
    expect(rows[0]!.userId).toBe(userAId);
  });
});

// --- Send-failure outcome ---

describe("deliverDueReminders — send failure", () => {
  it("records a failed delivery with the error detail and counts it", async () => {
    mockSend.mockResolvedValue({ ok: false, error: "Telegram sendMessage failed: 400 bad" });

    const summary = await deliverDueReminders(FIXED_NOW);
    expect(summary.sent).toBe(0);
    expect(summary.failed).toBe(2);

    const rows = await db
      .select()
      .from(reminderDeliveries)
      .where(inArray(reminderDeliveries.userId, [userAId, userBId]));
    expect(rows.every((r) => r.status === REMINDER_DELIVERY_STATUSES.FAILED)).toBe(true);
    expect(rows.every((r) => r.error === "Telegram sendMessage failed: 400 bad")).toBe(true);
  });
});
