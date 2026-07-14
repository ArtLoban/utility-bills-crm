import type { BillId } from "@/lib/db/schema/bills";
import type { PaymentId } from "@/lib/db/schema/payments";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { TServiceId } from "@/lib/db/schema/services";

export const ROUTES = {
  home: "/",
  about: "/about",
  project: "/project",
  terms: "/terms",
  privacy: "/privacy",
  sitemap: "/sitemap.xml",
  login: "/login",
  dashboard: "/dashboard",
  properties: "/properties",
  providers: "/providers",
  bills: "/bills",
  meters: "/meters",
  payments: "/payments",
  settings: "/settings",
  admin: {
    root: "/art-admin",
    properties: "/art-admin/properties",
    users: "/art-admin/users",
    landing: "/art-admin/landing",
    debug: "/art-admin/debug",
  },
} as const;

// Detail-path builders — a single source for entity URLs (never hardcode the literal).
export const billPath = (billId: BillId): string => `${ROUTES.bills}/${billId}`;

export const paymentPath = (paymentId: PaymentId): string => `${ROUTES.payments}/${paymentId}`;

export const serviceDetailPath = (propertyId: PropertyId, serviceId: TServiceId): string =>
  `${ROUTES.properties}/${propertyId}/services/${serviceId}`;
