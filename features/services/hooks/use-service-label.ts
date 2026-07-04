import { useTranslations } from "next-intl";

import { resolveServiceLabel, type TServiceLabelInput } from "@/features/services/service-label";

export const useServiceLabel = () => {
  const t = useTranslations("services.types");

  return (input: TServiceLabelInput): string => resolveServiceLabel(input, t);
};
