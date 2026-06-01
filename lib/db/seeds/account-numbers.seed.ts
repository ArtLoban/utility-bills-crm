import { config } from "dotenv";

config({ path: ".env.local" });

import { and, eq, isNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "../schema";
import { users } from "../schema/auth";
import { contracts } from "../schema/contracts";
import { accountNumbers } from "../schema/account-numbers";
import { properties } from "../schema/properties";
import { serviceTypes } from "../schema/service-types";
import { services } from "../schema/services";
import { TServiceTypeCode } from "@/features/services/service-type";

type TSeedEntry = {
  propertyName: string;
  serviceTypeCode: TServiceTypeCode;
  contractValidFrom: Date;
  periods: Array<{
    value: string;
    validFrom: Date;
    validTo: Date | null;
    notes?: string;
  }>;
};

const SEED_ACCOUNT_NUMBERS: TSeedEntry[] = [
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "electricity",
    contractValidFrom: new Date("2024-03-01"),
    periods: [
      {
        value: "UA21 3006 5000 0002 6007 3300 0",
        validFrom: new Date("2024-03-01"),
        validTo: new Date("2024-09-01"),
        notes: "Old account",
      },
      {
        value: "UA21 3006 5000 0002 6007 3300 1",
        validFrom: new Date("2024-09-01"),
        validTo: null,
      },
    ],
  },
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "gas",
    contractValidFrom: new Date("2023-06-01"),
    periods: [
      {
        value: "GAS-482200-77",
        validFrom: new Date("2023-06-01"),
        validTo: null,
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
    console.log(`  Seeding account numbers for user ${ownerId}…`);

    const propertyRows = await db
      .select({ id: properties.id, name: properties.name })
      .from(properties)
      .where(isNull(properties.deletedAt));
    const propertyByName = new Map(propertyRows.map((p) => [p.name, p.id]));

    const serviceTypeRows = await db
      .select({ id: serviceTypes.id, code: serviceTypes.code })
      .from(serviceTypes);
    const serviceTypeByCode = new Map(serviceTypeRows.map((st) => [st.code, st.id]));

    for (const entry of SEED_ACCOUNT_NUMBERS) {
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
        console.log(`  Contract not found — run db:seed:contracts first.`);
        continue;
      }

      const contractId = contractRows[0]!.id;

      for (const period of entry.periods) {
        const existing = await db
          .select({ id: accountNumbers.id })
          .from(accountNumbers)
          .where(
            and(
              eq(accountNumbers.contractId, contractId),
              eq(accountNumbers.validFrom, period.validFrom),
              isNull(accountNumbers.deletedAt),
            ),
          )
          .limit(1);

        if (existing.length > 0) {
          console.log(
            `  Skipping account number [${period.validFrom.toISOString().slice(0, 10)}] — already exists.`,
          );
          continue;
        }

        await db.insert(accountNumbers).values({
          contractId,
          value: period.value,
          validFrom: period.validFrom,
          validTo: period.validTo,
          notes: period.notes ?? null,
        });

        const label = period.validTo
          ? `${period.validFrom.toISOString().slice(0, 10)} → ${period.validTo.toISOString().slice(0, 10)}`
          : `${period.validFrom.toISOString().slice(0, 10)} → present`;
        console.log(`  Created account number "${period.value}" [${label}]`);
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
