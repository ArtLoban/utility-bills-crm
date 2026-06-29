import { type ReactNode } from "react";
import { type Control, type FieldPath, type FieldValues } from "react-hook-form";

import { FormTextField } from "@/components/form/form-text-field";

import { FieldHint } from "./field-hint";

type TProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  icon: ReactNode;
  label: string;
  hint: string;
};

export const UrlField = <T extends FieldValues>({
  control,
  name,
  icon,
  label,
  hint,
}: TProps<T>) => (
  <FormTextField
    control={control}
    name={name}
    type="url"
    label={
      <span className="inline-flex items-center gap-2">
        <span className="text-muted-foreground inline-flex size-4 items-center justify-center">
          {icon}
        </span>
        {label}
      </span>
    }
    labelAccessory={<FieldHint>{hint}</FieldHint>}
    inputClassName="font-mono"
  />
);
