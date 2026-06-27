"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { Modal } from "@/components/modal";
import { useReplaceMeterForm } from "@/features/meters/hooks/use-replace-meter-form";
import type { TMeter } from "@/lib/db/schema/meters";

import { ReplaceMeterForm } from "./replace-meter-form";

type TProps = {
  meter: TMeter;
  supportsZones: boolean;
};

export const ReplaceMeterModal = ({ meter, supportsZones }: TProps) => {
  const router = useRouter();
  const t = useTranslations("meters.replaceForm");
  const tMeta = useTranslations("meters.detail.meta");
  const onClose = () => router.back();

  const { form, handleSave, isSaving } = useReplaceMeterForm({ meter, onClose });

  return (
    <Modal
      open
      onOpenChange={(open) => !open && onClose()}
      title={t("title")}
      description={meter.serialNumber ? tMeta("serial", { value: meter.serialNumber }) : undefined}
      confirmLabel={t("actions.replace")}
      cancelLabel={t("actions.cancel")}
      onConfirm={handleSave}
      isSaving={isSaving}
    >
      <ReplaceMeterForm form={form} meter={meter} supportsZones={supportsZones} />
    </Modal>
  );
};
