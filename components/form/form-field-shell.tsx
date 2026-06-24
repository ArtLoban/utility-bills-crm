"use client";

import { type ReactNode } from "react";
import { type ControllerRenderProps, type FieldPath, type FieldValues } from "react-hook-form";

import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { type TFormFieldBaseProps } from "./types";

type TProps<T extends FieldValues> = TFormFieldBaseProps<T> & {
  labelAccessory?: ReactNode;
  children: (field: ControllerRenderProps<T, FieldPath<T>>) => ReactNode;
};

export const FormFieldShell = <T extends FieldValues>({
  control,
  name,
  label,
  description,
  className,
  required,
  labelAccessory,
  children,
}: TProps<T>) => {
  const labelNode = label ? (
    <FormLabel>
      {label}
      {required ? (
        <span aria-hidden="true" className="text-destructive -ml-1">
          *
        </span>
      ) : null}
    </FormLabel>
  ) : null;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {labelAccessory ? (
            <div className="flex items-baseline justify-between gap-2">
              {labelNode ?? <span />}
              {labelAccessory}
            </div>
          ) : (
            labelNode
          )}
          {children(field)}
          {description ? <FormDescription>{description}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
