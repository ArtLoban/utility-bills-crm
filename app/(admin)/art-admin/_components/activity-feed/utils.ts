import { ACTIVITY_KINDS, type TActivityItem } from "@/features/admin-dashboard";
import type { TServiceTypeCode } from "@/features/services/service-type";

import { SERVICE_TYPE_LABELS } from "./constants";

type TActivityLine = {
  label: string;
  detail: string;
};

const getServiceTypeLabel = (code: string | null): string => {
  if (!code) return "";
  return SERVICE_TYPE_LABELS[code as TServiceTypeCode] ?? code;
};

export const getActivityLine = (item: TActivityItem): TActivityLine => {
  const svc = getServiceTypeLabel(item.serviceTypeCode);
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
