"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import type { TServiceId } from "@/lib/db/schema/services";

import { ReminderForm } from "../reminder-form";
import type { TReminderListItem } from "../../query";
import { useReminderForm } from "./hooks/use-reminder-form";

type TProps = {
  serviceId: TServiceId;
  reminder?: TReminderListItem;
};

export const ReminderFormContent = ({ serviceId, reminder }: TProps) => {
  const router = useRouter();
  const t = useTranslations("reminders");

  // Refresh the underlying service page (the section is server-rendered) before dismissing.
  const onSuccess = () => {
    router.refresh();
    router.back();
  };

  const { form, handleSave, handleAnchorTypeChange, isSaving, isEditMode } = useReminderForm({
    serviceId,
    reminder,
    onSuccess,
  });
  const rootError = form.formState.errors.root?.message;
  const submitLabel = t(isEditMode ? "modal.edit.submit" : "modal.add.submit");

  return (
    <Form {...form}>
      <form onSubmit={handleSave} className="flex flex-col gap-6">
        <ReminderForm control={form.control} onAnchorTypeChange={handleAnchorTypeChange} />

        {rootError ? <p className="text-destructive text-sm">{rootError}</p> : null}

        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            {t("modal.cancel")}
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : null}
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
};
