import { config } from "dotenv";

config({ path: ".env.local" });

import { and, eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "../schema";
import { users } from "../schema/auth";
import type { UserId } from "../schema/auth";
import { properties, propertyAccess, PROPERTY_ROLES } from "../schema/properties";
import type { PropertyId } from "../schema/properties";
import { providers } from "../schema/providers";
import type { ProviderId } from "../schema/providers";
import { services } from "../schema/services";
import type { TServiceId } from "../schema/services";
import { serviceTypes } from "../schema/service-types";
import type { TServiceTypeId } from "../schema/service-types";
import { contracts } from "../schema/contracts";
import type { TContractId } from "../schema/contracts";
import { tariffs } from "../schema/tariffs";
import { accountNumbers } from "../schema/account-numbers";
import { paymentDetails } from "../schema/payment-details";
import { meters } from "../schema/meters";
import type { MeterId } from "../schema/meters";
import { readings } from "../schema/readings";
import { bills } from "../schema/bills";
import { payments } from "../schema/payments";
import { DEMO_EMAIL, FAMILY_DEMO_EMAIL } from "@/lib/auth/constants";

// ---------------------------------------------------------------------------
// DB setup — module level so TTx can be derived via typeof db
// ---------------------------------------------------------------------------

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

// Derive transaction type from the already-typed db instance
type TTx = Parameters<typeof db.transaction>[0] extends (tx: infer T, ...args: unknown[]) => unknown
  ? T
  : never;

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------

const addMonths = (date: Date, n: number): Date => {
  const d = new Date(date);
  d.setUTCMonth(d.getUTCMonth() + n);
  return d;
};

const firstOfMonth = (date: Date): Date =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));

const lastOfMonth = (date: Date): Date =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0));

const reading28 = (date: Date): Date =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 28));

const pay5next = (date: Date): Date =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 5));

// date columns (bills.periodStart/periodEnd, payments.paidAt) require YYYY-MM-DD strings
const toDateStr = (date: Date): string => date.toISOString().slice(0, 10);

const round2 = (n: number): string => n.toFixed(2);
const round3 = (n: number): string => n.toFixed(3);

// ---------------------------------------------------------------------------
// Span definition
// ---------------------------------------------------------------------------

const now = new Date();
const CURRENT_MONTH = firstOfMonth(now);
const START_DATE = firstOfMonth(addMonths(CURRENT_MONTH, -24));
const CHANGE_DATE = firstOfMonth(addMonths(START_DATE, 12));
const MONTHS: Date[] = Array.from({ length: 24 }, (_, i) => addMonths(START_DATE, i));

// ---------------------------------------------------------------------------
// Seasonal model
// ---------------------------------------------------------------------------

const YOY_DRIFT = 0.04;

const monthIndex = (d: Date): number => d.getUTCMonth();

// consumption[i] = base × factor[monthIndex] × (1 + yoyDrift × year)
const genConsumption = (base: number, factors: readonly number[], monthDates: Date[]): number[] =>
  monthDates.map((d, i) => {
    const year = Math.floor(i / 12);
    return base * factors[monthIndex(d)]! * (1 + YOY_DRIFT * year);
  });

const ELEC_FACTOR = [1.1, 1.1, 1.0, 0.9, 0.85, 0.8, 0.8, 0.85, 0.9, 1.0, 1.1, 1.15] as const;
const GAS_HOUSE_FACTOR = [2.8, 2.5, 2.0, 1.2, 0.3, 0.1, 0.1, 0.1, 0.5, 1.3, 2.3, 2.8] as const;
const GAS_APT_FACTOR = [1.1, 1.1, 1.0, 1.0, 0.95, 0.9, 0.9, 0.95, 1.0, 1.0, 1.1, 1.1] as const;
const WATER_FACTOR = [0.9, 0.9, 1.0, 1.0, 1.1, 1.15, 1.15, 1.1, 1.0, 0.95, 0.9, 0.9] as const;
const COTTAGE_ELEC_FACTOR = [
  0.05, 0.05, 0.1, 0.5, 0.9, 1.0, 1.0, 0.9, 0.6, 0.2, 0.05, 0.05,
] as const;

const isHeatingSeason = (d: Date): boolean => {
  const m = monthIndex(d);
  return m >= 9 || m <= 2;
};

// ---------------------------------------------------------------------------
// Transaction-scoped helpers
// ---------------------------------------------------------------------------

