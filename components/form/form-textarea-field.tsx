"use client";

import { type ComponentProps } from "react";
import { type FieldValues, useWatch } from "react-hook-form";

import { FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { FormFieldShell } from "./form-field-shell";
import { type TFormFieldBaseProps } from "./types";

type TTextareaProps = Pick<
  ComponentProps<typeof Textarea>,
  "rows" | "placeholder" | "maxLength" | "disabled"
>;

type TProps<T extends FieldValues> = TFormFieldBaseProps<T> &
  TTextareaProps & {
    showCounter?: boolean;
  };

export const FormTextareaField = <T extends FieldValues>({
  control,
  name,
  label,
  description,
  className,
  required,
  showCounter,
  ...textareaProps
}: TProps<T>) => {
  const value = useWatch({ control, name });
  const { maxLength } = textareaProps;

  const counter =
    showCounter && maxLength != null ? (
      <span className="text-muted-foreground text-xs tabular-nums">
        {String(value ?? "").length}/{maxLength}
      </span>
    ) : undefined;

  return (
    <FormFieldShell
      control={control}
      name={name}
      label={label}
      description={description}
      className={className}
      required={required}
      labelAccessory={counter}
    >
      {(field) => (
        <FormControl aria-required={required || undefined}>
          <Textarea {...field} value={field.value ?? ""} {...textareaProps} />
        </FormControl>
      )}
    </FormFieldShell>
  );
};
