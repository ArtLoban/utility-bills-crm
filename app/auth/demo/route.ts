import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { sessions, users } from "@/lib/db/schema";
import type { UserId } from "@/lib/db/schema";
import { DEMO_EMAIL } from "@/lib/auth/constants";
import { getSessionCookieConfig } from "@/lib/auth/cookie";
import { ROUTES } from "@/lib/routes";

const DEMO_SESSION_DURATION_MS = 60 * 60 * 1000; // 1 hour — non-rememberMe policy

export const GET = async (request: Request): Promise<Response> => {
  // Find or create the persistent demo user. onConflictDoUpdate ensures
  // isDemo is set to true even if the row pre-dated the isDemo column migration.
  await db
    .insert(users)
    .values({ name: "Demo User", email: DEMO_EMAIL, isDemo: true })
    .onConflictDoUpdate({ target: users.email, set: { isDemo: true } });

  const demoUser = await db.query.users.findFirst({
    where: eq(users.email, DEMO_EMAIL),
  });

  if (!demoUser) {
    return new Response("Failed to provision demo user", { status: 500 });
  }

  const sessionToken = crypto.randomUUID();
  const expires = new Date(Date.now() + DEMO_SESSION_DURATION_MS);

  await db.insert(sessions).values({
    sessionToken,
    userId: demoUser.id as UserId,
    expires,
    rememberMe: false,
    absoluteExpires: null,
  });

  const { name, options } = getSessionCookieConfig();
  const response = NextResponse.redirect(new URL(ROUTES.dashboard, request.url));
  response.cookies.set(name, sessionToken, { ...options, expires });

  return response;
};
