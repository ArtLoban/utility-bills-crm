"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

import { requireMutableUser } from "@/lib/auth/guards";
import { db } from "@/lib/db/client";
import { serviceTypes } from "@/lib/db/schema/service-types";
import type { TService } from "@/lib/db/schema/services";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { ProviderId } from "@/lib/db/schema/providers";
import type { TServiceTypeId } from "@/lib/db/schema/service-types";
import { requirePropertyRole } from "@/lib/db/access/properties";
import { providerByIdForUser } from "@/lib/db/access/providers";
import { appError, err, ok } from "@/lib/errors";
import type { Result, TAppError } from "@/lib/errors";
import { insertServiceInternal } from "./lib";
import { insertContractInternal } from "@/features/contracts/lib";
import { insertTariffInternal } from "@/features/tariffs/lib";
import { insertMeterInternal } from "@/features/meters/lib";
import { createServiceWithSetupSchema } from "./schema";
import type { TCreateServiceWithSetupInput } from "./schema";

// Drizzle 0.45+ wraps pg errors in DrizzleQueryError — the original pg error lands in .cause.
// Check both the error itself (older Drizzle / raw pg) and its cause (newer Drizzle wrapper).
const hasPgCode = (error: unknown, code: string): boolean => {
  const check = (e: unknown): boolean =>
    typeof e === "object" && e !== null && "code" in e && (e as { code: unknown }).code === code;
  return check(error) || check((error as { cause?: unknown }).cause);
};

const isExclusionViolation = (error: unknown): boolean => hasPgCode(error, "23P01");
const isUniqueViolation = (error: unknown): boolean => hasPgCode(error, "23505");

// Validate that the tariff shape matches the service type's measurement type.
const validateTariffShape = (
  measurementType: string,
  rateT1: string | null | undefined,
  fixedAmount: string | null | undefined,
): string | null => {
  if (measurementType === "metered") {
    if (!rateT1) return "validation.tariff.meteredRequiresRates";
    if (fixedAmount) return "validation.tariff.meteredForbidsFixed";
  } else if (measurementType === "fixed") {
    if (!fixedAmount) return "validation.tariff.fixedRequiresAmount";
    if (rateT1) return "validation.tariff.fixedForbidsRates";
  }
  return null;
};

// Validate that the tariff's validity range falls within the parent contract's range.
const validateTemporalNesting = (
  tariffValidFrom: Date,
  tariffValidTo: Date | null | undefined,
  contractValidFrom: Date,
  contractValidTo: Date | null | undefined,
): string | null => {
  if (tariffValidFrom < contractValidFrom) {
    return "validation.tariff.beforeContractStart";
  }
  if (contractValidTo !== null && contractValidTo !== undefined) {
    if (tariffValidFrom >= contractValidTo) {
      return "validation.tariff.afterContractEnd";
    }
    if (tariffValidTo && tariffValidTo > contractValidTo) {
      return "validation.tariff.exceedsContractEnd";
    }
  }
  return null;
};

export const createServiceWithSetup = async (
  input: TCreateServiceWithSetupInput,
): Promise<Result<TService, TAppError>> => {
  const parsed = createServiceWithSetupSchema.safeParse(input);
  if (!parsed.success) {
    return err(appError.validation(parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const authGuard = await requireMutableUser();
  if (!authGuard.ok) return authGuard;
  const userId = authGuard.value;

  const propertyId = parsed.data.propertyId as PropertyId;
  const serviceTypeId = parsed.data.serviceTypeId as TServiceTypeId;
  const providerId = parsed.data.providerId as ProviderId;

  // Permission check up front — before the transaction opens.
  const roleGuard = await requirePropertyRole(userId, propertyId, "editor");
  if (!roleGuard.ok) return roleGuard;

  // Validate provider ownership — prevents cross-user contract creation.
  const providerGuard = await providerByIdForUser(userId, providerId);
  if (!providerGuard.ok) return providerGuard;

  // Fetch service type for tariff shape and zone compatibility validation.
  const stRows = await db
    .select({
      measurementType: serviceTypes.measurementType,
      supportsZones: serviceTypes.supportsZones,
    })
    .from(serviceTypes)
    .where(eq(serviceTypes.id, serviceTypeId))
    .limit(1);

  if (stRows.length === 0) return err(appError.notFound("serviceType", serviceTypeId));
  const serviceType = stRows[0]!;

  const rateT1 = parsed.data.rateT1 || null;
  const rateT2 = parsed.data.rateT2 || null;
  const rateT3 = parsed.data.rateT3 || null;
  const fixedAmount = parsed.data.fixedAmount || null;

  const shapeError = validateTariffShape(serviceType.measurementType, rateT1, fixedAmount);
  if (shapeError) return err(appError.validation(shapeError));

  const contractValidFrom = new Date(parsed.data.contractValidFrom);
  const tariffValidFrom = new Date(parsed.data.tariffValidFrom);

  const nestingError = validateTemporalNesting(tariffValidFrom, null, contractValidFrom, null);
  if (nestingError) return err(appError.validation(nestingError));

  if (parsed.data.meter) {
    if (!serviceType.supportsZones && parsed.data.meter.zoneCount > 1) {
      return err(appError.validation("This service type does not support multiple zones"));
    }
  }

  try {
    const service = await db.transaction(async (tx) => {
      const newService = await insertServiceInternal(tx, {
        propertyId,
        serviceTypeId,
        notes: parsed.data.serviceNotes || null,
      });

      const contract = await insertContractInternal(tx, {
        serviceId: newService.id,
        providerId,
        validFrom: contractValidFrom,
        notes: parsed.data.contractNotes || null,
      });

      await insertTariffInternal(tx, {
        contractId: contract.id,
        rateT1,
        rateT2,
        rateT3,
        fixedAmount,
        validFrom: tariffValidFrom,
        notes: parsed.data.tariffNotes || null,
      });

      if (parsed.data.meter) {
        const { zoneCount, serialNumber, installedAt, meterValidFrom, meterNotes } =
          parsed.data.meter;
        await insertMeterInternal(tx, {
          propertyId,
          serviceTypeId,
          serialNumber: serialNumber || null,
          zoneCount,
          installedAt: installedAt ? new Date(installedAt) : null,
          validFrom: new Date(meterValidFrom),
          notes: meterNotes || null,
        });
      }

      return newService;
    });

    revalidatePath(`/properties/${propertyId}`);
    return ok(service);
  } catch (error) {
    if (isExclusionViolation(error)) {
      return err(appError.validation("validation.overlap"));
    }
    if (isUniqueViolation(error)) {
      return err(appError.validation("A service of this type is already active for this property"));
    }
    throw error;
  }
};
