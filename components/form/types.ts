import { type ReactNode } from "react";
import { type Control, type FieldPath, type FieldValues } from "react-hook-form";

export type TFormFieldBaseProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  description?: ReactNode;
  className?: string;
};
