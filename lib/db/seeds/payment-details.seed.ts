import { config } from "dotenv";

config({ path: ".env.local" });

import { and, eq, isNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "../schema";
import { users } from "../schema/auth";
import { contracts } from "../schema/contracts";
import { paymentDetails } from "../schema/payment-details";
import { properties } from "../schema/properties";
import { serviceTypes } from "../schema/service-types";
import { services } from "../schema/services";
import type { TServiceTypeCode } from "@/lib/constants/service-types";

type TSeedEntry = {
  propertyName: string;
  serviceTypeCode: TServiceTypeCode;
  contractValidFrom: Date;
  periods: Array<{
    details: string;
    validFrom: Date;
    validTo: Date | null;
    notes?: string;
  }>;
};

const SEED_PAYMENT_DETAILS: TSeedEntry[] = [
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "electricity",
    contractValidFrom: new Date("2024-03-01"),
    periods: [
      {
        details:
          "Bank: ПАТ КБ «ПРИВАТБАНК»\nMFO: 305299\nEDRPOU: 23494714\nAccount: UA21 3006 5000 0002 6007 3300 1\nPurpose: Payment for electricity services",
        validFrom: new Date("2024-03-01"),
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
        details:
          "Bank: ПАТ «Ощадбанк»\nIBAN: UA12 0000 1234 5678 0000 0000 000\nPurpose: Gas payment",
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
    console.log(`  Seeding payment details for user ${ownerId}…`);

    const propertyRows = await db
      .select({ id: properties.id, name: properties.name })
      .from(properties)
      .where(isNull(properties.deletedAt));
    const propertyByName = new Map(propertyRows.map((p) => [p.name, p.id]));

    const serviceTypeRows = await db
      .select({ id: serviceTypes.id, code: serviceTypes.code })
      .from(serviceTypes);
    const serviceTypeByCode = new Map(serviceTypeRows.map((st) => [st.code, st.id]));

    for (const entry of SEED_PAYMENT_DETAILS) {
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
          .select({ id: paymentDetails.id })
          .from(paymentDetails)
          .where(
            and(
              eq(paymentDetails.contractId, contractId),
              eq(paymentDetails.validFrom, period.validFrom),
              isNull(paymentDetails.deletedAt),
            ),
          )
          .limit(1);

        if (existing.length > 0) {
          console.log(
            `  Skipping payment details [${period.validFrom.toISOString().slice(0, 10)}] — already exists.`,
          );
          continue;
        }

        await db.insert(paymentDetails).values({
          contractId,
          details: period.details,
          validFrom: period.validFrom,
          validTo: period.validTo,
          notes: period.notes ?? null,
        });

        const label = period.validTo
          ? `${period.validFrom.toISOString().slice(0, 10)} → ${period.validTo.toISOString().slice(0, 10)}`
          : `${period.validFrom.toISOString().slice(0, 10)} → present`;
        console.log(`  Created payment details [${label}] for ${entry.serviceTypeCode}`);
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