const svcInsert = async (
  tx: TTx,
  propertyId: PropertyId,
  serviceTypeId: TServiceTypeId,
): Promise<TServiceId> => {
  const [row] = await tx
    .insert(services)
    .values({ propertyId, serviceTypeId })
    .returning({ id: services.id });
  if (!row) throw new Error("svcInsert: no row returned");
  return row.id;
};

const meterInsert = async (
  tx: TTx,
  propertyId: PropertyId,
  serviceTypeId: TServiceTypeId,
  zoneCount: 1 | 2,
  validFrom: Date,
): Promise<MeterId> => {
  const [row] = await tx
    .insert(meters)
    .values({ propertyId, serviceTypeId, zoneCount, validFrom })
    .returning({ id: meters.id });
  if (!row) throw new Error("meterInsert: no row returned");
  return row.id;
};

const contractInsert = async (
  tx: TTx,
  serviceId: TServiceId,
  providerId: ProviderId,
  validFrom: Date,
  validTo: Date | null,
): Promise<TContractId> => {
  const [row] = await tx
    .insert(contracts)
    .values({ serviceId, providerId, validFrom, validTo })
    .returning({ id: contracts.id });
  if (!row) throw new Error("contractInsert: no row returned");
  return row.id;
};

type TTariffValues =
  | { rateT1: string; rateT2?: string; fixedAmount?: never }
  | { fixedAmount: string; rateT1?: never; rateT2?: never };

const tariffInsert = async (
  tx: TTx,
  contractId: TContractId,
  values: TTariffValues,
  validFrom: Date,
  validTo: Date | null,
): Promise<void> => {
  await tx.insert(tariffs).values({ contractId, ...values, validFrom, validTo });
};

const acctInsert = async (
  tx: TTx,
  contractId: TContractId,
  value: string,
  validFrom: Date,
  validTo: Date | null,
): Promise<void> => {
  await tx.insert(accountNumbers).values({ contractId, value, validFrom, validTo });
};

const pdInsert = async (
  tx: TTx,
  contractId: TContractId,
  details: string,
  validFrom: Date,
  validTo: Date | null,
): Promise<void> => {
  await tx.insert(paymentDetails).values({ contractId, details, validFrom, validTo });
};

const billInsert = async (
  tx: TTx,
  serviceId: TServiceId,
  month: Date,
  amount: string,
  createdBy: UserId,
): Promise<void> => {
  const periodStart = toDateStr(firstOfMonth(month));
  const periodEnd = toDateStr(lastOfMonth(month));
  await tx.insert(bills).values({
    serviceId,
    periodStart,
    periodEnd,
    periodMonth: periodStart,
    amount,
    createdBy,
  });
};

const paymentInsert = async (
  tx: TTx,
  serviceId: TServiceId,
  paidAt: Date,
  amount: string,
  createdBy: UserId,
): Promise<void> => {
  await tx.insert(payments).values({ serviceId, paidAt: toDateStr(paidAt), amount, createdBy });
};

type TSeedMeteredOpts = {
  tx: TTx;
  serviceId: TServiceId;
  meterId: MeterId;
  base: number;
  factors: readonly number[];
  startCum: number;
  rateFixed: number;
  primaryId: UserId;
};

const seedMetered = async ({
  tx,
  serviceId,
  meterId,
  base,
  factors,
  startCum,
  rateFixed,
  primaryId,
}: TSeedMeteredOpts): Promise<void> => {
  const deltas = genConsumption(base, factors, MONTHS);
  let cum = startCum;
  for (let i = 0; i < 24; i++) {
    const month = MONTHS[i]!;
    cum += deltas[i]!;
    await tx.insert(readings).values({
      meterId,
      readAt: reading28(month),
      valueT1: round3(cum),
      createdBy: primaryId,
    });
    const amount = round2(deltas[i]! * rateFixed);
    await billInsert(tx, serviceId, month, amount, primaryId);
    await paymentInsert(tx, serviceId, pay5next(month), amount, primaryId);
  }
};

// ---------------------------------------------------------------------------
// Main seed
// ---------------------------------------------------------------------------

