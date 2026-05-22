export type TPropertyType = "apartment" | "house" | "cottage" | "other";

export type TFormState = {
  name: string;
  type: TPropertyType | "";
  address: string;
  notes: string;
};
