import { SERVICE_TYPE_CODES } from "@/features/services/service-type";
import { useTranslations } from "next-intl";
import { TSelectableEntity } from "@/components/select-input/types";

type TTranslateFn = ReturnType<typeof useTranslations<"services.types">>;

export const getServiceTypeOptions = (t: TTranslateFn): TSelectableEntity[] => {
  return [
    {
      id: SERVICE_TYPE_CODES.ELECTRICITY,
      name: t(SERVICE_TYPE_CODES.ELECTRICITY),
    },
    {
      id: SERVICE_TYPE_CODES.GAS,
      name: t(SERVICE_TYPE_CODES.GAS),
    },
    {
      id: SERVICE_TYPE_CODES.COLD_WATER,
      name: t(SERVICE_TYPE_CODES.COLD_WATER),
    },
    {
      id: SERVICE_TYPE_CODES.HOT_WATER,
      name: t(SERVICE_TYPE_CODES.HOT_WATER),
    },
    {
      id: SERVICE_TYPE_CODES.GAS_DELIVERY,
      name: t(SERVICE_TYPE_CODES.GAS_DELIVERY),
    },
    {
      id: SERVICE_TYPE_CODES.HEATING,
      name: t(SERVICE_TYPE_CODES.HEATING),
    },
    {
      id: SERVICE_TYPE_CODES.BUILDING_MAINTENANCE,
      name: t(SERVICE_TYPE_CODES.BUILDING_MAINTENANCE),
    },
    {
      id: SERVICE_TYPE_CODES.GARBAGE_COLLECTION,
      name: t(SERVICE_TYPE_CODES.GARBAGE_COLLECTION),
    },
    {
      id: SERVICE_TYPE_CODES.INTERNET,
      name: t(SERVICE_TYPE_CODES.INTERNET),
    },
    {
      id: SERVICE_TYPE_CODES.INTERCOM,
      name: t(SERVICE_TYPE_CODES.INTERCOM),
    },
    {
      id: SERVICE_TYPE_CODES.HOA_FEES,
      name: t(SERVICE_TYPE_CODES.HOA_FEES),
    },
  ];
};
