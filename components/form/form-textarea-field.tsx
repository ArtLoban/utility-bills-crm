"use client";

import { type ComponentProps } from "react";
import { type FieldValues } from "react-hook-form";

import { FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { FormFieldShell } from "./form-field-shell";
import { type TFormFieldBaseProps } from "./types";

type TTextareaProps = Pick<
  ComponentProps<typeof Textarea>,
  "rows" | "placeholder" | "maxLength" | "disabled"
>;

type TProps<T extends FieldValues> = TFormFieldBaseProps<T> & TTextareaProps;

export const FormTextareaField = <T extends FieldValues>({
  control,
  name,
  label,
  description,
  className,
  ...textareaProps
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
        <Textarea {...field} value={field.value ?? ""} {...textareaProps} />
      </FormControl>
    )}
  </FormFieldShell>
);
