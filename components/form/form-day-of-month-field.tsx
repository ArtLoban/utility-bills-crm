"use client";

import { type FieldValues } from "react-hook-form";

import { FormControl } from "@/components/ui/form";
import { DayOfMonthPicker } from "@/components/day-of-month-picker";
import { FormFieldShell } from "./form-field-shell";
import { type TFormFieldBaseProps } from "./types";

type TProps<T extends FieldValues> = TFormFieldBaseProps<T> & {
  disabled?: boolean;
  placeholder?: string;
};

// The form keeps the day as a string (the shared anchorValue is string-typed and parsed to a
// number at the action boundary), so this wrapper bridges string ↔ number for the picker.
export const FormDayOfMonthField = <T extends FieldValues>({
  control,
  name,
  label,
  description,
  className,
  disabled,
  placeholder,
}: TProps<T>) => (
  <FormFieldShell
    control={control}
    name={name}
    label={label}
    description={description}
    className={className}
  >
    {(field) => (
      <FormControl>
        <DayOfMonthPicker
          value={field.value ? Number(field.value) : null}
          onChange={(day) => field.onChange(String(day))}
          disabled={disabled}
          placeholder={placeholder}
        />
      </FormControl>
    )}
  </FormFieldShell>
);
