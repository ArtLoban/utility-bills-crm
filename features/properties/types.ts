import type { TSelectableEntity } from "@/components/select-input/types";
import type { TPropertyType } from "@/lib/db/schema";

export const PropertyFormField = {
  NAME: "name",
  TYPE: "type",
  ADDRESS: "address",
  NOTES: "notes",
} as const;

export type TPropertyOption = TSelectableEntity & { type: TPropertyType };
