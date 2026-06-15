import { beforeEach, describe, expect, it, vi } from "vitest";

// The cron route's responsibility under test is the authorization gate, nothing else. The
// delivery pipeline is mocked so this test never opens a DB connection or runs a real send —
// resolve/group/claim/render is covered by delivery.integration.test.ts. Mocking it here also
// closes a real hazard: an unmocked 200 path would run deliverDueReminders() against the live
// DB and today's actual date, writing un-cleaned ledger rows for real users.
vi.mock("@/features/notifications", () => ({ deliverDueReminders: vi.fn() }));

import { deliverDueReminders } from "@/features/notifications";
import { GET } from "../route";

const CRON_SECRET = "test-cron-secret";
const mockDeliver = vi.mocked(deliverDueReminders);

const cronRequest = (authHeader?: string): Request =>
  new Request("https://app.test/api/cron/notifications", {
    method: "GET",
    headers: authHeader ? { authorization: authHeader } : undefined,
  });

beforeEach(() => {
  process.env.CRON_SECRET = CRON_SECRET;
  mockDeliver.mockReset();
  mockDeliver.mockResolvedValue({
    deliveryDate: "2025-01-01",
    dueUsers: 0,
    sent: 0,
    failed: 0,
    skipped: 0,
  });
});

describe("GET /api/cron/notifications — authorization", () => {
  it("rejects a request with no Authorization header and does not run delivery (401)", async () => {
    const response = await GET(cronRequest());

    expect(response.status).toBe(401);
    expect(mockDeliver).not.toHaveBeenCalled();
  });

  it("rejects a request with the wrong secret and does not run delivery (401)", async () => {
    const response = await GET(cronRequest("Bearer wrong-secret"));

    expect(response.status).toBe(401);
    expect(mockDeliver).not.toHaveBeenCalled();
  });

  it("fails closed when CRON_SECRET is not configured (401)", async () => {
    delete process.env.CRON_SECRET;

    const response = await GET(cronRequest("Bearer "));

    expect(response.status).toBe(401);
    expect(mockDeliver).not.toHaveBeenCalled();
  });

  it("accepts a request with the correct secret and runs delivery once (200)", async () => {
    const response = await GET(cronRequest(`Bearer ${CRON_SECRET}`));

    expect(response.status).toBe(200);
    expect(mockDeliver).toHaveBeenCalledTimes(1);
  });
});
