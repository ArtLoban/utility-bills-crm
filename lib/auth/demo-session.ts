import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { sessions, users } from "@/lib/db/schema";
import { DEMO_EMAIL } from "@/lib/auth/constants";

const DEMO_SESSION_DURATION_MS = 60 * 60 * 1000; // 1 hour — non-rememberMe policy

// Provisions the shared demo account and a fresh database session for it, returning
// the token + expiry for the caller to set as a cookie. Kept free of cookie/redirect
// side effects so it can be exercised directly in integration tests.
export const createDemoSession = async (): Promise<{ sessionToken: string; expires: Date }> => {
  // Find or create the persistent demo user. onConflictDoUpdate ensures isDemo is set
  // to true even if the row pre-dated the isDemo column migration.
  await db
    .insert(users)
    .values({ name: "Demo User", email: DEMO_EMAIL, isDemo: true })
    .onConflictDoUpdate({ target: users.email, set: { isDemo: true } });

  const demoUser = await db.query.users.findFirst({
    where: eq(users.email, DEMO_EMAIL),
  });

  if (!demoUser) {
    throw new Error("Failed to provision demo user");
  }

  const sessionToken = crypto.randomUUID();
  const expires = new Date(Date.now() + DEMO_SESSION_DURATION_MS);

  await db.insert(sessions).values({
    sessionToken,
    userId: demoUser.id,
    expires,
    rememberMe: false,
    absoluteExpires: null,
  });

  return { sessionToken, expires };
};
