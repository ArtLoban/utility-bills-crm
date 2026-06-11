"use client";

import { type FieldValues } from "react-hook-form";

import { FormControl } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type TSelectableEntity } from "@/components/select-input/types";
import { FormFieldShell } from "./form-field-shell";
import { type TFormFieldBaseProps } from "./types";

const CLEAR_VALUE = "__clear__";

type TProps<T extends FieldValues, E extends TSelectableEntity> = TFormFieldBaseProps<T> & {
  options: E[];
  placeholder?: string;
  clearable?: boolean;
  disabled?: boolean;
};

export const FormSelectField = <T extends FieldValues, E extends TSelectableEntity>({
  control,
  name,
  label,
  description,
  className,
  options,
  placeholder,
  clearable = false,
  disabled,
}: TProps<T, E>) => (
  <FormFieldShell
    control={control}
    name={name}
    label={label}
    description={description}
    className={className}
  >
    {(field) => (
      <Select
        value={field.value == null ? "" : String(field.value)}
        onValueChange={(value) => field.onChange(clearable && value === CLEAR_VALUE ? null : value)}
        disabled={disabled}
      >
        <FormControl>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
        </FormControl>
        <SelectContent align="start">
          {clearable && placeholder ? (
            <SelectItem value={CLEAR_VALUE} className="text-muted-foreground">
              {placeholder}
            </SelectItem>
          ) : null}
          {options.map(({ id, name: optionLabel }) => (
            <SelectItem key={id} value={id}>
              {optionLabel}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )}
  </FormFieldShell>
);
