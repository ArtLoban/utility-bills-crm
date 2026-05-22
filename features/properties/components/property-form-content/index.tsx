"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PropertyForm } from "../property-form";
import { usePropertyForm } from "./hooks/use-property-form";
import type { TPropertyDetail } from "@/app/(app)/properties/[id]/_data/queries";

type TProps = {
  property?: TPropertyDetail;
};

export const PropertyFormContent = ({ property }: TProps) => {
  const router = useRouter();
  const t = useTranslations("properties");
  const onClose = () => router.back();

  const { form, errors, formError, set, handleSave, isSaving, canSave, isEditMode } =
    usePropertyForm({ property, onClose });

  return (
    <div className="flex flex-col gap-6">
      <PropertyForm form={form} errors={errors} formError={formError} set={set} />
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
