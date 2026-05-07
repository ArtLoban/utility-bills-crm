export type TPropertyType = "apartment" | "house" | "cottage" | "other";

export type TPropertyForEdit = {
  id: string;
  name: string;
  type: TPropertyType;
  address: string | null;
  notes: string | null;
};

export type TFormState = {
  name: string;
  type: TPropertyType | "";
  address: string;
  notes: string;
};
