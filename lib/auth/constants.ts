export const SYSTEM_ROLES = {
  USER: "user",
  ADMIN: "admin",
} as const;

export type TSystemRole = (typeof SYSTEM_ROLES)[keyof typeof SYSTEM_ROLES];

// Ordered list — drives Drizzle column enum and validation
export const SYSTEM_ROLE_LIST = [SYSTEM_ROLES.USER, SYSTEM_ROLES.ADMIN] as const;

// Single source of truth for the persistent demo account identities.
// Reused by the demo sign-in action (startDemoSessionAction / createDemoSession),
// the demo data seed, and the mutation-blocking guard.
export const DEMO_EMAIL = "utility-bills-demo@crm.local";
// Secondary fixture user — editor on the apartment, no auth path.
export const FAMILY_DEMO_EMAIL = "family-demo@crm.local";

// Why the user landed on /login. Passed as ?reason= on the redirect from the
// auth guards so the login page can explain itself instead of appearing blank.
export const LOGIN_REASONS = {
  SESSION_EXPIRED: "session-expired",
} as const;

export type TLoginReason = (typeof LOGIN_REASONS)[keyof typeof LOGIN_REASONS];
