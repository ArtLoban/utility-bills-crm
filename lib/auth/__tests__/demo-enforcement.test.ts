import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { ERROR_CODES } from "@/lib/errors";

import { softDeleteAccountNumber } from "@/features/account-numbers/actions";
import { softDeleteBill } from "@/features/bills/actions";
import { softDeleteContract } from "@/features/contracts/actions";
import { softDeleteMeter } from "@/features/meters/actions";
import { softDeletePaymentDetails } from "@/features/payment-details/actions";
import { softDeletePayment } from "@/features/payments/actions";
import { softDeleteProperty } from "@/features/properties/actions";
import { softDeleteProvider } from "@/features/providers/actions";
import { softDeleteReading } from "@/features/readings/actions";
import { softDeleteService } from "@/features/services/actions";
import { createServiceWithSetup } from "@/features/services/actions.composite";
import { leaveProperty } from "@/features/sharing/actions";
import { softDeleteTariff } from "@/features/tariffs/actions";
import { updateProfileName } from "@/features/profile/actions";
import { setTheme } from "@/lib/theme/actions";
import { setLocale, setRuLocaleEnabled } from "@/lib/locale/actions";

// Carve-out tests need next/headers — not globally mocked in setup.ts.
// The arrow indirection ensures mockCookieSet is resolved lazily at call time.
let mockCookieSet = vi.fn();
vi.mock("next/headers", () => ({
  cookies: () =>
    Promise.resolve({
      set: (...args: unknown[]) => mockCookieSet(...args),
      get: vi.fn().mockReturnValue(undefined),
      has: vi.fn().mockReturnValue(false),
    }),
}));

// Must be v4 format (version bit = 4, variant bits = 8-b) — Zod's z.string().uuid() validates RFC 4122.
const FAKE_UUID = "a1a2a3a4-b1b2-4c1c-8d1d-e1e2e3e4e5e6";

const mockDemo = () =>
  vi.mocked(auth).mockResolvedValue({
    user: { id: FAKE_UUID, isDemo: true, systemRole: "user" },
  } as unknown as Awaited<ReturnType<typeof auth>>);

// ── Block 1: all 14 guarded action files return DemoModeError ────────────────

describe("demo mode enforcement — guarded actions", () => {
  beforeEach(() => {
    mockDemo();
  });

  it("account-numbers: softDeleteAccountNumber", async () => {
    const result = await softDeleteAccountNumber(
      FAKE_UUID as Parameters<typeof softDeleteAccountNumber>[0],
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe(ERROR_CODES.DEMO_MODE);
  });

  it("bills: softDeleteBill", async () => {
    const result = await softDeleteBill(FAKE_UUID as Parameters<typeof softDeleteBill>[0]);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe(ERROR_CODES.DEMO_MODE);
  });

  it("contracts: softDeleteContract", async () => {
    const result = await softDeleteContract(FAKE_UUID as Parameters<typeof softDeleteContract>[0]);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe(ERROR_CODES.DEMO_MODE);
  });

  it("meters: softDeleteMeter", async () => {
    const result = await softDeleteMeter(FAKE_UUID as Parameters<typeof softDeleteMeter>[0]);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe(ERROR_CODES.DEMO_MODE);
  });

  it("payment-details: softDeletePaymentDetails", async () => {
    const result = await softDeletePaymentDetails(
      FAKE_UUID as Parameters<typeof softDeletePaymentDetails>[0],
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe(ERROR_CODES.DEMO_MODE);
  });

  it("payments: softDeletePayment", async () => {
    const result = await softDeletePayment(FAKE_UUID as Parameters<typeof softDeletePayment>[0]);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe(ERROR_CODES.DEMO_MODE);
  });

  it("properties: softDeleteProperty", async () => {
    const result = await softDeleteProperty(FAKE_UUID as Parameters<typeof softDeleteProperty>[0]);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe(ERROR_CODES.DEMO_MODE);
  });

  it("providers: softDeleteProvider", async () => {
    const result = await softDeleteProvider(FAKE_UUID as Parameters<typeof softDeleteProvider>[0]);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe(ERROR_CODES.DEMO_MODE);
  });

  it("readings: softDeleteReading", async () => {
    const result = await softDeleteReading(FAKE_UUID as Parameters<typeof softDeleteReading>[0]);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe(ERROR_CODES.DEMO_MODE);
  });

  it("services: softDeleteService", async () => {
    const result = await softDeleteService(FAKE_UUID as Parameters<typeof softDeleteService>[0]);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe(ERROR_CODES.DEMO_MODE);
  });

  it("services/composite: createServiceWithSetup (Zod-valid input, guard fires after Zod)", async () => {
    const result = await createServiceWithSetup({
      propertyId: FAKE_UUID,
      serviceTypeId: FAKE_UUID,
      providerId: FAKE_UUID,
      contractValidFrom: "2024-01-01",
      tariffValidFrom: "2024-01-01",
      rateT1: "1.00",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe(ERROR_CODES.DEMO_MODE);
  });

  it("sharing: leaveProperty", async () => {
    const result = await leaveProperty(FAKE_UUID as Parameters<typeof leaveProperty>[0]);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe(ERROR_CODES.DEMO_MODE);
  });

  it("tariffs: softDeleteTariff", async () => {
    const result = await softDeleteTariff(FAKE_UUID as Parameters<typeof softDeleteTariff>[0]);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe(ERROR_CODES.DEMO_MODE);
  });

  it("profile: updateProfileName (Zod-valid input, guard fires after Zod)", async () => {
    const result = await updateProfileName({ name: "Test User" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe(ERROR_CODES.DEMO_MODE);
  });
});

// ── Block 2: theme/locale carve-outs ─────────────────────────────────────────

describe("demo mode carve-outs — theme and locale", () => {
  let dbUpdateSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockCookieSet = vi.fn();
    mockDemo();
    dbUpdateSpy = vi.spyOn(db, "update");
  });

  afterEach(() => {
    dbUpdateSpy.mockRestore();
  });

  it("setTheme: writes cookie but skips DB write", async () => {
    await setTheme("dark");
    expect(mockCookieSet).toHaveBeenCalledOnce();
    expect(dbUpdateSpy).not.toHaveBeenCalled();
  });

  it("setLocale: writes cookie but skips DB write", async () => {
    await setLocale("en");
    expect(mockCookieSet).toHaveBeenCalledOnce();
    expect(dbUpdateSpy).not.toHaveBeenCalled();
  });

  it("setRuLocaleEnabled: returns DemoModeError (no carve-out — full block)", async () => {
    const result = await setRuLocaleEnabled(true);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe(ERROR_CODES.DEMO_MODE);
    expect(dbUpdateSpy).not.toHaveBeenCalled();
  });
});
