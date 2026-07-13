import { type DefaultValues } from "react-hook-form";

import { type TPropertyInput } from "@/features/properties/schema";
import type { TPropertyDetail } from "@/app/(secure)/(app)/properties/[id]/_data/queries";

export const buildDefaultValues = (property?: TPropertyDetail): DefaultValues<TPropertyInput> => ({
  name: property?.name ?? "",
  type: property?.type,
  address: property?.address ?? "",
  notes: property?.notes ?? "",
});
