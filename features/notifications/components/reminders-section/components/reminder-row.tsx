import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Bell, Pencil } from "lucide-react";

import { IconBadge } from "@/components/icon-badge";
import { ROUTES } from "@/lib/routes";
import type { TServiceId } from "@/lib/db/schema/services";

import { describeReminderAnchor } from "../../../anchor-label";
import type { TReminderListItem } from "../../../query";
import { DeleteReminderAction } from "./delete-reminder-action";
import { Button } from "@/components/ui/button";

type TProps = {
  reminder: TReminderListItem;
  propertyId: string;
  serviceId: TServiceId;
};

export const ReminderRow = async ({ reminder, propertyId, serviceId }: TProps) => {
  const t = await getTranslations("reminders");
  const anchor = describeReminderAnchor(reminder);

  const label =
    anchor.kind === "dayOfMonth"
      ? t("anchor.dayOfMonth", { day: anchor.day })
      : anchor.kind === "lastDay"
        ? t("anchor.lastDay")
        : t("anchor.daysBeforeEnd", { days: anchor.days });

  const editHref = `${ROUTES.properties}/${propertyId}/services/${serviceId}/reminders/${reminder.id}/edit`;

  return (
    <li className="border-border flex items-start gap-3.5 border-b px-4 py-3.5 last:border-b-0 sm:items-center sm:px-5">
      <IconBadge icon={Bell} color="var(--primary)" size="sm" border />

      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-foreground text-sm font-semibold tracking-[-0.1px]">{label}</span>
          <span className="text-muted-foreground text-sm break-words">{reminder.text}</span>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 self-end sm:self-auto">
          <Button variant="outline" size="icon" aria-label={t("row.edit")} asChild>
            <Link href={editHref}>
              <Pencil />
            </Link>
          </Button>
          <DeleteReminderAction reminderId={reminder.id} />
        </div>
      </div>
    </li>
  );
};
