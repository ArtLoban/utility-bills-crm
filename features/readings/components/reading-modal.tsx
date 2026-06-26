"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { Modal } from "@/components/modal";
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

export const ReadingModal = ({
  meter,
  serviceType,
  propertyName,
  lastReading,
  reading,
}: TProps) => {
  const router = useRouter();
  const t = useTranslations("readings.form");
  const onClose = () => router.back();

  const { form, handleSave, isSaving, isEdit, hasAnyWarning, zoneStates, lastReadingDate } =
    useReadingForm({ meter, reading, lastReading, onClose });

  return (
    <Modal
      open
      onOpenChange={(open) => !open && onClose()}
      title={t(isEdit ? "title.edit" : "title.create")}
      confirmLabel={t(readingSubmitLabelKey(isEdit, hasAnyWarning))}
      cancelLabel={t("actions.cancel")}
      onConfirm={handleSave}
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
    </Modal>
  );
};
