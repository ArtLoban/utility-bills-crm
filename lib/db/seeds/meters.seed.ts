import { config } from "dotenv";

config({ path: ".env.local" });

import { and, eq, isNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "../schema";
import { users } from "../schema/auth";
import { meters } from "../schema/meters";
import { properties } from "../schema/properties";
import { serviceTypes } from "../schema/service-types";
import { propertyAccess } from "../schema/properties";
import type { TServiceTypeCode } from "@/lib/constants/service-types";

type TSeedEntry = {
  propertyName: string;
  serviceTypeCode: TServiceTypeCode;
  serialNumber?: string;
  zoneCount: 1 | 2 | 3;
  installedAt: Date | null;
  validFrom: Date;
  validTo: Date | null;
  notes?: string;
};

// Scenarios covered:
// 1. Replaced meter — a closed electricity meter + a current one on the same (property, serviceType).
//    This exercises temporal succession and the historical section in the UI.
// 2. Multi-zone meter (zoneCount = 2) — so Stage 5.2 (Readings) has a two-zone device to work with.
// 3. Standard single-zone meters for gas and cold water.
const SEED_METERS: TSeedEntry[] = [
  // --- Replaced electricity meter (closed) ---
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "electricity",
    serialNumber: "NIK-0011-OLD",
    zoneCount: 1,
    installedAt: new Date("2020-03-01"),
    validFrom: new Date("2020-03-01"),
    validTo: new Date("2024-01-15"),
    notes: "Replaced due to malfunction",
  },
  // --- Current two-zone electricity meter (active) ---
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "electricity",
    serialNumber: "NIK-2230-TZ",
    zoneCount: 2,
    installedAt: new Date("2024-01-15"),
    validFrom: new Date("2024-01-15"),
    validTo: null,
    notes: "Two-zone meter (day / night)",
  },
  // --- Gas meter ---
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "gas",
    serialNumber: "DISP-0034",
    zoneCount: 1,
    installedAt: new Date("2022-03-15"),
    validFrom: new Date("2022-03-15"),
    validTo: null,
  },
  // --- Cold water meter ---
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "cold_water",
    serialNumber: "WS-4490-A",
    zoneCount: 1,
    installedAt: new Date("2022-03-15"),
    validFrom: new Date("2022-03-15"),
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
    console.log(`  Seeding meters for user ${ownerId}…`);

    // Resolve properties accessible by this user
    const accessRows = await db
      .select({ id: properties.id, name: properties.name })
      .from(propertyAccess)
      .innerJoin(properties, eq(propertyAccess.propertyId, properties.id))
      .where(
        and(
          eq(propertyAccess.userId, ownerId),
          isNull(propertyAccess.deletedAt),
          isNull(properties.deletedAt),
        ),
      );
    const propertyByName = new Map(accessRows.map((p) => [p.name, p.id]));

    // Resolve service_types by stable code
    const serviceTypeRows = await db
      .select({ id: serviceTypes.id, code: serviceTypes.code })
      .from(serviceTypes);
    const serviceTypeByCode = new Map(serviceTypeRows.map((st) => [st.code, st.id]));

    for (const entry of SEED_METERS) {
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

      // Idempotency: skip if a meter with this (propertyId, serviceTypeId, validFrom) already exists.
      const existing = await db
        .select({ id: meters.id })
        .from(meters)
        .where(
          and(
            eq(meters.propertyId, propertyId),
            eq(meters.serviceTypeId, serviceTypeId),
            eq(meters.validFrom, entry.validFrom),
            isNull(meters.deletedAt),
          ),
        )
        .limit(1);

      if (existing.length > 0) {
        const label = entry.validTo
          ? `${entry.validFrom.toISOString().slice(0, 10)} → ${entry.validTo.toISOString().slice(0, 10)}`
          : `${entry.validFrom.toISOString().slice(0, 10)} → present`;
        console.log(`  Skipping meter "${entry.serviceTypeCode}" [${label}] — already exists.`);
        continue;
      }

      await db.insert(meters).values({
        propertyId,
        serviceTypeId,
        serialNumber: entry.serialNumber ?? null,
        zoneCount: entry.zoneCount,
        installedAt: entry.installedAt,
        validFrom: entry.validFrom,
        validTo: entry.validTo,
        notes: entry.notes ?? null,
      });

      const label = entry.validTo
        ? `${entry.validFrom.toISOString().slice(0, 10)} → ${entry.validTo.toISOString().slice(0, 10)}`
        : `${entry.validFrom.toISOString().slice(0, 10)} → present`;
      console.log(
        `  Created meter "${entry.serviceTypeCode}" [zones: ${entry.zoneCount}] [${label}]`,
      );
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
