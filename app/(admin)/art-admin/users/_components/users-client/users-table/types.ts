import { TStringOrNull } from "@/lib/types/common";

export const FiltersFormField = {
  ROLE: "systemRole",
  STATUS: "status",
} as const;

export type TFiltersFormField = (typeof FiltersFormField)[keyof typeof FiltersFormField];

export type TFiltersFormValues = {
  [FiltersFormField.ROLE]: TStringOrNull;
  [FiltersFormField.STATUS]: TStringOrNull;
};
