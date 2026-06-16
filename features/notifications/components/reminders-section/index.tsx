import { getTranslations } from "next-intl/server";

import { ROUTES } from "@/lib/routes";
import type { TServiceId } from "@/lib/db/schema/services";

import type { TReminderListItem } from "../../query";
import { AddReminderButton } from "./components/add-reminder-button";
import { DisconnectedBanner } from "./components/disconnected-banner";
import { ReminderRow } from "./components/reminder-row";
import { RemindersEmptyState } from "./components/reminders-empty-state";

type TProps = {
  reminders: TReminderListItem[];
  isTelegramLinked: boolean;
  propertyId: string;
  serviceId: TServiceId;
};

export const RemindersSection = async ({
  reminders,
  isTelegramLinked,
  propertyId,
  serviceId,
}: TProps) => {
  const t = await getTranslations("reminders");
  const hasReminders = reminders.length > 0;
  const newHref = `${ROUTES.properties}/${propertyId}/services/${serviceId}/reminders/new`;

  return (
    <div className="border-border bg-card rounded-[8px] border shadow-[0_1px_2px_rgba(24,24,27,0.05)]">
      <div className="border-border flex items-start justify-between gap-3 border-b px-5 py-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-foreground text-sm font-semibold tracking-tight">{t("title")}</span>
          <span className="text-muted-foreground text-xs">{t("monthlyNote")}</span>
        </div>
        {hasReminders ? <AddReminderButton isLinked={isTelegramLinked} newHref={newHref} /> : null}
      </div>

      {hasReminders ? (
        <>
          {isTelegramLinked ? null : <DisconnectedBanner />}
          <ul>
            {reminders.map((reminder) => (
              <ReminderRow
                key={reminder.id}
                reminder={reminder}
                propertyId={propertyId}
                serviceId={serviceId}
              />
            ))}
          </ul>
        </>
      ) : (
        <RemindersEmptyState isLinked={isTelegramLinked} newHref={newHref} />
      )}
    </div>
  );
};
