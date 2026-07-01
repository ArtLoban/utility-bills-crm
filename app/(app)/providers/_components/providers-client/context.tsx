import { createSafeContext } from "@/lib/utils/create-safe-context";
import type { TProvider } from "@/lib/db/schema";

type TProvidersListContext = {
  requestDelete: (provider: TProvider) => void;
};

export const [ProvidersListContext, useProvidersList] =
  createSafeContext<TProvidersListContext>("ProvidersList");
