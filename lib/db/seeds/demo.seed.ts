import { config } from "dotenv";

config({ path: ".env.local" });

import { and, eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "../schema";
import { users } from "../schema/auth";
import type { UserId } from "../schema/auth";
import { properties, propertyAccess, PROPERTY_ROLES, PROPERTY_TYPES } from "../schema/properties";
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
import { meterServices } from "../schema/meter-services";
import { readings } from "../schema/readings";
import { bills } from "../schema/bills";
import { payments } from "../schema/payments";
import { DEMO_EMAIL, FAMILY_DEMO_EMAIL } from "@/lib/auth/constants";
import { toIsoDate } from "@/lib/format/date";
import {
  SEED_SERIES,
  SEED_TARIFF_RATES,
  HEATING_RATE_PER_GCAL,
  HEATING_NOMINAL_AMOUNT,
  COTTAGE_BILL_THRESHOLD,
  monthlyConsumption,
  heatingGcal,
  type TSeedSeries,
} from "./generation";

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

const round2 = (n: number): string => n.toFixed(2);
const round3 = (n: number): string => n.toFixed(3);

// ---------------------------------------------------------------------------
// Span definition
// ---------------------------------------------------------------------------

const now = new Date();
const CURRENT_MONTH = firstOfMonth(now);
const START_DATE = firstOfMonth(addMonths(CURRENT_MONTH, -24));
// The internet provider switch (Lanet → Kyivstar) happens mid-window. This is the only genuine
// mid-window step that remains; the fake mass tariff change on this date was removed.
const INTERNET_SWITCH_DATE = firstOfMonth(addMonths(START_DATE, 12));
const MONTHS: Date[] = Array.from({ length: 24 }, (_, i) => addMonths(START_DATE, i));

// The seasonal/consumption generation core lives in ./generation (pure, calendar-keyed,
// deterministic). This file only orchestrates structure + insertion.

// ---------------------------------------------------------------------------
// Slice-3 event calendar — the sparse, hand-curated events that make the account read as
// lived-in. Positions are window-relative (M = MONTHS[23], the last month); the regulated
// tariff steps use absolute calendar dates (real Kyiv history), clamped into the window below.
// ---------------------------------------------------------------------------

// 1. Apartment electricity — rolling debt: the two months after ELEC_PARTIAL_INDEX are unpaid,
// and ELEC_PARTIAL_INDEX itself is paid only in part.
const ELEC_PARTIAL_INDEX = 21;
const ELEC_PARTIAL_RATIO = 0.5;

// 2. Apartment heating — partial payment in a deep-winter peak, remainder caught up next month.
const HEAT_PARTIAL_INDEX = 18; // Jan in the current window
const HEAT_PARTIAL_RATIO = 0.55;

// 3. House gas — a single non-round advance in December that then draws down over Jan/Feb.
const GAS_ADVANCE_INDEX = 17; // Dec: pay the month in full + this lump
const GAS_ADVANCE_AMOUNT = "5280.00";
const GAS_ADVANCE_COVERED_INDEXES: ReadonlySet<number> = new Set([18, 19]); // Jan, Feb — no own payment

// 4. Late payments — paid in full, ~3 weeks late, spread across services and the window.
const LATE_PAY_DAY = 22; // day of the month AFTER the period (vs the usual 5th)
const INTERNET_LATE_INDEX = 5;
const COTTAGE_LATE_INDEX = 10;
const GARBAGE_LATE_INDEX = 14;
const GAS_DELIVERY_LATE_INDEX = 20;

// 5. Intercom — one lump every three months settles three monthly bills.
const INTERCOM_MONTHLY_RATE = 40;
const INTERCOM_QUARTER_MONTHS = 3;

// 6. Apartment kitchen cold-water meter replaced ~8 months before M; new meter opens next.
const KITCHEN_SWAP_INDEX = 16; // the new meter is active from this month onward
const KITCHEN_SWAP_DATE = MONTHS[KITCHEN_SWAP_INDEX]!;

// 7. House garbage — one provider switch mid-window (new contract, account, small rate rise).
const GARBAGE_SWITCH_INDEX = 12;
const GARBAGE_SWITCH_DATE = MONTHS[GARBAGE_SWITCH_INDEX]!;
const GARBAGE_RATE_BEFORE = "145.00";
const GARBAGE_RATE_AFTER = "160.00";

// 8. Off-cycle fixed-tariff steps, each on its own date (nothing choreographed to one date).
const GAS_DELIVERY_TARIFF_STEPS: TFixedStep[] = [
  { from: START_DATE, amount: "190.00" },
  { from: new Date(Date.UTC(2025, 0, 1)), amount: "205.00" }, // regulated annual step 01.01.2025
  { from: new Date(Date.UTC(2026, 0, 1)), amount: "220.00" }, // regulated annual step 01.01.2026
];
const MAINT_TARIFF_STEPS: TFixedStep[] = [
  { from: START_DATE, amount: "750.00" },
  { from: new Date(Date.UTC(2025, 8, 1)), amount: "795.00" }, // managing-company indexation 01.09.2025
];
const GARAGE_RENT_TARIFF_STEPS: TFixedStep[] = [
  { from: START_DATE, amount: "1800.00" },
  { from: new Date(Date.UTC(2026, 0, 1)), amount: "1900.00" }, // rent rise 01.01.2026
];

// A payment landing late — same period, roughly three weeks after the usual date.
const payLate = (month: Date): Date =>
  new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + 1, LATE_PAY_DAY));

