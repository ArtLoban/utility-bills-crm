import { auth } from "@/lib/auth";
import { serviceByIdForUser } from "@/lib/db/access/services";
import type { TServiceDetail } from "@/lib/db/access/services";
import type { UserId } from "@/lib/db/schema/auth";
import type { TServiceId } from "@/lib/db/schema/services";
import { NotFoundError, err } from "@/lib/errors";
import type { Result } from "@/lib/errors";

export type { TServiceDetail };

export const getServiceDetail = async (
  serviceId: TServiceId,
): Promise<Result<TServiceDetail, NotFoundError>> => {
  const session = await auth();
  if (!session?.user.id) return err(new NotFoundError("service", serviceId));

  const userId = session.user.id as UserId;
  return serviceByIdForUser(userId, serviceId);
};
