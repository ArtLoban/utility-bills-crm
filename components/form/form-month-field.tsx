"use client";

import { type FieldValues } from "react-hook-form";

import { FormControl } from "@/components/ui/form";
import { MonthPicker } from "@/components/month-picker";
import { FormFieldShell } from "./form-field-shell";
import { type TFormFieldBaseProps } from "./types";

type TProps<T extends FieldValues> = TFormFieldBaseProps<T> & {
  min?: string;
  max?: string;
  disabled?: boolean;
  placeholder?: string;
};

export const FormMonthField = <T extends FieldValues>({
  control,
  name,
  label,
  description,
  className,
  min,
  max,
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
        <MonthPicker
          value={field.value ?? null}
          onChange={field.onChange}
          min={min}
          max={max}
          disabled={disabled}
          placeholder={placeholder}
        />
      </FormControl>
    )}
  </FormFieldShell>
);
