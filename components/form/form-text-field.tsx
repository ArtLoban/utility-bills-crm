"use client";

import { type ComponentProps } from "react";
import { type FieldValues } from "react-hook-form";

import { FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormFieldShell } from "./form-field-shell";
import { type TFormFieldBaseProps } from "./types";

type TInputProps = Pick<
  ComponentProps<typeof Input>,
  "type" | "placeholder" | "maxLength" | "disabled" | "autoComplete" | "inputMode" | "autoFocus"
>;

type TProps<T extends FieldValues> = TFormFieldBaseProps<T> & TInputProps;

export const FormTextField = <T extends FieldValues>({
  control,
  name,
  label,
  description,
  className,
  ...inputProps
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
        <Input {...field} value={field.value ?? ""} {...inputProps} />
      </FormControl>
    )}
  </FormFieldShell>
);
