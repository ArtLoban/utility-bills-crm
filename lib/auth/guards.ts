import { redirect } from "next/navigation";
import type { Session } from "next-auth";
import { auth } from "@/lib/auth";
import { LOGIN_REASONS, SYSTEM_ROLES } from "@/lib/auth/constants";
import { ROUTES } from "@/lib/routes";
import { DemoModeError, ForbiddenError, err, ok } from "@/lib/errors";
import type { Result } from "@/lib/errors";
import type { UserId } from "@/lib/db/schema/auth";

// The login URL a guard redirects to when the session expired (or never existed)
// on a protected route — the reason lets the login page explain the bounce.
// Call as `redirect(loginUrl())`: redirect() is typed `: never`, so TS narrows the
// session to non-null afterwards (a wrapper arrow would not trigger that narrowing).
const loginUrl = (): string => `${ROUTES.login}?reason=${LOGIN_REASONS.SESSION_EXPIRED}`;

// NextAuth's `auth` is overloaded (middleware / route-handler / RSC), so
// ReturnType<typeof auth> resolves to the wrong signature. Use the augmented
// Session type directly instead of deriving it from the function.
type TSessionUser = Session["user"];

// Read-path guard for protected pages and data loaders that only need the id.
// No valid session → redirect to login. Returns a real UserId, so callers never
// pass `undefined` into a query (which silently returns zero rows).
export const requireUser = async (): Promise<UserId> => {
  const session: Session | null = await auth();
  if (!session?.user?.id) redirect(loginUrl());

  return session.user.id as UserId;
};

// Same guard for the few callers that also need the enriched user fields
// (isDemo, systemRole, name/email/image) — the app layout, property detail.
export const requireSession = async (): Promise<TSessionUser> => {
  const session: Session | null = await auth();
  if (!session?.user?.id) redirect(loginUrl());

  return session.user;
};

// Returns the caller's UserId if they are an admin.
// Anonymous callers and authenticated non-admins both get ForbiddenError,
// which maps to 404 at the HTTP boundary via shouldHideAsNotFound (#108).
export const requireAdmin = async (): Promise<Result<UserId, ForbiddenError>> => {
  const session = await auth();

  if (!session?.user?.id || session.user.systemRole !== SYSTEM_ROLES.ADMIN) {
    return err(new ForbiddenError());
  }

  return ok(session.user.id as UserId);
};

// Returns the caller's UserId for any non-demo authenticated user.
// Unauthenticated (e.g. the session expired mid-session): redirect to login —
// redirect() throws NEXT_REDIRECT, which propagates as a client navigation.
// Demo user: returns err(DemoModeError) so the frontend can show a friendly interception (D3b).
export const requireMutableUser = async (): Promise<Result<UserId, DemoModeError>> => {
  const session: Session | null = await auth();

  if (!session?.user?.id) redirect(loginUrl());
  if (session.user.isDemo) return err(new DemoModeError());

  return ok(session.user.id as UserId);
};
