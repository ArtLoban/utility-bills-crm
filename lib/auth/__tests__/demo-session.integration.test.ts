import { afterEach, describe, expect, it } from "vitest";
import { count, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { sessions, users } from "@/lib/db/schema";
import { DEMO_EMAIL } from "@/lib/auth/constants";
import { createDemoSession } from "../demo-session";

// --- Cleanup ---
// The demo account (DEMO_EMAIL) is a persistent fixture that may own seeded demo
// data, so we never delete the user — only the sessions this suite creates.

afterEach(async () => {
  const demoUser = await db.query.users.findFirst({ where: eq(users.email, DEMO_EMAIL) });
  if (demoUser) {
    await db.delete(sessions).where(eq(sessions.userId, demoUser.id));
  }
});

// --- Tests ---

describe("createDemoSession", () => {
  it("returns a session token and an ~1h expiry", async () => {
    const { sessionToken, expires } = await createDemoSession();

    expect(sessionToken).toMatch(/^[0-9a-f-]{36}$/);

    const oneHourMs = 60 * 60 * 1000;
    const drift = Math.abs(expires.getTime() - (Date.now() + oneHourMs));
    expect(drift).toBeLessThan(5_000);
  });

  it("creates exactly one demo user and one session in the database", async () => {
    await createDemoSession();

    const demoUser = await db.query.users.findFirst({ where: eq(users.email, DEMO_EMAIL) });
    expect(demoUser).toBeDefined();
    expect(demoUser!.email).toBe(DEMO_EMAIL);
    expect(demoUser!.isDemo).toBe(true);

    const [sessionCount] = await db
      .select({ value: count() })
      .from(sessions)
      .where(eq(sessions.userId, demoUser!.id));
    expect(sessionCount!.value).toBe(1);
  });

  it("find-or-create is idempotent: a second call does not create a second demo user", async () => {
    await createDemoSession();
    // afterEach cleans sessions; we re-call fresh
    const demoUser = await db.query.users.findFirst({ where: eq(users.email, DEMO_EMAIL) });
    if (demoUser) {
      await db.delete(sessions).where(eq(sessions.userId, demoUser.id));
    }
    await createDemoSession();

    const [userCount] = await db
      .select({ value: count() })
      .from(users)
      .where(eq(users.email, DEMO_EMAIL));
    expect(userCount!.value).toBe(1);
  });

  it("creates a non-rememberMe session with no absolute cap", async () => {
    await createDemoSession();

    const demoUser = await db.query.users.findFirst({ where: eq(users.email, DEMO_EMAIL) });
    const session = await db.query.sessions.findFirst({
      where: eq(sessions.userId, demoUser!.id),
    });

    expect(session).toBeDefined();
    expect(session!.rememberMe).toBe(false);
    expect(session!.absoluteExpires).toBeNull();
  });
});
