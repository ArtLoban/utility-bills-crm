import { z } from "zod";

import { PROPERTY_ROLE_LIST } from "@/lib/db/schema/properties";

// Reuses the DB-layer list as the single source of truth for valid role values.
export const propertyRoleEnum = z.enum(PROPERTY_ROLE_LIST);

export const inviteSchema = z.object({
  email: z.string().email("validation.email.invalid"),
  role: propertyRoleEnum,
});

export const changeRoleSchema = z.object({
  targetUserId: z.string().uuid(),
  newRole: propertyRoleEnum,
});

export const removeAccessSchema = z.object({
  targetUserId: z.string().uuid(),
});

// leaveProperty takes no body input — propertyId is the only parameter.

export type TInviteInput = z.infer<typeof inviteSchema>;
export type TChangeRoleInput = z.infer<typeof changeRoleSchema>;
export type TRemoveAccessInput = z.infer<typeof removeAccessSchema>;
