"use client";

import { useTranslations } from "next-intl";
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type Resolver,
  type UseFormProps,
  type UseFormReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";

// useZodForm({ schema, namespace?, defaultValues, mode }) — RHF + zodResolver + перевод сообщений.
// Схемы доменных форм хранят относительные i18n-ключи как Zod-сообщения; хук обходит дерево
// FieldErrors и переводит каждый message через useTranslations(namespace), а FormMessage рендерит
// готовые строки. Это стандарт для всех доменных форм.
// namespace опционален: если не передан, перевод пропускается и сообщения схемы рендерятся как есть.
// Используется для English-only форм (CMS-редакторы лендинга), где сообщения — готовые строки.

type TUseZodFormParams<TSchema extends z.ZodType<FieldValues, FieldValues>> = {
  schema: TSchema;
  namespace?: Parameters<typeof useTranslations>[0];
  defaultValues: DefaultValues<z.output<TSchema>>;
  mode?: UseFormProps<z.output<TSchema>>["mode"];
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

// RHF FieldErrors is a nested tree of { type, message, ref } leaves. Walk it and
// translate every `message` in place — Zod stores relative i18n keys as messages,
// so FormMessage downstream renders a ready string instead of a raw key.
const translateErrorMessages = (
  errors: Record<string, unknown>,
  translate: (key: string) => string,
): void => {
  for (const [key, value] of Object.entries(errors)) {
    if (key === "ref") continue;
    if (key === "message" && typeof value === "string") {
      errors.message = translate(value);
      continue;
    }
    if (isRecord(value)) translateErrorMessages(value, translate);
  }
};

// Constrained to transform-free schemas (z.input ≡ z.output), which covers every
// current domain schema. Revisit the generics if a schema introduces a transform.
export const useZodForm = <TSchema extends z.ZodType<FieldValues, FieldValues>>({
  schema,
  namespace,
  defaultValues,
  mode = "onTouched",
}: TUseZodFormParams<TSchema>): UseFormReturn<z.output<TSchema>> => {
  const t = useTranslations(namespace);
  // Keys are dynamic i18n paths produced by Zod; the full key union is too large
  // to express here (the namespace is generic), so widen to `never` at the call.
  const translate = (key: string): string => t(key as never);

  // zodResolver is typed Resolver<input, …, output>; we model the form on the parsed
  // output type (input ≡ output for our transform-free schemas), so bridge the value
  // generic here — the single unavoidable cast, contained to this helper.
  const baseResolver = zodResolver(schema) as unknown as Resolver<z.output<TSchema>>;

  return useForm<z.output<TSchema>>({
    defaultValues,
    mode,
    resolver: async (values, context, options) => {
      const result = await baseResolver(values, context, options);
      if (namespace && result.errors) {
        translateErrorMessages(result.errors as Record<string, unknown>, translate);
      }
      return result;
    },
  });
};
