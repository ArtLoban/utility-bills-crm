import { afterAll, afterEach, describe, expect, it } from "vitest";
import { count, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { sessions, users } from "@/lib/db/schema";
import { DEMO_EMAIL } from "@/lib/auth/constants";
import { GET } from "../route";

const BASE_URL = "http://localhost:3000";

// --- Cleanup ---

afterEach(async () => {
  // Delete sessions created by the handler so each test starts clean.
  // FK cascade (sessions.userId → users.id) would handle this on user delete,
  // but we keep the user across tests to verify idempotency.
  const demoUser = await db.query.users.findFirst({ where: eq(users.email, DEMO_EMAIL) });
  if (demoUser) {
    await db.delete(sessions).where(eq(sessions.userId, demoUser.id));
  }
});

afterAll(async () => {
  await db.delete(users).where(eq(users.email, DEMO_EMAIL));
});

// --- Tests ---

describe("GET /auth/demo", () => {
  it("redirects to /dashboard and sets the session cookie", async () => {
    const response = await GET(new Request(`${BASE_URL}/auth/demo`));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(`${BASE_URL}/dashboard`);

    const cookie = response.headers.get("set-cookie");
    expect(cookie).toMatch(/authjs\.session-token=/);
  });

  it("creates exactly one demo user and one session in the database", async () => {
    await GET(new Request(`${BASE_URL}/auth/demo`));

    const demoUser = await db.query.users.findFirst({ where: eq(users.email, DEMO_EMAIL) });
    expect(demoUser).toBeDefined();
    expect(demoUser!.email).toBe(DEMO_EMAIL);

    const [sessionCount] = await db
      .select({ value: count() })
      .from(sessions)
      .where(eq(sessions.userId, demoUser!.id));
    expect(sessionCount!.value).toBe(1);
  });

  it("find-or-create is idempotent: a second hit does not create a second demo user", async () => {
    await GET(new Request(`${BASE_URL}/auth/demo`));
    // afterEach cleans sessions; we re-hit the endpoint fresh
    const demoUser = await db.query.users.findFirst({ where: eq(users.email, DEMO_EMAIL) });
    if (demoUser) {
      await db.delete(sessions).where(eq(sessions.userId, demoUser.id));
    }
    await GET(new Request(`${BASE_URL}/auth/demo`));

    const [userCount] = await db
      .select({ value: count() })
      .from(users)
      .where(eq(users.email, DEMO_EMAIL));
    expect(userCount!.value).toBe(1);
  });

  it("creates a non-rememberMe session with no absolute cap", async () => {
    await GET(new Request(`${BASE_URL}/auth/demo`));

    const demoUser = await db.query.users.findFirst({ where: eq(users.email, DEMO_EMAIL) });
    const session = await db.query.sessions.findFirst({
      where: eq(sessions.userId, demoUser!.id),
    });

    expect(session).toBeDefined();
    expect(session!.rememberMe).toBe(false);
    expect(session!.absoluteExpires).toBeNull();

    // expires should be ~1 hour from now (allow 5s drift)
    const oneHourMs = 60 * 60 * 1000;
    const drift = Math.abs(session!.expires.getTime() - (Date.now() + oneHourMs));
    expect(drift).toBeLessThan(5_000);
  });
});
