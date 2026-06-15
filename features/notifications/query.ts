import { and, asc, eq, isNull } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema/auth";
import type { UserId } from "@/lib/db/schema/auth";
import { reminders } from "@/lib/db/schema/notifications";
import { properties } from "@/lib/db/schema/properties";
import { services } from "@/lib/db/schema/services";
import { serviceTypes } from "@/lib/db/schema/service-types";
import type { TLocale } from "@/lib/locale/constants";
import type { TReminderAnchorType } from "@/lib/db/schema/notifications";

// A reminder enriched with everything the delivery job needs: the firing inputs (anchor),
// the owner's id + locale (grouping + rendering), and the digest's display fields.
export type TReminderCandidate = {
  userId: UserId;
  userLocale: TLocale;
  anchorType: TReminderAnchorType;
  anchorValue: number;
  propertyName: string;
  serviceTypeCode: string;
  text: string;
};

// All reminders eligible to fire today, before the date predicate is applied.
// Excludes reminders whose service or property was soft-deleted (the reminder row survives a
// soft-delete, so this is the guard against notifying about a removed service), and demo users
// (demo accounts never trigger real side-effects — consistent with the activity feed). Ordered
// for a stable digest: by user, then property name, then the service type's canonical sort.
export const dueReminderCandidates = async (): Promise<TReminderCandidate[]> =>
  db
    .select({
      userId: reminders.userId,
      userLocale: users.locale,
      anchorType: reminders.anchorType,
      anchorValue: reminders.anchorValue,
      propertyName: properties.name,
      serviceTypeCode: serviceTypes.code,
      text: reminders.text,
    })
    .from(reminders)
    .innerJoin(users, eq(reminders.userId, users.id))
    .innerJoin(services, eq(reminders.serviceId, services.id))
    .innerJoin(properties, eq(services.propertyId, properties.id))
    .innerJoin(serviceTypes, eq(services.serviceTypeId, serviceTypes.id))
    .where(and(isNull(services.deletedAt), isNull(properties.deletedAt), eq(users.isDemo, false)))
    .orderBy(asc(reminders.userId), asc(properties.name), asc(serviceTypes.sortOrder));
