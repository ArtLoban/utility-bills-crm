import { TPayment } from "@/app/(app)/payments/_data/mock";

type TFilterQuery = {
  property: string | null;
  service: string | null;
  paidAt: string | null;
};

const getPeriodCutoffTs = (period: "last3" | "last6"): number => {
  const months = period === "last3" ? 3 : 6;
  const now = new Date();
  const cutoff = new Date(now.getFullYear(), now.getMonth() - months, 1);
  return cutoff.getFullYear() * 10000 + (cutoff.getMonth() + 1) * 100 + 1;
};

export const applyMobileFilters = (payments: TPayment[], query: TFilterQuery): TPayment[] => {
  let rows = payments;

  if (query.property) rows = rows.filter((r) => r.property.id === query.property);
  if (query.service) rows = rows.filter((r) => r.service.id === query.service);

  if (query.paidAt === "last3" || query.paidAt === "last6") {
    const cutoff = getPeriodCutoffTs(query.paidAt);
    rows = rows.filter((r) => r.sortTs >= cutoff);
  }

  return rows;
};
