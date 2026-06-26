"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { FormContainer } from "@/components/form-container";
import { ROUTES } from "@/lib/routes";
import { useReadingForm } from "@/features/readings/hooks/use-reading-form";
import { readingSubmitLabelKey } from "@/features/readings/utils/submit-label";
import type { TMeter } from "@/lib/db/schema/meters";
import type { TReading } from "@/lib/db/schema/readings";
import type { TServiceType } from "@/lib/db/schema/service-types";
import { ReadingForm } from "./reading-form";

type TProps = {
  meter: TMeter;
  serviceType: TServiceType;
  propertyName: string;
  lastReading: TReading | null;
  reading?: TReading;
};

export const ReadingFormContent = ({
  meter,
  serviceType,
  propertyName,
  lastReading,
  reading,
}: TProps) => {
  const router = useRouter();
  const t = useTranslations("readings.form");
  const tForm = useTranslations("common.form");
  const onClose = () => router.back();

  const { form, handleSave, isSaving, isEdit, hasAnyWarning, zoneStates, lastReadingDate } =
    useReadingForm({ meter, reading, lastReading, onClose });

  return (
    <FormContainer
      onSubmit={handleSave}
      backHref={`${ROUTES.properties}/${meter.propertyId}/meters/${meter.id}`}
      submitText={t(readingSubmitLabelKey(isEdit, hasAnyWarning))}
      cancelText={t("actions.cancel")}
      savingText={tForm("saving")}
      footerText={tForm("syncNote")}
      size="sm"
      isSaving={isSaving}
    >
      <ReadingForm
        form={form}
        meter={meter}
        serviceType={serviceType}
        propertyName={propertyName}
        zoneStates={zoneStates}
        lastReadingDate={lastReadingDate}
      />
    </FormContainer>
  );
};
