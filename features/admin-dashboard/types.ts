export type TAdminDashboardStats = {
  users: number;
  properties: number;
  bills: number;
  softDeleted: number;
};

export const ACTIVITY_KINDS = {
  PROPERTY: "property",
  USER: "user",
  SERVICE: "service",
  BILL: "bill",
  PAYMENT: "payment",
  READING: "reading",
} as const;

export type TActivityKind = (typeof ACTIVITY_KINDS)[keyof typeof ACTIVITY_KINDS];

export type TActivityItem = {
  kind: TActivityKind;
  id: string;
  occurredAt: Date;
  // property name (for property, service, bill, payment, reading) OR user name/email (for user)
  name: string | null;
  // service_types.code — i18n key; null for property and user kinds
  serviceTypeCode: string | null;
  // period_month::text for bill, amount::text for payment; null otherwise
  extra: string | null;
};
