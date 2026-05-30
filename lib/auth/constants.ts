export const SYSTEM_ROLES = {
  USER: "user",
  ADMIN: "admin",
} as const;

export type TSystemRole = (typeof SYSTEM_ROLES)[keyof typeof SYSTEM_ROLES];

// Ordered list — drives Drizzle column enum and validation
export const SYSTEM_ROLE_LIST = [SYSTEM_ROLES.USER, SYSTEM_ROLES.ADMIN] as const;
