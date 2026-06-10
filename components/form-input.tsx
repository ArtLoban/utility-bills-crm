import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ReactNode } from "react";
import { type Control, type FieldPath, type FieldValues } from "react-hook-form";

type TProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  children: ReactNode;
};

export const FormInput = <T extends FieldValues>({ control, name, label, children }: TProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          {children}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
