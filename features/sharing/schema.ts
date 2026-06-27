import { z } from "zod";

import { PROPERTY_ROLE_LIST } from "@/lib/db/schema/properties";

// Reuses the DB-layer list as the single source of truth for valid role values.
export const propertyRoleEnum = z.enum(PROPERTY_ROLE_LIST);

export const inviteSchema = z.object({
  email: z.string().email("validation.email.invalid"),
  role: propertyRoleEnum,
});

// Domain validation codes returned by inviteToProperty — shared by the action and the form hook.
export const INVITE_ERROR = {
  USER_NOT_FOUND: "USER_NOT_FOUND",
  ALREADY_HAS_ACCESS: "ALREADY_HAS_ACCESS",
} as const;

export type TInviteErrorCode = (typeof INVITE_ERROR)[keyof typeof INVITE_ERROR];

// Client form schema: raw email string + role enum, relative i18n keys for messages.
export const inviteFormSchema = z.object({
  email: z.string().min(1, "validation.email.required").email("validation.email.invalid"),
  role: propertyRoleEnum,
});

export type TInviteFormValues = z.infer<typeof inviteFormSchema>;

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
