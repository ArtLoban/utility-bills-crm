"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useProviderForm } from "@/features/providers/hooks/use-provider-form";
import { ProviderForm } from "./provider-form";
import type { TProvider } from "@/lib/db/schema/providers";

type TProps = {
  provider?: TProvider;
};

export const ProviderFormContent = ({ provider }: TProps) => {
  const router = useRouter();
  const t = useTranslations("providers");
  const onClose = () => router.back();

  const { form, errors, formError, set, handleSave, isSaving, canSave, isEditMode } =
    useProviderForm({ provider, onClose });

  return (
    <div className="flex flex-col gap-6">
      <ProviderForm form={form} errors={errors} formError={formError} set={set} />
      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={onClose}>
          {t("modal.cancel")}
        </Button>
        <Button type="button" onClick={handleSave} disabled={!canSave || isSaving}>
          {isSaving ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Saving…
            </>
          ) : (
            t(isEditMode ? "modal.edit.submit" : "modal.add.submit")
          )}
        </Button>
      </div>
    </div>
  );
};