const main = async (): Promise<void> => {
  try {
    await db.transaction(async (tx) => {
      // -----------------------------------------------------------------------
      // Wipe: delete all data owned by isDemo users
      // -----------------------------------------------------------------------
      const demoUserRows = await tx
        .select({ id: users.id })
        .from(users)
        .where(eq(users.isDemo, true));

      const demoUserIds = demoUserRows.map((r) => r.id);

      if (demoUserIds.length > 0) {
        const demoPropRows = await tx
          .select({ id: propertyAccess.propertyId })
          .from(propertyAccess)
          .where(
            and(
              inArray(propertyAccess.userId, demoUserIds),
              eq(propertyAccess.propertyRole, PROPERTY_ROLES.OWNER),
            ),
          );

        const demoPropIds = demoPropRows.map((r) => r.id);

        if (demoPropIds.length > 0) {
          // FK cascade removes all children: services, contracts, tariffs,
          // account_numbers, payment_details, meters, readings, bills, payments, property_access
          await tx.delete(properties).where(inArray(properties.id, demoPropIds));
        }

        await tx.delete(providers).where(inArray(providers.ownerId, demoUserIds));
      }

      console.log("Wipe complete.");

      // -----------------------------------------------------------------------
      // Upsert demo users
      // -----------------------------------------------------------------------
      const [primaryUser] = await tx
        .insert(users)
        .values({ name: "Олексій Коваленко", email: DEMO_EMAIL, isDemo: true })
        .onConflictDoUpdate({
          target: users.email,
          set: { isDemo: true, name: "Олексій Коваленко" },
        })
        .returning();

      const [familyUser] = await tx
        .insert(users)
        .values({ name: "Марія Коваленко", email: FAMILY_DEMO_EMAIL, isDemo: true })
        .onConflictDoUpdate({
          target: users.email,
          set: { isDemo: true, name: "Марія Коваленко" },
        })
        .returning();

      if (!primaryUser || !familyUser) {
        throw new Error("Failed to upsert demo users");
      }

      const primaryId = primaryUser.id;
      console.log(`Demo users ready: ${primaryUser.email}, ${familyUser.email}`);

      // -----------------------------------------------------------------------
      // Resolve service type IDs
      // -----------------------------------------------------------------------
      const serviceTypeRows = await tx.select().from(serviceTypes);
      const stMap = new Map(serviceTypeRows.map((s) => [s.code, s]));

      const st = (code: string) => {
        const row = stMap.get(code);
        if (!row) throw new Error(`ServiceType not found: ${code}`);
        return row;
      };

      // -----------------------------------------------------------------------
      // Providers
      // -----------------------------------------------------------------------
      const insertedProviders = await tx
        .insert(providers)
        .values([
          { name: "YASNO", ownerId: primaryId },
          { name: "Нафтогаз України", ownerId: primaryId },
          { name: "Київводоканал", ownerId: primaryId },
          { name: "Київтеплоенерго", ownerId: primaryId },
          { name: 'ОСББ "Хрещатик"', ownerId: primaryId },
          { name: "ГРМ-Сервіс", ownerId: primaryId },
          { name: 'ТОВ "Чисте місто"', ownerId: primaryId },
          { name: "Lanet", ownerId: primaryId },
          { name: "Kyivstar Home", ownerId: primaryId },
        ])
        .returning({ id: providers.id, name: providers.name });

      const providerMap = new Map(insertedProviders.map((p) => [p.name, p.id]));
      const pId = (name: string): ProviderId => {
        const id = providerMap.get(name);
        if (!id) throw new Error(`Provider not found: ${name}`);
        return id;
      };

      console.log("Providers created.");

      // -----------------------------------------------------------------------
      // Property: Квартира
      // -----------------------------------------------------------------------
      const [aptProp] = await tx
        .insert(properties)
        .values({
          name: "Квартира на Хрещатику",
          type: "apartment",
          address: "вул. Хрещатик, 22, кв. 5, Київ",
        })
        .returning({ id: properties.id });

      if (!aptProp) throw new Error("Failed to insert apartment");

      await tx.insert(propertyAccess).values({
        propertyId: aptProp.id,
        userId: primaryId,
        propertyRole: PROPERTY_ROLES.OWNER,
        grantedBy: primaryId,
      });

      await tx.insert(propertyAccess).values({
        propertyId: aptProp.id,
        userId: familyUser.id,
        propertyRole: PROPERTY_ROLES.EDITOR,
        grantedBy: primaryId,
      });

      const aptElecSvc = await svcInsert(tx, aptProp.id, st("electricity").id);
      const aptColdSvc = await svcInsert(tx, aptProp.id, st("cold_water").id);
      const aptHotSvc = await svcInsert(tx, aptProp.id, st("hot_water").id);
      const aptGasSvc = await svcInsert(tx, aptProp.id, st("gas").id);
      const aptHeatSvc = await svcInsert(tx, aptProp.id, st("heating").id);
      const aptMaintSvc = await svcInsert(tx, aptProp.id, st("building_maintenance").id);
      const aptNetSvc = await svcInsert(tx, aptProp.id, st("internet").id);

      const aptElecMeter = await meterInsert(tx, aptProp.id, st("electricity").id, 2, START_DATE);
      const aptColdMeter = await meterInsert(tx, aptProp.id, st("cold_water").id, 1, START_DATE);
      const aptHotMeter = await meterInsert(tx, aptProp.id, st("hot_water").id, 1, START_DATE);
      const aptGasMeter = await meterInsert(tx, aptProp.id, st("gas").id, 1, START_DATE);

      // Apartment electricity: 1 contract, 2 tariff records
      const aptElecC = await contractInsert(tx, aptElecSvc, pId("YASNO"), START_DATE, null);
      await tariffInsert(tx, aptElecC, { rateT1: "4.32", rateT2: "2.16" }, START_DATE, CHANGE_DATE);
      await tariffInsert(tx, aptElecC, { rateT1: "4.68", rateT2: "2.34" }, CHANGE_DATE, null);
      await acctInsert(tx, aptElecC, "560-0001-2024", START_DATE, null);
      await pdInsert(
        tx,
        aptElecC,
        "IBAN UA12 3006 6999 0001 0000 0123 4567 — YASNO",
        START_DATE,
        null,
      );

      const aptColdC = await contractInsert(tx, aptColdSvc, pId("Київводоканал"), START_DATE, null);
      await tariffInsert(tx, aptColdC, { rateT1: "16.00" }, START_DATE, null);
      await acctInsert(tx, aptColdC, "KVK-2024-0045", START_DATE, null);
      await pdInsert(
        tx,
        aptColdC,
        "IBAN UA00 3220 0150 0000 0260 0000 1234 — Київводоканал",
        START_DATE,
        null,
      );

      const aptHotC = await contractInsert(tx, aptHotSvc, pId("Київводоканал"), START_DATE, null);
      await tariffInsert(tx, aptHotC, { rateT1: "95.00" }, START_DATE, null);
      await acctInsert(tx, aptHotC, "KVK-2024-0046", START_DATE, null);
      await pdInsert(
        tx,
        aptHotC,
        "IBAN UA00 3220 0150 0000 0260 0000 1235 — Київводоканал",
        START_DATE,
        null,
      );

      const aptGasC = await contractInsert(
        tx,
        aptGasSvc,
        pId("Нафтогаз України"),
        START_DATE,
        null,
      );
      await tariffInsert(tx, aptGasC, { rateT1: "8.00" }, START_DATE, null);
      await acctInsert(tx, aptGasC, "NFT-APT-0007", START_DATE, null);
      await pdInsert(
        tx,
        aptGasC,
        "IBAN UA80 0021 3001 0460 0000 3000 0001 — Нафтогаз",
        START_DATE,
        null,
      );

      const aptHeatC = await contractInsert(
        tx,
        aptHeatSvc,
        pId("Київтеплоенерго"),
        START_DATE,
        null,
      );
      await tariffInsert(tx, aptHeatC, { fixedAmount: "2200.00" }, START_DATE, null);
      await acctInsert(tx, aptHeatC, "KTE-2024-0099", START_DATE, null);
      await pdInsert(
        tx,
        aptHeatC,
        "IBAN UA11 3253 0000 0002 6007 3000 0010 — Київтеплоенерго",
        START_DATE,
        null,
      );

      const aptMaintC = await contractInsert(
        tx,
        aptMaintSvc,
        pId('ОСББ "Хрещатик"'),
        START_DATE,
        null,
      );
      await tariffInsert(tx, aptMaintC, { fixedAmount: "750.00" }, START_DATE, null);
      await acctInsert(tx, aptMaintC, "OSBB-0022", START_DATE, null);
      await pdInsert(
        tx,
        aptMaintC,
        "ФОП Ковальчук — IBAN UA55 3003 5000 0002 0006 0010 1234",
        START_DATE,
        null,
      );

      // Apartment internet: provider change = 2 contracts
      const aptNetCA = await contractInsert(tx, aptNetSvc, pId("Lanet"), START_DATE, CHANGE_DATE);
      await tariffInsert(tx, aptNetCA, { fixedAmount: "299.00" }, START_DATE, CHANGE_DATE);
      await acctInsert(tx, aptNetCA, "LN-2024-78301", START_DATE, CHANGE_DATE);
      await pdInsert(tx, aptNetCA, "lk.lanet.ua — рахунок LN-2024-78301", START_DATE, CHANGE_DATE);

      const aptNetCB = await contractInsert(tx, aptNetSvc, pId("Kyivstar Home"), CHANGE_DATE, null);
      await tariffInsert(tx, aptNetCB, { fixedAmount: "349.00" }, CHANGE_DATE, null);
      await acctInsert(tx, aptNetCB, "KS-HOME-44129", CHANGE_DATE, null);
      await pdInsert(tx, aptNetCB, "kyivstar.ua — договір KS-HOME-44129", CHANGE_DATE, null);

      console.log("Apartment structure done.");

      // -----------------------------------------------------------------------
      // Property: Будинок
      // -----------------------------------------------------------------------
      const [houseProp] = await tx
        .insert(properties)
        .values({
          name: "Заміський будинок",
          type: "house",
          address: "с. Петрівське, вул. Садова, 14",
        })
        .returning({ id: properties.id });

      if (!houseProp) throw new Error("Failed to insert house");

      await tx.insert(propertyAccess).values({
        propertyId: houseProp.id,
        userId: primaryId,
        propertyRole: PROPERTY_ROLES.OWNER,
        grantedBy: primaryId,
      });

      const houseElecSvc = await svcInsert(tx, houseProp.id, st("electricity").id);
      const houseGasSvc = await svcInsert(tx, houseProp.id, st("gas").id);
      const houseColdSvc = await svcInsert(tx, houseProp.id, st("cold_water").id);
      const houseGarbSvc = await svcInsert(tx, houseProp.id, st("garbage_collection").id);
      const houseGasDelSvc = await svcInsert(tx, houseProp.id, st("gas_delivery").id);

      const houseElecMeter = await meterInsert(
        tx,
        houseProp.id,
        st("electricity").id,
        1,
        START_DATE,
      );
      const houseGasMeter = await meterInsert(tx, houseProp.id, st("gas").id, 1, START_DATE);
      const houseColdMeter = await meterInsert(
        tx,
        houseProp.id,
        st("cold_water").id,
        1,
        START_DATE,
      );

      const houseElecC = await contractInsert(tx, houseElecSvc, pId("YASNO"), START_DATE, null);
      await tariffInsert(tx, houseElecC, { rateT1: "4.32" }, START_DATE, null);
      await acctInsert(tx, houseElecC, "560-0002-2024", START_DATE, null);
      await pdInsert(
        tx,
        houseElecC,
        "IBAN UA12 3006 6999 0001 0000 0123 9999 — YASNO",
        START_DATE,
        null,
      );

      // House gas: tariff change at CHANGE_DATE
      const houseGasC = await contractInsert(
        tx,
        houseGasSvc,
        pId("Нафтогаз України"),
        START_DATE,
        null,
      );
      await tariffInsert(tx, houseGasC, { rateT1: "7.96" }, START_DATE, CHANGE_DATE);
      await tariffInsert(tx, houseGasC, { rateT1: "8.56" }, CHANGE_DATE, null);
      await acctInsert(tx, houseGasC, "NFT-HSE-0012", START_DATE, null);
      await pdInsert(
        tx,
        houseGasC,
        "IBAN UA80 0021 3001 0460 0000 3000 0002 — Нафтогаз",
        START_DATE,
        null,
      );

      const houseColdC = await contractInsert(
        tx,
        houseColdSvc,
        pId("Київводоканал"),
        START_DATE,
        null,
      );
      await tariffInsert(tx, houseColdC, { rateT1: "16.00" }, START_DATE, null);
      await acctInsert(tx, houseColdC, "KVK-2024-0077", START_DATE, null);
      await pdInsert(
        tx,
        houseColdC,
        "IBAN UA00 3220 0150 0000 0260 0000 7700 — Київводоканал",
        START_DATE,
        null,
      );

      const houseGarbC = await contractInsert(
        tx,
        houseGarbSvc,
        pId('ТОВ "Чисте місто"'),
        START_DATE,
        null,
      );
      await tariffInsert(tx, houseGarbC, { fixedAmount: "145.00" }, START_DATE, null);
      await acctInsert(tx, houseGarbC, "CM-2024-0331", START_DATE, null);
      await pdInsert(tx, houseGarbC, "Рахунок CM-2024-0331 — ТОВ Чисте місто", START_DATE, null);

      const houseGasDelC = await contractInsert(
        tx,
        houseGasDelSvc,
        pId("ГРМ-Сервіс"),
        START_DATE,
        null,
      );
      await tariffInsert(tx, houseGasDelC, { fixedAmount: "190.00" }, START_DATE, null);
      await acctInsert(tx, houseGasDelC, "GRM-2024-0055", START_DATE, null);
      await pdInsert(tx, houseGasDelC, "ГРМ-Сервіс — рахунок GRM-2024-0055", START_DATE, null);

      console.log("House structure done.");

      // -----------------------------------------------------------------------
      // Property: Дача
      // -----------------------------------------------------------------------
      const [cottageProp] = await tx
        .insert(properties)
        .values({ name: "Дача", type: "cottage", address: "Київська обл., Бориспільський р-н" })
        .returning({ id: properties.id });

      if (!cottageProp) throw new Error("Failed to insert cottage");

      await tx.insert(propertyAccess).values({
        propertyId: cottageProp.id,
        userId: primaryId,
        propertyRole: PROPERTY_ROLES.OWNER,
        grantedBy: primaryId,
      });

      const cottageElecSvc = await svcInsert(tx, cottageProp.id, st("electricity").id);
      const cottageElecMeter = await meterInsert(
        tx,
        cottageProp.id,
        st("electricity").id,
        1,
        START_DATE,
      );

      const cottageElecC = await contractInsert(tx, cottageElecSvc, pId("YASNO"), START_DATE, null);
      await tariffInsert(tx, cottageElecC, { rateT1: "4.32" }, START_DATE, null);
      await acctInsert(tx, cottageElecC, "560-0003-2024", START_DATE, null);
      await pdInsert(
        tx,
        cottageElecC,
        "IBAN UA12 3006 6999 0001 0000 0123 8888 — YASNO",
        START_DATE,
        null,
      );

      console.log("Cottage structure done.");

      // -----------------------------------------------------------------------
      // Readings / Bills / Payments
      // -----------------------------------------------------------------------

      // --- Apartment electricity (2-zone) — DEBT: no payments for last 2 months ---
      {
        const t1Deltas = genConsumption(130, ELEC_FACTOR, MONTHS);
        const t2Deltas = genConsumption(60, ELEC_FACTOR, MONTHS);
        let cumT1 = 1000;
        let cumT2 = 600;
        for (let i = 0; i < 24; i++) {
          const month = MONTHS[i]!;
          cumT1 += t1Deltas[i]!;
          cumT2 += t2Deltas[i]!;
          await tx.insert(readings).values({
            meterId: aptElecMeter,
            readAt: reading28(month),
            valueT1: round3(cumT1),
            valueT2: round3(cumT2),
            createdBy: primaryId,
          });
          const rate = month < CHANGE_DATE ? 4.32 : 4.68;
          const rateT2 = month < CHANGE_DATE ? 2.16 : 2.34;
          const amount = t1Deltas[i]! * rate + t2Deltas[i]! * rateT2;
          await billInsert(tx, aptElecSvc, month, round2(amount), primaryId);
          // Debt: months 22 and 23 have no payment
          if (i <= 21) {
            await paymentInsert(tx, aptElecSvc, pay5next(month), round2(amount), primaryId);
          }
        }
      }

      await seedMetered({
        tx,
        serviceId: aptColdSvc,
        meterId: aptColdMeter,
        base: 5,
        factors: WATER_FACTOR,
        startCum: 100,
        rateFixed: 16.0,
        primaryId,
      });
      await seedMetered({
        tx,
        serviceId: aptHotSvc,
        meterId: aptHotMeter,
        base: 2.5,
        factors: WATER_FACTOR,
        startCum: 50,
        rateFixed: 95.0,
        primaryId,
      });
      await seedMetered({
        tx,
        serviceId: aptGasSvc,
        meterId: aptGasMeter,
        base: 8,
        factors: GAS_APT_FACTOR,
        startCum: 200,
        rateFixed: 8.0,
        primaryId,
      });

      // Apartment heating (fixed, heating season only)
      for (let i = 0; i < 24; i++) {
        const month = MONTHS[i]!;
        if (!isHeatingSeason(month)) continue;
        await billInsert(tx, aptHeatSvc, month, "2200.00", primaryId);
        await paymentInsert(tx, aptHeatSvc, pay5next(month), "2200.00", primaryId);
      }

      // Apartment building maintenance (fixed, every month)
      for (let i = 0; i < 24; i++) {
        const month = MONTHS[i]!;
        await billInsert(tx, aptMaintSvc, month, "750.00", primaryId);
        await paymentInsert(tx, aptMaintSvc, pay5next(month), "750.00", primaryId);
      }

      // Apartment internet (fixed, two providers)
      for (let i = 0; i < 24; i++) {
        const month = MONTHS[i]!;
        const amount = month < CHANGE_DATE ? "299.00" : "349.00";
        await billInsert(tx, aptNetSvc, month, amount, primaryId);
        await paymentInsert(tx, aptNetSvc, pay5next(month), amount, primaryId);
      }

      console.log("Apartment readings/bills/payments done.");

      await seedMetered({
        tx,
        serviceId: houseElecSvc,
        meterId: houseElecMeter,
        base: 160,
        factors: ELEC_FACTOR,
        startCum: 2000,
        rateFixed: 4.32,
        primaryId,
      });

      // --- House gas (strong winter peak) — OVERPAYMENT ---
      {
        const deltas = genConsumption(55, GAS_HOUSE_FACTOR, MONTHS);
        let cum = 500;
        for (let i = 0; i < 24; i++) {
          const month = MONTHS[i]!;
          cum += deltas[i]!;
          await tx.insert(readings).values({
            meterId: houseGasMeter,
            readAt: reading28(month),
            valueT1: round3(cum),
            createdBy: primaryId,
          });
          const rate = month < CHANGE_DATE ? 7.96 : 8.56;
          const amount = round2(deltas[i]! * rate);
          await billInsert(tx, houseGasSvc, month, amount, primaryId);
          await paymentInsert(tx, houseGasSvc, pay5next(month), amount, primaryId);
          // Extra lump-sum advance at month 6 → overpayment
          if (i === 6) {
            await paymentInsert(tx, houseGasSvc, pay5next(month), "2500.00", primaryId);
          }
        }
      }

      await seedMetered({
        tx,
        serviceId: houseColdSvc,
        meterId: houseColdMeter,
        base: 4,
        factors: WATER_FACTOR,
        startCum: 80,
        rateFixed: 16.0,
        primaryId,
      });

      // House garbage (fixed)
      for (let i = 0; i < 24; i++) {
        const month = MONTHS[i]!;
        await billInsert(tx, houseGarbSvc, month, "145.00", primaryId);
        await paymentInsert(tx, houseGarbSvc, pay5next(month), "145.00", primaryId);
      }

      // House gas delivery (fixed)
      for (let i = 0; i < 24; i++) {
        const month = MONTHS[i]!;
        await billInsert(tx, houseGasDelSvc, month, "190.00", primaryId);
        await paymentInsert(tx, houseGasDelSvc, pay5next(month), "190.00", primaryId);
      }

      console.log("House readings/bills/payments done.");

      // --- Cottage electricity (seasonal) ---
      {
        const deltas = genConsumption(40, COTTAGE_ELEC_FACTOR, MONTHS);
        let cum = 300;
        for (let i = 0; i < 24; i++) {
          const month = MONTHS[i]!;
          const delta = deltas[i]!;
          cum += delta;
          await tx.insert(readings).values({
            meterId: cottageElecMeter,
            readAt: reading28(month),
            valueT1: round3(cum),
            createdBy: primaryId,
          });
          if (delta > 5) {
            const amount = round2(delta * 4.32);
            await billInsert(tx, cottageElecSvc, month, amount, primaryId);
            await paymentInsert(tx, cottageElecSvc, pay5next(month), amount, primaryId);
          }
        }
      }

      console.log("Cottage readings/bills/payments done.");
    });

    console.log("\nDemo seed complete.");
  } finally {
    await pool.end();
  }
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
