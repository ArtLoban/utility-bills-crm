"use client";

import { type Control } from "react-hook-form";

import { FormFieldShell } from "@/components/form/form-field-shell";
import { Switch } from "@/components/ui/switch";
import { CreateMeterFormField } from "@/features/meters/types";
import type { TCreateMeterFormValues } from "@/features/meters/schema";

type TServiceOption = { id: string; label: string };

type TProps = {
  control: Control<TCreateMeterFormValues>;
  label: string;
  description?: string;
  options: TServiceOption[];
};

// Multi-select of the service lines a meter feeds, rendered as labelled toggle rows (reusing the
// Switch primitive — no checkbox dependency). Bound to the `serviceIds` string[] field.
export const ServiceSelectField = ({ control, label, description, options }: TProps) => (
  <FormFieldShell
    control={control}
    name={CreateMeterFormField.SERVICE_IDS}
    label={label}
    description={description}
    required
  >
    {(field) => {
      const selected = new Set<string>((field.value as string[]) ?? []);
      const toggle = (id: string, on: boolean) => {
        const next = new Set(selected);
        if (on) next.add(id);
        else next.delete(id);
        field.onChange([...next]);
      };

      return (
        <div className="flex flex-col gap-2">
          {options.map(({ id, label: optionLabel }) => {
            const isOn = selected.has(id);
            return (
              <div
                key={id}
                data-engaged={isOn || undefined}
                className="bg-muted data-[engaged]:bg-primary/10 data-[engaged]:border-primary/25 flex items-center justify-between rounded-lg border px-3 py-2.5"
              >
                <span className="min-w-0 truncate text-sm font-medium">{optionLabel}</span>
                <Switch
                  checked={isOn}
                  onCheckedChange={(on) => toggle(id, on)}
                  aria-label={optionLabel}
                  className="ml-3 shrink-0"
                />
              </div>
            );
          })}
        </div>
      );
    }}
  </FormFieldShell>
);
