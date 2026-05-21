import { auth } from "@/lib/auth";
import { propertyByIdForUser } from "@/lib/db/access/properties";
import type { UserId } from "@/lib/db/schema/auth";
import type { PropertyId, TProperty, TPropertyRole } from "@/lib/db/schema/properties";
import { NotFoundError, err, ok } from "@/lib/errors";
import type { Result } from "@/lib/errors";

// Named by screen purpose, not field composition (per DATA_MODEL.md type naming convention).
// Tab content (Overview / Meters / Sharing) and service list are added in later steps.
export type TPropertyDetail = TProperty & {
  role: TPropertyRole;
};

export const getPropertyDetail = async (
  propertyId: PropertyId,
): Promise<Result<TPropertyDetail, NotFoundError>> => {
  const session = await auth();
  if (!session?.user.id) return err(new NotFoundError("property", propertyId));

  const userId = session.user.id as UserId;
  const result = await propertyByIdForUser(userId, propertyId);
  if (!result.ok) return result;

  return ok({ ...result.value.property, role: result.value.role });
};
