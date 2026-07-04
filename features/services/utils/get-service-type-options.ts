import { SERVICE_TYPE_CODES } from "@/features/services/service-type";
import { useTranslations } from "next-intl";
import { TSelectableEntity } from "@/components/select-input/types";

type TTranslateFn = ReturnType<typeof useTranslations<"services.types">>;

export const getServiceTypeOptions = (t: TTranslateFn): TSelectableEntity[] =>
  Object.values(SERVICE_TYPE_CODES).map((code) => ({ id: code, name: t(code) }));
