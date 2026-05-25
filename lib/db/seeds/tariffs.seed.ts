import { config } from "dotenv";

config({ path: ".env.local" });

import { and, eq, isNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "../schema";
import { users } from "../schema/auth";
import { contracts } from "../schema/contracts";
import { tariffs } from "../schema/tariffs";
import { properties } from "../schema/properties";
import { serviceTypes } from "../schema/service-types";
import { services } from "../schema/services";

// Two tariff records per contract: one closed, one current (validTo = NULL).
// For metered services both metered and fixed shapes are represented in history.
type TSeedEntry = {
  propertyName: string;
  serviceTypeCode: string;
  contractValidFrom: Date;
  // Tariff entries for this contract, ordered by validFrom.
  tariffPeriods: Array<{
    validFrom: Date;
    validTo: Date | null;
    rateT1?: string;
    rateT2?: string;
    fixedAmount?: string;
    notes?: string;
  }>;
};

const SEED_TARIFFS: TSeedEntry[] = [
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "electricity",
    contractValidFrom: new Date("2024-03-01"),
    tariffPeriods: [
      // Closed period — metered rates
      {
        validFrom: new Date("2024-03-01"),
        validTo: new Date("2024-11-01"),
        rateT1: "3.6000",
        rateT2: "1.8000",
        notes: "Previous tariff",
      },
      // Current period — higher rates from Nov 2024
      {
        validFrom: new Date("2024-11-01"),
        validTo: null,
        rateT1: "4.3200",
        rateT2: "2.1600",
      },
    ],
  },
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "gas",
    contractValidFrom: new Date("2023-06-01"),
    tariffPeriods: [
      // Closed period
      {
        validFrom: new Date("2023-06-01"),
        validTo: new Date("2024-01-01"),
        fixedAmount: "120.00",
        notes: "Old fixed rate",
      },
      // Current period
      {
        validFrom: new Date("2024-01-01"),
        validTo: null,
        fixedAmount: "180.00",
      },
    ],
  },
];

const main = async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  try {
    const seedEmail = process.env.SEED_USER_EMAIL;
    const userRows = seedEmail
      ? await db.select({ id: users.id }).from(users).where(eq(users.email, seedEmail)).limit(1)
      : await db.select({ id: users.id }).from(users).limit(1);

    if (userRows.length === 0) {
      console.log("  No users found — run the app and sign in first.");
      return;
    }

    const ownerId = userRows[0]!.id;
    console.log(`  Seeding tariffs for user ${ownerId}…`);

    const propertyRows = await db
      .select({ id: properties.id, name: properties.name })
      .from(properties)
      .where(isNull(properties.deletedAt));
    const propertyByName = new Map(propertyRows.map((p) => [p.name, p.id]));

    const serviceTypeRows = await db
      .select({ id: serviceTypes.id, code: serviceTypes.code })
      .from(serviceTypes);
    const serviceTypeByCode = new Map(serviceTypeRows.map((st) => [st.code, st.id]));

    for (const entry of SEED_TARIFFS) {
      const propertyId = propertyByName.get(entry.propertyName);
      if (!propertyId) {
        console.log(`  Property "${entry.propertyName}" not found — skipping.`);
        continue;
      }

      const serviceTypeId = serviceTypeByCode.get(entry.serviceTypeCode);
      if (!serviceTypeId) {
        console.log(`  ServiceType "${entry.serviceTypeCode}" not found.`);
        continue;
      }

      const serviceRows = await db
        .select({ id: services.id })
        .from(services)
        .where(
          and(
            eq(services.propertyId, propertyId),
            eq(services.serviceTypeId, serviceTypeId),
            isNull(services.deletedAt),
          ),
        )
        .limit(1);

      if (serviceRows.length === 0) {
        console.log(`  Service "${entry.serviceTypeCode}" not found — run db:seed:services first.`);
        continue;
      }

      const serviceId = serviceRows[0]!.id;

      const contractRows = await db
        .select({ id: contracts.id })
        .from(contracts)
        .where(
          and(
            eq(contracts.serviceId, serviceId),
            eq(contracts.validFrom, entry.contractValidFrom),
            isNull(contracts.deletedAt),
          ),
        )
        .limit(1);

      if (contractRows.length === 0) {
        console.log(
          `  Contract not found (service: "${entry.serviceTypeCode}", validFrom: ${entry.contractValidFrom.toISOString().slice(0, 10)}) — run db:seed:contracts first.`,
        );
        continue;
      }

      const contractId = contractRows[0]!.id;

      for (const period of entry.tariffPeriods) {
        const existing = await db
          .select({ id: tariffs.id })
          .from(tariffs)
          .where(
            and(
              eq(tariffs.contractId, contractId),
              eq(tariffs.validFrom, period.validFrom),
              isNull(tariffs.deletedAt),
            ),
          )
          .limit(1);

        if (existing.length > 0) {
          console.log(
            `  Skipping tariff [${period.validFrom.toISOString().slice(0, 10)}] — already exists.`,
          );
          continue;
        }

        await db.insert(tariffs).values({
          contractId,
          rateT1: period.rateT1 ?? null,
          rateT2: period.rateT2 ?? null,
          rateT3: null,
          fixedAmount: period.fixedAmount ?? null,
          validFrom: period.validFrom,
          validTo: period.validTo,
          notes: period.notes ?? null,
        });

        const label = period.validTo
          ? `${period.validFrom.toISOString().slice(0, 10)} → ${period.validTo.toISOString().slice(0, 10)}`
          : `${period.validFrom.toISOString().slice(0, 10)} → present`;
        console.log(`  Created tariff [${label}] for ${entry.serviceTypeCode}`);
      }
    }

    console.log("Done.");
  } finally {
    await pool.end();
  }
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
