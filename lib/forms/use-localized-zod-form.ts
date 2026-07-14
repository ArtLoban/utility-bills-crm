"use client";

import { useTranslations } from "next-intl";
import { type FieldValues, type UseFormReturn } from "react-hook-form";
import { type z } from "zod";
import { useZodForm, type TUseZodFormParams } from "@/lib/forms/use-zod-form";

type TUseLocalizedZodFormParams<TSchema extends z.ZodType<FieldValues, FieldValues>> = Omit<
  TUseZodFormParams<TSchema>,
  "translate"
> & {
  namespace: NonNullable<Parameters<typeof useTranslations>[0]>;
};

export const useLocalizedZodForm = <TSchema extends z.ZodType<FieldValues, FieldValues>>({
  namespace,
  ...params
}: TUseLocalizedZodFormParams<TSchema>): UseFormReturn<z.output<TSchema>> => {
  const t = useTranslations(namespace);

  return useZodForm({ ...params, translate: (key) => t(key as never) });
};
