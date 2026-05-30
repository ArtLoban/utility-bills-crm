import { AVATAR_PALETTE } from "./constants";
import type { TPropertyRole } from "@/lib/db/schema/properties";
import type { TUserRole } from "./types";

// Deterministic avatar color derived from userId — stable across re-renders and re-fetches
export const stableAvatarIdx = (userId: string): number => {
  let h = 0;
  for (let i = 0; i < userId.length; i++) h = (h * 31 + userId.charCodeAt(i)) | 0;
  return Math.abs(h) % AVATAR_PALETTE.length;
};

export const capitalizeRole = (r: TPropertyRole): TUserRole =>
  (r.charAt(0).toUpperCase() + r.slice(1)) as TUserRole;
