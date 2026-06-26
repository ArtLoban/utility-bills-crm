"use client";

import { type ComponentProps, type ReactNode } from "react";
import { type FieldValues } from "react-hook-form";

import { FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FieldAdornment } from "./field-adornment";
import { FormFieldShell } from "./form-field-shell";
import { type TFormFieldBaseProps } from "./types";

type TInputProps = Pick<
  ComponentProps<typeof Input>,
  | "type"
  | "placeholder"
  | "maxLength"
  | "disabled"
  | "autoComplete"
  | "inputMode"
  | "autoFocus"
  | "step"
  | "min"
>;

type TProps<T extends FieldValues> = TFormFieldBaseProps<T> &
  TInputProps & {
    adornment?: ReactNode;
    inputClassName?: string;
    labelClassName?: string;
  };

export const FormTextField = <T extends FieldValues>({
  control,
  name,
  label,
  description,
  className,
  required,
  adornment,
  inputClassName,
  labelClassName,
  ...inputProps
}: TProps<T>) => (
  <FormFieldShell
    control={control}
    name={name}
    label={label}
    description={description}
    className={className}
    required={required}
    labelClassName={labelClassName}
  >
    {(field) =>
      adornment ? (
        <div className="relative">
          <FormControl aria-required={required || undefined}>
            <Input
              {...field}
              value={field.value ?? ""}
              {...inputProps}
              className={cn("pr-12", inputClassName)}
            />
          </FormControl>
          <FieldAdornment>{adornment}</FieldAdornment>
        </div>
      ) : (
        <FormControl aria-required={required || undefined}>
          <Input {...field} value={field.value ?? ""} {...inputProps} className={inputClassName} />
        </FormControl>
      )
    }
  </FormFieldShell>
);
