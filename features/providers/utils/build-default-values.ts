import { type DefaultValues } from "react-hook-form";

import { type TProviderInput } from "@/features/providers/schema";
import { ProviderFormField } from "@/features/providers/types";
import type { TProvider } from "@/lib/db/schema/providers";

export const buildDefaultValues = (provider?: TProvider): DefaultValues<TProviderInput> => {
  const { name, website, phone, notes } = provider ?? {};

  return {
    [ProviderFormField.NAME]: name ?? "",
    [ProviderFormField.WEBSITE]: website ?? "",
    [ProviderFormField.PHONE]: phone ?? "",
    [ProviderFormField.NOTES]: notes ?? "",
  };
};
