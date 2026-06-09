import { useTranslations } from "next-intl";
import { getServiceTypeVisuals, TServiceTypeCode } from "@/features/services/service-type";

export const useServiceType = (type: TServiceTypeCode) => {
  const t = useTranslations("services.types");

  const visuals = getServiceTypeVisuals(type);

  return {
    label: t.has(type) ? t(type) : type,
    ...visuals,
  };
};
