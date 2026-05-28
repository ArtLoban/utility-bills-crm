"use client";

import { useTranslations } from "next-intl";

import { getServiceTypeVisuals, type TServiceTypeCode } from "@/features/services/service-type";
import type { TServiceType, TServiceTypeId } from "@/lib/db/schema/service-types";
import { ServiceTypeCard } from "./service-type-card";

type TProps = {
  serviceTypes: TServiceType[];
  existingTypeIds: TServiceTypeId[];
  selectedTypeId: string;
  onSelect: (id: TServiceTypeId) => void;
};

export const ServiceTypeSection = ({
  serviceTypes,
  existingTypeIds,
  selectedTypeId,
  onSelect,
}: TProps) => {
  const t = useTranslations("services");
  const existingSet = new Set(existingTypeIds);

  const getMeasurementLabel = (st: TServiceType): string => {
    if (st.measurementType === "fixed") return t("serviceForm.measurement.fixed");
    if (st.supportsZones) return t("serviceForm.measurement.meteredZones");
    return t("serviceForm.measurement.metered");
  };

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
      {serviceTypes.map((st) => {
        const { color, Icon } = getServiceTypeVisuals(st.code as TServiceTypeCode);
        return (
          <ServiceTypeCard
            key={st.id}
            serviceType={st}
            Icon={Icon}
            color={color}
            label={t(`types.${st.code as TServiceTypeCode}`)}
            measurementLabel={getMeasurementLabel(st)}
            isSelected={selectedTypeId === st.id}
            isDisabled={existingSet.has(st.id)}
            addedBadgeLabel={t("serviceForm.badge.added")}
            onClick={() => onSelect(st.id as TServiceTypeId)}
          />
        );
      })}
    </div>
  );
};
