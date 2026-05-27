import { config } from "dotenv";

config({ path: ".env.local" });

import { and, eq, isNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "../schema";
import { users } from "../schema/auth";
import { contracts } from "../schema/contracts";
import { properties } from "../schema/properties";
import { providers } from "../schema/providers";
import { serviceTypes } from "../schema/service-types";
import { services } from "../schema/services";
import type { TServiceTypeCode } from "@/lib/constants/service-types";

type TSeedEntry = {
  propertyName: string;
  serviceTypeCode: TServiceTypeCode;
  providerName: string;
  validFrom: Date;
  validTo: Date | null;
  notes?: string;
};

// At least one closed contract + one current on the same service, to test temporal succession.
const SEED_CONTRACTS: TSeedEntry[] = [
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "electricity",
    providerName: "Kyivenergo",
    validFrom: new Date("2022-01-01"),
    validTo: new Date("2024-03-01"),
    notes: "Previous electricity provider",
  },
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "electricity",
    providerName: "Kyivenergo",
    validFrom: new Date("2024-03-01"),
    validTo: null,
    notes: "Current electricity contract",
  },
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "gas",
    providerName: "Naftogaz",
    validFrom: new Date("2023-06-01"),
    validTo: null,
  },
];

const main = async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  try {
    // Resolve dev user
    const seedEmail = process.env.SEED_USER_EMAIL;
    const userRows = seedEmail
      ? await db.select({ id: users.id }).from(users).where(eq(users.email, seedEmail)).limit(1)
      : await db.select({ id: users.id }).from(users).limit(1);

    if (userRows.length === 0) {
      console.log("  No users found — run the app and sign in first.");
      return;
    }

    const ownerId = userRows[0]!.id;
    console.log(`  Seeding contracts for user ${ownerId}…`);

    // Resolve properties by stable name
    const propertyRows = await db
      .select({ id: properties.id, name: properties.name })
      .from(properties)
      .where(isNull(properties.deletedAt));
    const propertyByName = new Map(propertyRows.map((p) => [p.name, p.id]));

    // Resolve service_types by stable code
    const serviceTypeRows = await db
      .select({ id: serviceTypes.id, code: serviceTypes.code })
      .from(serviceTypes);
    const serviceTypeByCode = new Map(serviceTypeRows.map((st) => [st.code, st.id]));

    // Resolve providers by stable name for this owner
    const providerRows = await db
      .select({ id: providers.id, name: providers.name })
      .from(providers)
      .where(and(eq(providers.ownerId, ownerId), isNull(providers.deletedAt)));
    const providerByName = new Map(providerRows.map((p) => [p.name, p.id]));

    for (const entry of SEED_CONTRACTS) {
      const propertyId = propertyByName.get(entry.propertyName);
      if (!propertyId) {
        console.log(`  Property "${entry.propertyName}" not found — run db:seed:properties first.`);
        continue;
      }

      const serviceTypeId = serviceTypeByCode.get(entry.serviceTypeCode);
      if (!serviceTypeId) {
        console.log(`  ServiceType "${entry.serviceTypeCode}" not found.`);
        continue;
      }

      const providerId = providerByName.get(entry.providerName);
      if (!providerId) {
        console.log(`  Provider "${entry.providerName}" not found — run db:seed:providers first.`);
        continue;
      }

      // Resolve service by (propertyId, serviceTypeId)
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
        console.log(
          `  Service "${entry.serviceTypeCode}" for "${entry.propertyName}" not found — run db:seed:services first.`,
        );
        continue;
      }

      const serviceId = serviceRows[0]!.id;

      // Idempotency: skip if a contract with this (serviceId, validFrom) already exists.
      const existing = await db
        .select({ id: contracts.id })
        .from(contracts)
        .where(
          and(
            eq(contracts.serviceId, serviceId),
            eq(contracts.validFrom, entry.validFrom),
            isNull(contracts.deletedAt),
          ),
        )
        .limit(1);

      if (existing.length > 0) {
        console.log(
          `  Skipping contract "${entry.serviceTypeCode}" @ ${entry.validFrom.toISOString().slice(0, 10)} — already exists.`,
        );
        continue;
      }

      await db.insert(contracts).values({
        serviceId,
        providerId,
        validFrom: entry.validFrom,
        validTo: entry.validTo,
        notes: entry.notes ?? null,
      });

      const label = entry.validTo
        ? `${entry.validFrom.toISOString().slice(0, 10)} → ${entry.validTo.toISOString().slice(0, 10)}`
        : `${entry.validFrom.toISOString().slice(0, 10)} → present`;
      console.log(`  Created contract "${entry.serviceTypeCode}" [${label}]`);
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
