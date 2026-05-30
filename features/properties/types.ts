import type { TPropertyType } from "@/lib/db/schema/properties";

export type TFormState = {
  name: string;
  type: TPropertyType | "";
  address: string;
  notes: string;
};
