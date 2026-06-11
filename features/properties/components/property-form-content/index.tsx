"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
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

  const { form, handleSave, isSaving, isEditMode } = usePropertyForm({ property, onClose });
  const rootError = form.formState.errors.root?.message;

  return (
    <Form {...form}>
      <form onSubmit={handleSave} className="flex flex-col gap-6">
        <PropertyForm control={form.control} />

        {rootError ? <p className="text-destructive text-sm">{rootError}</p> : null}

        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onClose}>
            {t("modal.cancel")}
          </Button>
          <Button type="submit" disabled={isSaving}>
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
      </form>
    </Form>
  );
};
