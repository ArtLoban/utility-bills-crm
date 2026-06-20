import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Bell, Pencil } from "lucide-react";

import { IconBadge } from "@/components/icon-badge";
import { ROUTES } from "@/lib/routes";
import type { TServiceId } from "@/lib/db/schema/services";

import { describeReminderAnchor } from "../../../anchor-label";
import type { TReminderListItem } from "../../../query";
import { DeleteReminderAction } from "./delete-reminder-action";

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
    <li className="border-border flex items-center gap-3.5 border-b px-5 py-3.5 last:border-b-0">
      <IconBadge icon={Bell} color="var(--primary)" size="sm" border />

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-foreground text-sm font-semibold tracking-[-0.1px]">{label}</span>
        <span className="text-muted-foreground text-sm break-words">{reminder.text}</span>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <Link
          href={editHref}
          aria-label={t("row.edit")}
          className="border-border text-muted-foreground hover:bg-muted hover:text-foreground flex size-8 items-center justify-center rounded-md border transition-colors"
        >
          <Pencil size={14} />
        </Link>
        <DeleteReminderAction reminderId={reminder.id} />
      </div>
    </li>
  );
};
