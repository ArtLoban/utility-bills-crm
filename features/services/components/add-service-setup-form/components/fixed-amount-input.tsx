"use client";

import { useTranslations } from "next-intl";
import type { Control } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ServiceSetupFormField } from "../schema";
import type { TServiceSetupForm } from "../schema";

type TProps = {
  control: Control<TServiceSetupForm>;
};

export const FixedAmountInput = ({ control }: TProps) => {
  const t = useTranslations("services.serviceForm");

  return (
    <FormField
      control={control}
      name={ServiceSetupFormField.FIXED_AMOUNT}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("fields.fixedAmount.label")}</FormLabel>
          <div className="relative">
            <FormControl>
              <Input
                placeholder={t("fields.fixedAmount.placeholder")}
                className="pr-14"
                {...field}
              />
            </FormControl>
            <span className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs">
              UAH
            </span>
          </div>
          <FormDescription>{t("hint.fixedAmount")}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
