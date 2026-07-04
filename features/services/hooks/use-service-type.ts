import { useTranslations } from "next-intl";
import {
  getServiceTypeVisuals,
  type TServiceTypeCode,
  type TServiceTypeVisuals,
} from "@/features/services/service-type";
import { resolveServiceTypeLabel } from "@/features/services/service-label";

type TServiceTypeMeta = TServiceTypeVisuals & { label: string };

export const useServiceTypeMetaFactory = () => {
  const t = useTranslations("services.types");

  return (type: TServiceTypeCode): TServiceTypeMeta => ({
    label: resolveServiceTypeLabel(type, t),
    ...getServiceTypeVisuals(type),
  });
};

export const useServiceTypeMeta = (type: TServiceTypeCode): TServiceTypeMeta =>
  useServiceTypeMetaFactory()(type);
