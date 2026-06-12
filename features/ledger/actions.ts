"use server";

import { requireUser } from "@/lib/auth/guards";
import { serviceByIdForUser } from "@/lib/db/access/services";
import type { TServiceId } from "@/lib/db/schema/services";
import type { TBalance, TExpectedAmount } from "./types";
import { computeExpectedFixed, computeExpectedMetered } from "./core";
import { balanceForService, readingsForPeriod, tariffForServicePeriod } from "./query";

// month = "YYYY-MM" → last day of that month as "YYYY-MM-DD"
const lastDayOfMonth = (month: string): string => {
  const [y, m] = month.split("-");
  // new Date(year, monthIndex, 0): day 0 of month m (1-based) = last day of month m-1... no:
  // new Date(year, m, 0) where m is the 1-based month number:
  //   m=4 (April) → new Date(year, 4, 0) = last day of April (day 0 of May in 0-based index = April 30)
  const d = new Date(parseInt(y!), parseInt(m!), 0);
  return `${y}-${m}-${String(d.getDate()).padStart(2, "0")}`;
};

// Returns the current balance for a service. Called from the Record Payment modal.
export const getServiceBalanceAction = async (serviceId: string): Promise<TBalance | null> => {
  const userId = await requireUser();
  return balanceForService(userId, serviceId as TServiceId);
};

// Returns the expected bill amount for a service + month combination.
// Called from the Add Bill modal to show a "Expected: X UAH" hint.
export const getExpectedAmountHintAction = async (
  serviceId: string,
  month: string, // "YYYY-MM"
): Promise<TExpectedAmount | null> => {
  const userId = await requireUser();
  const serviceResult = await serviceByIdForUser(userId, serviceId as TServiceId);
  if (!serviceResult.ok) return null;

  const { serviceType } = serviceResult.value;
  const periodStart = `${month}-01`;
  const periodEnd = lastDayOfMonth(month);

  const tariff = await tariffForServicePeriod(serviceId as TServiceId, periodStart);
  if (!tariff) return { kind: "cannot-compute", reason: "no-tariff" };

  if (serviceType.measurementType === "fixed") {
    return computeExpectedFixed(tariff);
  }

  const readingPair = await readingsForPeriod(serviceId as TServiceId, periodEnd);
  return computeExpectedMetered(tariff, readingPair);
};
