"use client";

import { type FieldValues } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { type TFormFieldBaseProps } from "./types";

type TProps<T extends FieldValues> = TFormFieldBaseProps<T> & {
  disabled?: boolean;
};

export const FormSwitchField = <T extends FieldValues>({
  control,
  name,
  label,
  description,
  className,
  required,
  disabled,
}: TProps<T>) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className={className}>
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            {label ? <FormLabel>{label}</FormLabel> : null}
            {description ? <FormDescription>{description}</FormDescription> : null}
          </div>
          <FormControl aria-required={required || undefined}>
            <Switch
              checked={Boolean(field.value)}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
        </div>
        <FormMessage />
      </FormItem>
    )}
  />
);
