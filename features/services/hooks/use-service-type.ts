import { useTranslations } from "next-intl";
import {
  getServiceTypeVisuals,
  type TServiceTypeCode,
  type TServiceTypeVisuals,
} from "@/features/services/service-type";

type TServiceTypeMeta = TServiceTypeVisuals & { label: string };

export const useServiceTypeMetaFactory = () => {
  const t = useTranslations("services.types");

  return (type: TServiceTypeCode): TServiceTypeMeta => ({
    label: t.has(type) ? t(type) : type,
    ...getServiceTypeVisuals(type),
  });
};

export const useServiceTypeMeta = (type: TServiceTypeCode): TServiceTypeMeta =>
  useServiceTypeMetaFactory()(type);
