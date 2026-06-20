import { getTranslations } from "next-intl/server";

import { SectionCard } from "@/components/section-card";
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
    <SectionCard
      title={t("title")}
      description={t("monthlyNote")}
      actions={
        hasReminders ? (
          <AddReminderButton isLinked={isTelegramLinked} newHref={newHref} />
        ) : undefined
      }
    >
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
    </SectionCard>
  );
};
