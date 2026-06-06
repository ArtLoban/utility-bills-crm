export const SYSTEM_ROLES = {
  USER: "user",
  ADMIN: "admin",
} as const;

export type TSystemRole = (typeof SYSTEM_ROLES)[keyof typeof SYSTEM_ROLES];

// Ordered list — drives Drizzle column enum and validation
export const SYSTEM_ROLE_LIST = [SYSTEM_ROLES.USER, SYSTEM_ROLES.ADMIN] as const;

// Single source of truth for the persistent demo account identity.
// Reused by the /auth/demo route handler (D1), the demo data seed (D2),
// and the mutation-blocking guard (D3).
export const DEMO_EMAIL = "utility-bills-demo@crm.local";
