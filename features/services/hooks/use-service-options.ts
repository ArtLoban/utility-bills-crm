import { useTranslations } from "next-intl";
import { getServiceTypeOptions } from "@/features/services/utils/get-service-type-options";

export const useServiceOptions = () => {
  const t = useTranslations("services.types");

  return getServiceTypeOptions(t);
};
