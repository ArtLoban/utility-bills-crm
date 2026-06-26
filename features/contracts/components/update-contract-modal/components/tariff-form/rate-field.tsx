"use client";

import { type ReactNode } from "react";
import { type Control, type FieldPath } from "react-hook-form";

import { FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FieldAdornment } from "@/components/form/field-adornment";
import { FormFieldShell } from "@/components/form/form-field-shell";
import type { TChangeTariffForm } from "@/features/tariffs/schema";

type TProps = {
  control: Control<TChangeTariffForm>;
  name: FieldPath<TChangeTariffForm>;
  color: string;
  label: string;
  adornment: ReactNode;
};

export const RateField = ({ control, name, color, label, adornment }: TProps) => (
  <FormFieldShell
    control={control}
    name={name}
    label={label}
    labelClassName="text-muted-foreground text-xs font-medium"
  >
    {(field) => (
      <div className="relative">
        <FormControl>
          <Input
            {...field}
            value={field.value ?? ""}
            type="number"
            step="0.0001"
            min="0"
            placeholder="0.0000"
            className="pr-12 tabular-nums"
            style={{
              borderColor: `color-mix(in srgb, ${color} 50%, transparent)`,
              background: `color-mix(in srgb, ${color} 5%, transparent)`,
            }}
          />
        </FormControl>
        <FieldAdornment>{adornment}</FieldAdornment>
      </div>
    )}
  </FormFieldShell>
);