// A piecewise-constant fixed tariff: the amount in force for a given bill month.
type TFixedStep = { from: Date; amount: string };
const fixedAmountForMonth = (steps: TFixedStep[], month: Date): string => {
  let amount = steps[0]!.amount;
  for (const step of steps) if (step.from <= month) amount = step.amount;
  return amount;
};

// ---------------------------------------------------------------------------
// Transaction-scoped helpers
// ---------------------------------------------------------------------------

const svcInsert = async (
  tx: TTx,
  propertyId: PropertyId,
  serviceTypeId: TServiceTypeId,
  // Custom label — mandatory for `other`-type services, omitted (→ NULL) otherwise.
  name?: string,
): Promise<TServiceId> => {
  const [row] = await tx
    .insert(services)
    .values({ propertyId, serviceTypeId, name })
    .returning({ id: services.id });
  if (!row) throw new Error("svcInsert: no row returned");
  return row.id;
};

const meterInsert = async (
  tx: TTx,
  propertyId: PropertyId,
  serviceId: TServiceId,
  serviceTypeId: TServiceTypeId,
  zoneCount: 1 | 2,
  validFrom: Date,
  // Set for a meter that was later replaced (closes its temporal interval + records removal).
  validTo: Date | null = null,
  removedAt: Date | null = null,
): Promise<MeterId> => {
  const [row] = await tx
    .insert(meters)
    .values({ propertyId, serviceTypeId, zoneCount, validFrom, validTo, removedAt })
    .returning({ id: meters.id });
  if (!row) throw new Error("meterInsert: no row returned");
  // Explicit meter↔service link (Slice B2): each seeded meter feeds its same-type service,
  // matching what the live backfill produced on the existing database.
  await tx.insert(meterServices).values({ meterId: row.id, serviceId });
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

// Insert a piecewise-constant fixed tariff history for one contract from a list of steps. Steps
// starting before the window are clamped to START_DATE and collapsed (the latest amount wins), so
// a shifted run date never produces an inverted [validFrom, validTo) interval.
const seedFixedTariffSteps = async (
  tx: TTx,
  contractId: TContractId,
  steps: TFixedStep[],
): Promise<void> => {
  const segments: TFixedStep[] = [];
  for (const step of steps) {
    const from = step.from < START_DATE ? START_DATE : step.from;
    const last = segments[segments.length - 1];
    if (last && from <= last.from) last.amount = step.amount;
    else segments.push({ from, amount: step.amount });
  }
  for (let i = 0; i < segments.length; i++) {
    const validTo = i < segments.length - 1 ? segments[i + 1]!.from : null;
    await tariffInsert(
      tx,
      contractId,
      { fixedAmount: segments[i]!.amount },
      segments[i]!.from,
      validTo,
    );
  }
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
  const periodStart = toIsoDate(firstOfMonth(month));
  const periodEnd = toIsoDate(lastOfMonth(month));
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
  await tx.insert(payments).values({ serviceId, paidAt: toIsoDate(paidAt), amount, createdBy });
};

type TSeedMeteredOpts = {
  tx: TTx;
  serviceId: TServiceId;
  meterId: MeterId;
  series: TSeedSeries;
  startCum: number;
  rate: number;
  primaryId: UserId;
};

const seedMetered = async ({
  tx,
  serviceId,
  meterId,
  series,
  startCum,
  rate,
  primaryId,
}: TSeedMeteredOpts): Promise<void> => {
  let cum = startCum;
  for (let i = 0; i < 24; i++) {
    const month = MONTHS[i]!;
    const delta = monthlyConsumption(series, month.getUTCFullYear(), month.getUTCMonth());
    cum += delta;
    await tx.insert(readings).values({
      meterId,
      readAt: reading28(month),
      valueT1: round3(cum),
      createdBy: primaryId,
    });
    const amount = round2(delta * rate);
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
        .values({ name: "Alexander Miller", email: DEMO_EMAIL, isDemo: true })
        .onConflictDoUpdate({
          target: users.email,
          set: { isDemo: true, name: "Alexander Miller" },
        })
        .returning();

      const [familyUser] = await tx
        .insert(users)
        .values({ name: "Anna Miller", email: FAMILY_DEMO_EMAIL, isDemo: true })
        .onConflictDoUpdate({
          target: users.email,
          set: { isDemo: true, name: "Anna Miller" },
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
          { name: "Naftogaz Ukraine", ownerId: primaryId },
          { name: "Kyivvodokanal", ownerId: primaryId },
          { name: "Kyivteploenergo", ownerId: primaryId },
          { name: "Khreshchatyk HOA", ownerId: primaryId },
          { name: "GRM-Service", ownerId: primaryId },
          { name: "Clean City LLC", ownerId: primaryId },
          { name: "Lanet", ownerId: primaryId },
          { name: "Kyivstar Home", ownerId: primaryId },
          { name: "Kyiv Intercom Service", ownerId: primaryId },
          { name: "Avtomobilist Garage Co-op", ownerId: primaryId },
          { name: "EcoWaste Kyiv", ownerId: primaryId },
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
      // Property: Apartment
      // -----------------------------------------------------------------------
      const [aptProp] = await tx
        .insert(properties)
        .values({
          name: "Apartment on Khreshchatyk",
          type: "apartment",
          address: "22 Khreshchatyk St, Apt 5, Kyiv",
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
      const aptIntercomSvc = await svcInsert(tx, aptProp.id, st("intercom").id);

      const aptElecMeter = await meterInsert(
        tx,
        aptProp.id,
        aptElecSvc,
        st("electricity").id,
        2,
        START_DATE,
      );
      // Two cold-water meters (kitchen + bathroom riser) both linked to the single cold_water
      // service — the Tranche B multi-meter showcase. Consumption aggregates over unique meters.
      // The kitchen riser is replaced mid-window: the original meter is closed at the swap date
      // (validTo + removedAt), a new meter takes over from the same date (see readings below).
      const aptColdMeterKitchenOld = await meterInsert(
        tx,
        aptProp.id,
        aptColdSvc,
        st("cold_water").id,
        1,
        START_DATE,
        KITCHEN_SWAP_DATE,
        KITCHEN_SWAP_DATE,
      );
      const aptColdMeterKitchenNew = await meterInsert(
        tx,
        aptProp.id,
        aptColdSvc,
        st("cold_water").id,
        1,
        KITCHEN_SWAP_DATE,
      );
      const aptColdMeterBath = await meterInsert(
        tx,
        aptProp.id,
        aptColdSvc,
        st("cold_water").id,
        1,
        START_DATE,
      );
      const aptHotMeter = await meterInsert(
        tx,
        aptProp.id,
        aptHotSvc,
        st("hot_water").id,
        1,
        START_DATE,
      );
      const aptGasMeter = await meterInsert(tx, aptProp.id, aptGasSvc, st("gas").id, 1, START_DATE);

      // Apartment electricity: 1 contract, 2 tariff records
      const aptElecC = await contractInsert(tx, aptElecSvc, pId("YASNO"), START_DATE, null);
      await tariffInsert(
        tx,
        aptElecC,
        {
          rateT1: String(SEED_TARIFF_RATES.ELECTRICITY_DAY),
          rateT2: String(SEED_TARIFF_RATES.ELECTRICITY_NIGHT),
        },
        START_DATE,
        null,
      );
      await acctInsert(tx, aptElecC, "560-0001-2024", START_DATE, null);
      await pdInsert(
        tx,
        aptElecC,
        "IBAN UA12 3006 6999 0001 0000 0123 4567 — YASNO",
        START_DATE,
        null,
      );

      const aptColdC = await contractInsert(tx, aptColdSvc, pId("Kyivvodokanal"), START_DATE, null);
      await tariffInsert(
        tx,
        aptColdC,
        { rateT1: String(SEED_TARIFF_RATES.COLD_WATER) },
        START_DATE,
        null,
      );
      await acctInsert(tx, aptColdC, "KVK-2024-0045", START_DATE, null);
      await pdInsert(
        tx,
        aptColdC,
        "IBAN UA00 3220 0150 0000 0260 0000 1234 — Kyivvodokanal",
        START_DATE,
        null,
      );

      const aptHotC = await contractInsert(tx, aptHotSvc, pId("Kyivvodokanal"), START_DATE, null);
      await tariffInsert(
        tx,
        aptHotC,
        { rateT1: String(SEED_TARIFF_RATES.HOT_WATER) },
        START_DATE,
        null,
      );
      await acctInsert(tx, aptHotC, "KVK-2024-0046", START_DATE, null);
      await pdInsert(
        tx,
        aptHotC,
        "IBAN UA00 3220 0150 0000 0260 0000 1235 — Kyivvodokanal",
        START_DATE,
        null,
      );

      const aptGasC = await contractInsert(
        tx,
        aptGasSvc,
        pId("Naftogaz Ukraine"),
        START_DATE,
        null,
      );
      await tariffInsert(
        tx,
        aptGasC,
        { rateT1: String(SEED_TARIFF_RATES.GAS_SUPPLY) },
        START_DATE,
        null,
      );
      await acctInsert(tx, aptGasC, "NFT-APT-0007", START_DATE, null);
      await pdInsert(
        tx,
        aptGasC,
        "IBAN UA80 0021 3001 0460 0000 3000 0001 — Naftogaz",
        START_DATE,
        null,
      );

      const aptHeatC = await contractInsert(
        tx,
        aptHeatSvc,
        pId("Kyivteploenergo"),
        START_DATE,
        null,
      );
      await tariffInsert(tx, aptHeatC, { fixedAmount: HEATING_NOMINAL_AMOUNT }, START_DATE, null);
      await acctInsert(tx, aptHeatC, "KTE-2024-0099", START_DATE, null);
      await pdInsert(
        tx,
        aptHeatC,
        "IBAN UA11 3253 0000 0002 6007 3000 0010 — Kyivteploenergo",
        START_DATE,
        null,
      );

      const aptMaintC = await contractInsert(
        tx,
        aptMaintSvc,
        pId("Khreshchatyk HOA"),
        START_DATE,
        null,
      );
      await seedFixedTariffSteps(tx, aptMaintC, MAINT_TARIFF_STEPS);
      await acctInsert(tx, aptMaintC, "OSBB-0022", START_DATE, null);
      await pdInsert(
        tx,
        aptMaintC,
        "Kovalchuk (sole proprietor) — IBAN UA55 3003 5000 0002 0006 0010 1234",
        START_DATE,
        null,
      );

      // Apartment internet: provider change = 2 contracts
      const aptNetCA = await contractInsert(
        tx,
        aptNetSvc,
        pId("Lanet"),
        START_DATE,
        INTERNET_SWITCH_DATE,
      );
      await tariffInsert(tx, aptNetCA, { fixedAmount: "299.00" }, START_DATE, INTERNET_SWITCH_DATE);
      await acctInsert(tx, aptNetCA, "LN-2024-78301", START_DATE, INTERNET_SWITCH_DATE);
      await pdInsert(
        tx,
        aptNetCA,
        "lk.lanet.ua — account LN-2024-78301",
        START_DATE,
        INTERNET_SWITCH_DATE,
      );

      const aptNetCB = await contractInsert(
        tx,
        aptNetSvc,
        pId("Kyivstar Home"),
        INTERNET_SWITCH_DATE,
        null,
      );
      await tariffInsert(tx, aptNetCB, { fixedAmount: "349.00" }, INTERNET_SWITCH_DATE, null);
      await acctInsert(tx, aptNetCB, "KS-HOME-44129", INTERNET_SWITCH_DATE, null);
      await pdInsert(
        tx,
        aptNetCB,
        "kyivstar.ua — contract KS-HOME-44129",
        INTERNET_SWITCH_DATE,
        null,
      );

      // Apartment intercom: fixed monthly, single flat tariff.
      const aptIntercomC = await contractInsert(
        tx,
        aptIntercomSvc,
        pId("Kyiv Intercom Service"),
        START_DATE,
        null,
      );
      await tariffInsert(tx, aptIntercomC, { fixedAmount: "40.00" }, START_DATE, null);
      await acctInsert(tx, aptIntercomC, "INT-22-5-0034", START_DATE, null);
      await pdInsert(
        tx,
        aptIntercomC,
        "Kyiv Intercom Service — account INT-22-5-0034",
        START_DATE,
        null,
      );

      console.log("Apartment structure done.");

      // -----------------------------------------------------------------------
      // Property: House
      // -----------------------------------------------------------------------
      const [houseProp] = await tx
        .insert(properties)
        .values({
          name: "Country house",
          type: "house",
          address: "14 Sadova St, Petrivske village",
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
        houseElecSvc,
        st("electricity").id,
        1,
        START_DATE,
      );
      const houseGasMeter = await meterInsert(
        tx,
        houseProp.id,
        houseGasSvc,
        st("gas").id,
        1,
        START_DATE,
      );
      const houseColdMeter = await meterInsert(
        tx,
        houseProp.id,
        houseColdSvc,
        st("cold_water").id,
        1,
        START_DATE,
      );

      const houseElecC = await contractInsert(tx, houseElecSvc, pId("YASNO"), START_DATE, null);
      await tariffInsert(
        tx,
        houseElecC,
        { rateT1: String(SEED_TARIFF_RATES.ELECTRICITY_DAY) },
        START_DATE,
        null,
      );
      await acctInsert(tx, houseElecC, "560-0002-2024", START_DATE, null);
      await pdInsert(
        tx,
        houseElecC,
        "IBAN UA12 3006 6999 0001 0000 0123 9999 — YASNO",
        START_DATE,
        null,
      );

      const houseGasC = await contractInsert(
        tx,
        houseGasSvc,
        pId("Naftogaz Ukraine"),
        START_DATE,
        null,
      );
      await tariffInsert(
        tx,
        houseGasC,
        { rateT1: String(SEED_TARIFF_RATES.GAS_SUPPLY) },
        START_DATE,
        null,
      );
      await acctInsert(tx, houseGasC, "NFT-HSE-0012", START_DATE, null);
      await pdInsert(
        tx,
        houseGasC,
        "IBAN UA80 0021 3001 0460 0000 3000 0002 — Naftogaz",
        START_DATE,
        null,
      );

      const houseColdC = await contractInsert(
        tx,
        houseColdSvc,
        pId("Kyivvodokanal"),
        START_DATE,
        null,
      );
      await tariffInsert(
        tx,
        houseColdC,
        { rateT1: String(SEED_TARIFF_RATES.COLD_WATER) },
        START_DATE,
        null,
      );
      await acctInsert(tx, houseColdC, "KVK-2024-0077", START_DATE, null);
      await pdInsert(
        tx,
        houseColdC,
        "IBAN UA00 3220 0150 0000 0260 0000 7700 — Kyivvodokanal",
        START_DATE,
        null,
      );

      // House garbage: one provider switch mid-window — old contract closed, new one opened.
      const houseGarbCA = await contractInsert(
        tx,
        houseGarbSvc,
        pId("Clean City LLC"),
        START_DATE,
        GARBAGE_SWITCH_DATE,
      );
      await tariffInsert(
        tx,
        houseGarbCA,
        { fixedAmount: GARBAGE_RATE_BEFORE },
        START_DATE,
        GARBAGE_SWITCH_DATE,
      );
      await acctInsert(tx, houseGarbCA, "CM-2024-0331", START_DATE, GARBAGE_SWITCH_DATE);
      await pdInsert(
        tx,
        houseGarbCA,
        "Invoice CM-2024-0331 — Clean City LLC",
        START_DATE,
        GARBAGE_SWITCH_DATE,
      );

      const houseGarbCB = await contractInsert(
        tx,
        houseGarbSvc,
        pId("EcoWaste Kyiv"),
        GARBAGE_SWITCH_DATE,
        null,
      );
      await tariffInsert(
        tx,
        houseGarbCB,
        { fixedAmount: GARBAGE_RATE_AFTER },
        GARBAGE_SWITCH_DATE,
        null,
      );
      await acctInsert(tx, houseGarbCB, "EWK-2025-0148", GARBAGE_SWITCH_DATE, null);
      await pdInsert(
        tx,
        houseGarbCB,
        "EcoWaste Kyiv — invoice EWK-2025-0148",
        GARBAGE_SWITCH_DATE,
        null,
      );

      const houseGasDelC = await contractInsert(
        tx,
        houseGasDelSvc,
        pId("GRM-Service"),
        START_DATE,
        null,
      );
      await seedFixedTariffSteps(tx, houseGasDelC, GAS_DELIVERY_TARIFF_STEPS);
      await acctInsert(tx, houseGasDelC, "GRM-2024-0055", START_DATE, null);
      await pdInsert(tx, houseGasDelC, "GRM-Service — invoice GRM-2024-0055", START_DATE, null);

      console.log("House structure done.");

      // -----------------------------------------------------------------------
      // Property: Cottage
      // -----------------------------------------------------------------------
      const [cottageProp] = await tx
        .insert(properties)
        .values({
          name: "Summer cottage",
          type: "cottage",
          address: "Boryspil district, Kyiv region",
        })
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
        cottageElecSvc,
        st("electricity").id,
        1,
        START_DATE,
      );

      const cottageElecC = await contractInsert(tx, cottageElecSvc, pId("YASNO"), START_DATE, null);
      await tariffInsert(
        tx,
        cottageElecC,
        { rateT1: String(SEED_TARIFF_RATES.ELECTRICITY_DAY) },
        START_DATE,
        null,
      );
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
        let cumT1 = 1000;
        let cumT2 = 600;
        for (let i = 0; i < 24; i++) {
          const month = MONTHS[i]!;
          const year = month.getUTCFullYear();
          const m = month.getUTCMonth();
          const deltaT1 = monthlyConsumption(SEED_SERIES.APT_ELECTRICITY_DAY, year, m);
          const deltaT2 = monthlyConsumption(SEED_SERIES.APT_ELECTRICITY_NIGHT, year, m);
          cumT1 += deltaT1;
          cumT2 += deltaT2;
          await tx.insert(readings).values({
            meterId: aptElecMeter,
            readAt: reading28(month),
            valueT1: round3(cumT1),
            valueT2: round3(cumT2),
            createdBy: primaryId,
          });
          const amount = round2(
            deltaT1 * SEED_TARIFF_RATES.ELECTRICITY_DAY +
              deltaT2 * SEED_TARIFF_RATES.ELECTRICITY_NIGHT,
          );
          await billInsert(tx, aptElecSvc, month, amount, primaryId);
          // Rolling debt: last two months unpaid, the one before them paid only in part.
          if (i < ELEC_PARTIAL_INDEX) {
            await paymentInsert(tx, aptElecSvc, pay5next(month), amount, primaryId);
          } else if (i === ELEC_PARTIAL_INDEX) {
            const partial = round2(parseFloat(amount) * ELEC_PARTIAL_RATIO);
            await paymentInsert(tx, aptElecSvc, pay5next(month), partial, primaryId);
          }
          // i > ELEC_PARTIAL_INDEX → no payment (the deliberate debt at M)
        }
      }

      // Apartment cold water — two meters feeding one service; the single monthly bill is the
      // summed volume × rate. The kitchen riser is swapped at KITCHEN_SWAP_INDEX: readings up to
      // then land on the old meter; the new meter opens with a near-zero installation reading and
      // carries on, so the concept volume stays continuous across the physical replacement.
      {
        let cumKitchen = 40;
        let cumBath = 60;
        for (let i = 0; i < 24; i++) {
          const month = MONTHS[i]!;
          const year = month.getUTCFullYear();
          const m = month.getUTCMonth();
          const deltaKitchen = monthlyConsumption(SEED_SERIES.APT_COLD_WATER_KITCHEN, year, m);
          const deltaBath = monthlyConsumption(SEED_SERIES.APT_COLD_WATER_BATH, year, m);

          cumBath += deltaBath;
          await tx.insert(readings).values({
            meterId: aptColdMeterBath,
            readAt: reading28(month),
            valueT1: round3(cumBath),
            createdBy: primaryId,
          });

          if (i < KITCHEN_SWAP_INDEX) {
            cumKitchen += deltaKitchen;
            await tx.insert(readings).values({
              meterId: aptColdMeterKitchenOld,
              readAt: reading28(month),
              valueT1: round3(cumKitchen),
              createdBy: primaryId,
            });
          } else {
            if (i === KITCHEN_SWAP_INDEX) {
              // New meter opens near zero; this installation reading anchors the swap month's delta.
              cumKitchen = 0;
              await tx.insert(readings).values({
                meterId: aptColdMeterKitchenNew,
                readAt: KITCHEN_SWAP_DATE,
                valueT1: round3(cumKitchen),
                createdBy: primaryId,
              });
            }
            cumKitchen += deltaKitchen;
            await tx.insert(readings).values({
              meterId: aptColdMeterKitchenNew,
              readAt: reading28(month),
              valueT1: round3(cumKitchen),
              createdBy: primaryId,
            });
          }

          const amount = round2((deltaKitchen + deltaBath) * SEED_TARIFF_RATES.COLD_WATER);
          await billInsert(tx, aptColdSvc, month, amount, primaryId);
          await paymentInsert(tx, aptColdSvc, pay5next(month), amount, primaryId);
        }
      }

      await seedMetered({
        tx,
        serviceId: aptHotSvc,
        meterId: aptHotMeter,
        series: SEED_SERIES.APT_HOT_WATER,
        startCum: 50,
        rate: SEED_TARIFF_RATES.HOT_WATER,
        primaryId,
      });
      await seedMetered({
        tx,
        serviceId: aptGasSvc,
        meterId: aptGasMeter,
        series: SEED_SERIES.APT_GAS,
        startCum: 200,
        rate: SEED_TARIFF_RATES.GAS_SUPPLY,
        primaryId,
      });

      // Apartment heating: fixed-type service, but the amount = Gcal × rate varies by month
      // (shoulder months low, Dec–Feb peaks) and is zero outside the heating season. One deep-winter
      // peak is paid only in part; the remainder is caught up the following heating month.
      {
        let heatCarry = 0;
        for (let i = 0; i < 24; i++) {
          const month = MONTHS[i]!;
          const gcal = heatingGcal(month.getUTCFullYear(), month.getUTCMonth());
          if (gcal === 0) continue;
          const amount = gcal * HEATING_RATE_PER_GCAL;
          await billInsert(tx, aptHeatSvc, month, round2(amount), primaryId);
          if (i === HEAT_PARTIAL_INDEX) {
            await paymentInsert(
              tx,
              aptHeatSvc,
              pay5next(month),
              round2(amount * HEAT_PARTIAL_RATIO),
              primaryId,
            );
            heatCarry = amount * (1 - HEAT_PARTIAL_RATIO);
          } else {
            await paymentInsert(tx, aptHeatSvc, pay5next(month), round2(amount), primaryId);
            if (heatCarry > 0) {
              await paymentInsert(tx, aptHeatSvc, pay5next(month), round2(heatCarry), primaryId);
              heatCarry = 0;
            }
          }
        }
      }

      // Apartment building maintenance (fixed; one indexation step mid-window)
      for (let i = 0; i < 24; i++) {
        const month = MONTHS[i]!;
        const amount = fixedAmountForMonth(MAINT_TARIFF_STEPS, month);
        await billInsert(tx, aptMaintSvc, month, amount, primaryId);
        await paymentInsert(tx, aptMaintSvc, pay5next(month), amount, primaryId);
      }

      // Apartment internet (fixed, two providers; one payment lands late)
      for (let i = 0; i < 24; i++) {
        const month = MONTHS[i]!;
        const amount = month < INTERNET_SWITCH_DATE ? "299.00" : "349.00";
        await billInsert(tx, aptNetSvc, month, amount, primaryId);
        const paidAt = i === INTERNET_LATE_INDEX ? payLate(month) : pay5next(month);
        await paymentInsert(tx, aptNetSvc, paidAt, amount, primaryId);
      }

      // Apartment intercom (bills monthly, but settled quarterly — a lump every three months)
      for (let i = 0; i < 24; i++) {
        const month = MONTHS[i]!;
        await billInsert(tx, aptIntercomSvc, month, round2(INTERCOM_MONTHLY_RATE), primaryId);
        if ((i + 1) % INTERCOM_QUARTER_MONTHS === 0) {
          const lump = round2(INTERCOM_MONTHLY_RATE * INTERCOM_QUARTER_MONTHS);
          await paymentInsert(tx, aptIntercomSvc, pay5next(month), lump, primaryId);
        }
      }

      console.log("Apartment readings/bills/payments done.");

      await seedMetered({
        tx,
        serviceId: houseElecSvc,
        meterId: houseElecMeter,
        series: SEED_SERIES.HOUSE_ELECTRICITY,
        startCum: 2000,
        rate: SEED_TARIFF_RATES.ELECTRICITY_DAY,
        primaryId,
      });

      // --- House gas (strong winter peak) — pre-winter advance that draws down ---
      {
        let cum = 500;
        for (let i = 0; i < 24; i++) {
          const month = MONTHS[i]!;
          const delta = monthlyConsumption(
            SEED_SERIES.HOUSE_GAS,
            month.getUTCFullYear(),
            month.getUTCMonth(),
          );
          cum += delta;
          await tx.insert(readings).values({
            meterId: houseGasMeter,
            readAt: reading28(month),
            valueT1: round3(cum),
            createdBy: primaryId,
          });
          const amount = round2(delta * SEED_TARIFF_RATES.GAS_SUPPLY);
          await billInsert(tx, houseGasSvc, month, amount, primaryId);
          // The advance month is paid in full plus a lump; the next two winter bills are then
          // covered by that credit (no separate payment) — the credit visibly draws down.
          if (GAS_ADVANCE_COVERED_INDEXES.has(i)) continue;
          await paymentInsert(tx, houseGasSvc, pay5next(month), amount, primaryId);
          if (i === GAS_ADVANCE_INDEX) {
            await paymentInsert(tx, houseGasSvc, pay5next(month), GAS_ADVANCE_AMOUNT, primaryId);
          }
        }
      }

      await seedMetered({
        tx,
        serviceId: houseColdSvc,
        meterId: houseColdMeter,
        series: SEED_SERIES.HOUSE_COLD_WATER,
        startCum: 80,
        rate: SEED_TARIFF_RATES.COLD_WATER,
        primaryId,
      });

      // House garbage (fixed; provider switch mid-window changes the amount, one late payment)
      for (let i = 0; i < 24; i++) {
        const month = MONTHS[i]!;
        const amount = month < GARBAGE_SWITCH_DATE ? GARBAGE_RATE_BEFORE : GARBAGE_RATE_AFTER;
        await billInsert(tx, houseGarbSvc, month, amount, primaryId);
        const paidAt = i === GARBAGE_LATE_INDEX ? payLate(month) : pay5next(month);
        await paymentInsert(tx, houseGarbSvc, paidAt, amount, primaryId);
      }

      // House gas delivery (fixed; regulated annual steps, one late payment)
      for (let i = 0; i < 24; i++) {
        const month = MONTHS[i]!;
        const amount = fixedAmountForMonth(GAS_DELIVERY_TARIFF_STEPS, month);
        await billInsert(tx, houseGasDelSvc, month, amount, primaryId);
        const paidAt = i === GAS_DELIVERY_LATE_INDEX ? payLate(month) : pay5next(month);
        await paymentInsert(tx, houseGasDelSvc, paidAt, amount, primaryId);
      }

      console.log("House readings/bills/payments done.");

      // --- Cottage electricity (seasonal) ---
      {
        let cum = 300;
        for (let i = 0; i < 24; i++) {
          const month = MONTHS[i]!;
          const delta = monthlyConsumption(
            SEED_SERIES.COTTAGE_ELECTRICITY,
            month.getUTCFullYear(),
            month.getUTCMonth(),
          );
          cum += delta;
          await tx.insert(readings).values({
            meterId: cottageElecMeter,
            readAt: reading28(month),
            valueT1: round3(cum),
            createdBy: primaryId,
          });
          if (delta > COTTAGE_BILL_THRESHOLD) {
            const amount = round2(delta * SEED_TARIFF_RATES.ELECTRICITY_DAY);
            await billInsert(tx, cottageElecSvc, month, amount, primaryId);
            const paidAt = i === COTTAGE_LATE_INDEX ? payLate(month) : pay5next(month);
            await paymentInsert(tx, cottageElecSvc, paidAt, amount, primaryId);
          }
        }
      }

      console.log("Cottage readings/bills/payments done.");

      // -----------------------------------------------------------------------
      // Property: Garage (non-residential — the `other` property + `other` service showcase)
      // -----------------------------------------------------------------------
      const [garageProp] = await tx
        .insert(properties)
        .values({
          name: "Garage",
          type: PROPERTY_TYPES.OTHER,
          address: "Avtomobilist Garage Co-op, Row 4 No. 12, Kyiv",
        })
        .returning({ id: properties.id });

      if (!garageProp) throw new Error("Failed to insert garage");

      await tx.insert(propertyAccess).values({
        propertyId: garageProp.id,
        userId: primaryId,
        propertyRole: PROPERTY_ROLES.OWNER,
        grantedBy: primaryId,
      });

      // Single `other`-type service: fixed amount, no meter/rate/readings, custom name required.
      const garageRentSvc = await svcInsert(
        tx,
        garageProp.id,
        st("other").id,
        "Оренда гаражного місця",
      );

      const garageRentC = await contractInsert(
        tx,
        garageRentSvc,
        pId("Avtomobilist Garage Co-op"),
        START_DATE,
        null,
      );
      await seedFixedTariffSteps(tx, garageRentC, GARAGE_RENT_TARIFF_STEPS);
      await acctInsert(tx, garageRentC, "GAR-4-12", START_DATE, null);
      await pdInsert(tx, garageRentC, "Avtomobilist Garage Co-op — monthly rent", START_DATE, null);

      // Garage rent (fixed; one rent rise mid-contract)
      for (let i = 0; i < 24; i++) {
        const month = MONTHS[i]!;
        const amount = fixedAmountForMonth(GARAGE_RENT_TARIFF_STEPS, month);
        await billInsert(tx, garageRentSvc, month, amount, primaryId);
        await paymentInsert(tx, garageRentSvc, pay5next(month), amount, primaryId);
      }

      console.log("Garage structure + rent done.");
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
