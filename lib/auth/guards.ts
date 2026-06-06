import { auth } from "@/lib/auth";
import { SYSTEM_ROLES } from "@/lib/auth/constants";
import { DemoModeError, ForbiddenError, err, ok } from "@/lib/errors";
import type { Result } from "@/lib/errors";
import type { UserId } from "@/lib/db/schema/auth";

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
// Unauthenticated: throws (middleware prevents this; if it happens it's a bug → error.tsx).
// Demo user: returns err(DemoModeError) so the frontend can show a friendly interception (D3b).
export const requireMutableUser = async (): Promise<Result<UserId, DemoModeError>> => {
  const session = await auth();

  if (!session?.user?.id) throw new Error("Unauthenticated");
  if (session.user.isDemo) return err(new DemoModeError());

  return ok(session.user.id as UserId);
};
