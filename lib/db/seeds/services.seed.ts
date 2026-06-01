import { config } from "dotenv";

config({ path: ".env.local" });

import { and, eq, isNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "../schema";
import { properties } from "../schema/properties";
import { serviceTypes } from "../schema/service-types";
import { services } from "../schema/services";
import { TServiceTypeCode } from "@/features/services/service-type";

type TSeedEntry = { propertyName: string; serviceTypeCode: TServiceTypeCode };

const SEED_SERVICES: TSeedEntry[] = [
  { propertyName: "Квартира на Хрещатику", serviceTypeCode: "electricity" },
  { propertyName: "Квартира на Хрещатику", serviceTypeCode: "gas" },
  { propertyName: "Заміський будинок", serviceTypeCode: "cold_water" },
];

const main = async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  try {
    // Resolve properties by stable name — no hardcoded UUIDs
    const propertyRows = await db
      .select({ id: properties.id, name: properties.name })
      .from(properties)
      .where(isNull(properties.deletedAt));

    const propertyByName = new Map(propertyRows.map((p) => [p.name, p.id]));

    // Resolve service_types by stable code — no hardcoded UUIDs
    const serviceTypeRows = await db
      .select({ id: serviceTypes.id, code: serviceTypes.code })
      .from(serviceTypes);

    const serviceTypeByCode = new Map(serviceTypeRows.map((st) => [st.code, st.id]));

    for (const entry of SEED_SERVICES) {
      const propertyId = propertyByName.get(entry.propertyName);
      if (!propertyId) {
        console.log(`  Property "${entry.propertyName}" not found — run db:seed:properties first.`);
        continue;
      }

      const serviceTypeId = serviceTypeByCode.get(entry.serviceTypeCode);
      if (!serviceTypeId) {
        console.log(`  ServiceType "${entry.serviceTypeCode}" not found — check seed data.`);
        continue;
      }

      // Idempotency: skip if an active service for this pair already exists
      const existing = await db
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

      if (existing.length > 0) {
        console.log(
          `  Skipping "${entry.serviceTypeCode}" for "${entry.propertyName}" — already exists.`,
        );
        continue;
      }

      await db.insert(services).values({ propertyId, serviceTypeId });
      console.log(`  Created service "${entry.serviceTypeCode}" for "${entry.propertyName}"`);
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
