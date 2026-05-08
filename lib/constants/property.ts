export const PROPERTY_TYPES = {
  APARTMENT: "apartment",
  HOUSE: "house",
  COTTAGE: "cottage",
  OTHER: "other",
} as const;

export type TPropertyType = (typeof PROPERTY_TYPES)[keyof typeof PROPERTY_TYPES];

export const PROPERTY_ROLES = {
  OWNER: "owner",
  EDITOR: "editor",
  VIEWER: "viewer",
} as const;

export type TPropertyRole = (typeof PROPERTY_ROLES)[keyof typeof PROPERTY_ROLES];
