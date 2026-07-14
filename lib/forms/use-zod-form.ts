"use client";

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

// useZodForm({ schema, defaultValues, mode }) — RHF + zodResolver, no i18n.
// Zod messages render exactly as the schema wrote them, so the schema holds ready
// strings. This is the base primitive and it must stay free of next-intl: forms that
// legitimately need no translation (the English-only landing CMS editors) would
// otherwise still require a NextIntlClientProvider in scope.
// Forms whose schemas store relative i18n keys use `useLocalizedZodForm`, which
// composes this hook and supplies `translate`.

export type TTranslateMessage = (key: string) => string;

export type TUseZodFormParams<TSchema extends z.ZodType<FieldValues, FieldValues>> = {
  schema: TSchema;
  defaultValues: DefaultValues<z.output<TSchema>>;
  mode?: UseFormProps<z.output<TSchema>>["mode"];
  translate?: TTranslateMessage;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

// RHF FieldErrors is a nested tree of { type, message, ref } leaves. Walk it and
// translate every `message` in place — Zod stores relative i18n keys as messages,
// so FormMessage downstream renders a ready string instead of a raw key.
const translateErrorMessages = (
  errors: Record<string, unknown>,
  translate: TTranslateMessage,
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
  defaultValues,
  mode = "onTouched",
  translate,
}: TUseZodFormParams<TSchema>): UseFormReturn<z.output<TSchema>> => {
  // zodResolver is typed Resolver<input, …, output>; we model the form on the parsed
  // output type (input ≡ output for our transform-free schemas), so bridge the value
  // generic here — the single unavoidable cast, contained to this helper.
  const baseResolver = zodResolver(schema) as unknown as Resolver<z.output<TSchema>>;

  return useForm<z.output<TSchema>>({
    defaultValues,
    mode,
    resolver: async (values, context, options) => {
      const result = await baseResolver(values, context, options);
      if (translate && result.errors) {
        translateErrorMessages(result.errors as Record<string, unknown>, translate);
      }
      return result;
    },
  });
};
