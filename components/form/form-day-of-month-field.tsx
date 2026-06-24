"use client";

import { type FieldValues } from "react-hook-form";

import { FormControl } from "@/components/ui/form";
import { DayOfMonthPicker } from "@/components/day-of-month-picker";
import { FormFieldShell } from "./form-field-shell";
import { type TFormFieldBaseProps } from "./types";

type TProps<T extends FieldValues> = TFormFieldBaseProps<T> & {
  disabled?: boolean;
  placeholder?: string;
  pickerHeading?: string;
  clampNote?: string;
};

export const FormDayOfMonthField = <T extends FieldValues>({
  control,
  name,
  label,
  description,
  className,
  required,
  disabled,
  placeholder,
  pickerHeading,
  clampNote,
}: TProps<T>) => (
  <FormFieldShell
    control={control}
    name={name}
    label={label}
    description={description}
    className={className}
    required={required}
  >
    {(field) => (
      <FormControl aria-required={required || undefined}>
        <DayOfMonthPicker
          value={field.value ? Number(field.value) : null}
          onChange={(day) => field.onChange(String(day))}
          disabled={disabled}
          placeholder={placeholder}
          heading={pickerHeading}
          clampNote={clampNote}
        />
      </FormControl>
    )}
  </FormFieldShell>
);
