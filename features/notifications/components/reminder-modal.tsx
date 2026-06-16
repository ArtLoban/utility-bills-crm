"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { TServiceId } from "@/lib/db/schema/services";

import type { TReminderListItem } from "../query";
import { ReminderFormContent } from "./reminder-form-content";

type TProps = {
  serviceId: TServiceId;
  reminder?: TReminderListItem;
};

export const ReminderModal = ({ serviceId, reminder }: TProps) => {
  const router = useRouter();
  const t = useTranslations("reminders");

  return (
    <Dialog open onOpenChange={(open) => !open && router.back()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{t(reminder ? "modal.edit.title" : "modal.add.title")}</DialogTitle>
        </DialogHeader>
        <ReminderFormContent serviceId={serviceId} reminder={reminder} />
      </DialogContent>
    </Dialog>
  );
};
