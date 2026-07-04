import { ACTIVITY_KINDS, type TActivityItem } from "@/features/admin-dashboard";
import type { TServiceTypeCode } from "@/features/services/service-type";
import {
  resolveServiceTypeLabel,
  type TServiceTypeTranslator,
} from "@/features/services/service-label";

type TActivityLine = {
  label: string;
  detail: string;
};

const getServiceTypeLabel = (code: string | null, t: TServiceTypeTranslator): string =>
  code ? resolveServiceTypeLabel(code as TServiceTypeCode, t) : "";

export const getActivityLine = (item: TActivityItem, t: TServiceTypeTranslator): TActivityLine => {
  const svc = getServiceTypeLabel(item.serviceTypeCode, t);
  const name = item.name ?? "";

  switch (item.kind) {
    case ACTIVITY_KINDS.PROPERTY:
      return { label: "New property", detail: name };
    case ACTIVITY_KINDS.USER:
      return { label: "New user", detail: name };
    case ACTIVITY_KINDS.SERVICE:
      return { label: `${svc} added`, detail: `to ${name}` };
    case ACTIVITY_KINDS.BILL:
      return { label: "Bill recorded", detail: `${svc} · ${name}` };
    case ACTIVITY_KINDS.PAYMENT:
      return { label: "Payment recorded", detail: `${svc} · ${name}` };
    case ACTIVITY_KINDS.READING:
      return { label: "Reading submitted", detail: `${svc} · ${name}` };
  }
};
