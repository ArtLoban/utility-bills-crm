import { and, asc, eq, isNull } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { contractsByServiceId } from "@/lib/db/access/contracts";
import type { TContractWithProvider } from "@/lib/db/access/contracts";
import { currentMeterForServiceType } from "@/lib/db/access/meters";
import type { TMeter } from "@/lib/db/schema/meters";
import { mostRecentReadingForMeter } from "@/lib/db/access/readings";
import type { TReading } from "@/lib/db/schema/readings";
import { serviceByIdForUser } from "@/lib/db/access/services";
import type { TServiceDetail } from "@/lib/db/access/services";
import { providersByUserId } from "@/lib/db/access/providers";
import type { TProvider } from "@/lib/db/schema/providers";
import { contracts } from "@/lib/db/schema/contracts";
import type { TContractId } from "@/lib/db/schema/contracts";
import { tariffs } from "@/lib/db/schema/tariffs";
import type { TTariff } from "@/lib/db/schema/tariffs";
import { accountNumbers } from "@/lib/db/schema/account-numbers";
import type { TAccountNumber } from "@/lib/db/schema/account-numbers";
import { paymentDetails } from "@/lib/db/schema/payment-details";
import type { TPaymentDetails } from "@/lib/db/schema/payment-details";
import type { UserId } from "@/lib/db/schema/auth";
import type { TServiceId } from "@/lib/db/schema/services";
import { NotFoundError, err, ok } from "@/lib/errors";
import type { Result } from "@/lib/errors";

export type { TServiceDetail };

// All temporal attribute history for all contracts of a service, keyed by contractId.
// Used by ContractHistoryDrawer to render nested temporal attributes inside each contract era.
export type TAttributeHistory = {
  tariffsByContract: Record<TContractId, TTariff[]>;
  accountNumbersByContract: Record<TContractId, TAccountNumber[]>;
  paymentDetailsByContract: Record<TContractId, TPaymentDetails[]>;
};

export const getServiceDetail = async (
  serviceId: TServiceId,
): Promise<Result<TServiceDetail, NotFoundError>> => {
  const session = await auth();
  if (!session?.user.id) return err(new NotFoundError("service", serviceId));

  const userId = session.user.id as UserId;
  return serviceByIdForUser(userId, serviceId);
};

export const getContractHistory = async (
  serviceId: TServiceId,
): Promise<Result<TContractWithProvider[], NotFoundError>> => {
  const session = await auth();
  if (!session?.user.id) return err(new NotFoundError("service", serviceId));

  const userId = session.user.id as UserId;
  return contractsByServiceId(userId, serviceId);
};

export const getAttributeHistory = async (
  serviceId: TServiceId,
): Promise<Result<TAttributeHistory, NotFoundError>> => {
  const session = await auth();
  if (!session?.user.id) return err(new NotFoundError("service", serviceId));

  const userId = session.user.id as UserId;

  // Access check: routes through serviceByIdForUser → propertyByIdForUser.
  const serviceAccess = await serviceByIdForUser(userId, serviceId);
  if (!serviceAccess.ok) return serviceAccess;

  // Fetch all non-deleted tariffs/account_numbers/payment_details for all non-deleted
  // contracts of this service in 3 parallel queries, then group by contractId.
  const [tariffRows, accountNumberRows, paymentDetailRows] = await Promise.all([
    db
      .select({ tariff: tariffs })
      .from(tariffs)
      .innerJoin(contracts, eq(tariffs.contractId, contracts.id))
      .where(
        and(
          eq(contracts.serviceId, serviceId),
          isNull(contracts.deletedAt),
          isNull(tariffs.deletedAt),
        ),
      )
      .orderBy(asc(tariffs.contractId), asc(tariffs.validFrom)),

    db
      .select({ accountNumber: accountNumbers })
      .from(accountNumbers)
      .innerJoin(contracts, eq(accountNumbers.contractId, contracts.id))
      .where(
        and(
          eq(contracts.serviceId, serviceId),
          isNull(contracts.deletedAt),
          isNull(accountNumbers.deletedAt),
        ),
      )
      .orderBy(asc(accountNumbers.contractId), asc(accountNumbers.validFrom)),

    db
      .select({ paymentDetail: paymentDetails })
      .from(paymentDetails)
      .innerJoin(contracts, eq(paymentDetails.contractId, contracts.id))
      .where(
        and(
          eq(contracts.serviceId, serviceId),
          isNull(contracts.deletedAt),
          isNull(paymentDetails.deletedAt),
        ),
      )
      .orderBy(asc(paymentDetails.contractId), asc(paymentDetails.validFrom)),
  ]);

  const tariffsByContract: Record<TContractId, TTariff[]> = {};
  for (const { tariff } of tariffRows) {
    const key = tariff.contractId;
    if (!tariffsByContract[key]) tariffsByContract[key] = [];
    tariffsByContract[key].push(tariff);
  }

  const accountNumbersByContract: Record<TContractId, TAccountNumber[]> = {};
  for (const { accountNumber } of accountNumberRows) {
    const key = accountNumber.contractId;
    if (!accountNumbersByContract[key]) accountNumbersByContract[key] = [];
    accountNumbersByContract[key].push(accountNumber);
  }

  const paymentDetailsByContract: Record<TContractId, TPaymentDetails[]> = {};
  for (const { paymentDetail } of paymentDetailRows) {
    const key = paymentDetail.contractId;
    if (!paymentDetailsByContract[key]) paymentDetailsByContract[key] = [];
    paymentDetailsByContract[key].push(paymentDetail);
  }

  return ok({ tariffsByContract, accountNumbersByContract, paymentDetailsByContract });
};

export const getProvidersForContractPage = async (): Promise<TProvider[]> => {
  const session = await auth();
  if (!session?.user.id) return [];

  const userId = session.user.id as UserId;
  return providersByUserId(userId);
};

// Returns the active meter for the service's property + service type pair.
// Performs its own access check so it can be called in parallel with getServiceDetail.
// Returns null when no active meter exists (not an error condition).
export const getCurrentMeterForService = async (serviceId: TServiceId): Promise<TMeter | null> => {
  const session = await auth();
  if (!session?.user.id) return null;

  const userId = session.user.id as UserId;
  const serviceResult = await serviceByIdForUser(userId, serviceId);
  if (!serviceResult.ok) return null;

  const { service, serviceType } = serviceResult.value;
  const meterResult = await currentMeterForServiceType(userId, service.propertyId, serviceType.id);

  return meterResult.ok ? meterResult.value : null;
};

export const getLastReadingForMeter = async (meter: TMeter): Promise<TReading | null> => {
  const session = await auth();
  if (!session?.user.id) return null;

  const userId = session.user.id as UserId;
  const result = await mostRecentReadingForMeter(userId, meter.id);
  return result.ok ? result.value : null;
};
