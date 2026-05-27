import { config } from "dotenv";

config({ path: ".env.local" });

import { and, eq, isNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "../schema";
import { users } from "../schema/auth";
import { meters } from "../schema/meters";
import { readings } from "../schema/readings";
import { properties } from "../schema/properties";
import { serviceTypes } from "../schema/service-types";
import { propertyAccess } from "../schema/properties";
import type { TServiceTypeCode } from "@/lib/constants/service-types";

type TSeedReading = {
  readAt: Date;
  valueT1: number;
  valueT2?: number;
  valueT3?: number;
  notes?: string;
};

type TSeedMeterReadings = {
  propertyName: string;
  serviceTypeCode: TServiceTypeCode;
  meterValidFrom: Date;
  readings: TSeedReading[];
};

const SEED_READINGS: TSeedMeterReadings[] = [
  // Old single-zone electricity meter (replaced 2024-01-15)
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "electricity",
    meterValidFrom: new Date("2020-03-01"),
    readings: [
      { readAt: new Date("2020-04-01"), valueT1: 1042 },
      { readAt: new Date("2020-10-01"), valueT1: 1638 },
      { readAt: new Date("2021-04-01"), valueT1: 2291 },
      { readAt: new Date("2021-10-01"), valueT1: 2954 },
      { readAt: new Date("2022-04-01"), valueT1: 3617 },
      { readAt: new Date("2023-04-01"), valueT1: 4272 },
      { readAt: new Date("2024-01-10"), valueT1: 4831, notes: "Final reading before replacement" },
    ],
  },
  // Current two-zone electricity meter (since 2024-01-15)
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "electricity",
    meterValidFrom: new Date("2024-01-15"),
    readings: [
      { readAt: new Date("2024-02-01"), valueT1: 5218, valueT2: 2104 },
      { readAt: new Date("2024-03-01"), valueT1: 5401, valueT2: 2186 },
      { readAt: new Date("2024-04-01"), valueT1: 5563, valueT2: 2251 },
      { readAt: new Date("2024-05-01"), valueT1: 5694, valueT2: 2305 },
      { readAt: new Date("2024-06-01"), valueT1: 5812, valueT2: 2348 },
      { readAt: new Date("2024-07-01"), valueT1: 5940, valueT2: 2398 },
      { readAt: new Date("2024-08-01"), valueT1: 6071, valueT2: 2451 },
      { readAt: new Date("2024-09-01"), valueT1: 6218, valueT2: 2517 },
      { readAt: new Date("2024-10-01"), valueT1: 6402, valueT2: 2604 },
      { readAt: new Date("2024-11-01"), valueT1: 6619, valueT2: 2710 },
      { readAt: new Date("2024-12-01"), valueT1: 6858, valueT2: 2833 },
      { readAt: new Date("2025-01-01"), valueT1: 7124, valueT2: 2971 },
      { readAt: new Date("2025-02-01"), valueT1: 7381, valueT2: 3098 },
      { readAt: new Date("2025-03-01"), valueT1: 7601, valueT2: 3205 },
      { readAt: new Date("2025-04-01"), valueT1: 7782, valueT2: 3274 },
      { readAt: new Date("2025-05-01"), valueT1: 7920, valueT2: 3330 },
    ],
  },
  // Gas meter (since 2022-03-15)
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "gas",
    meterValidFrom: new Date("2022-03-15"),
    readings: [
      { readAt: new Date("2022-04-01"), valueT1: 341 },
      { readAt: new Date("2022-07-01"), valueT1: 362 },
      { readAt: new Date("2022-10-01"), valueT1: 421 },
      { readAt: new Date("2023-01-01"), valueT1: 558 },
      { readAt: new Date("2023-04-01"), valueT1: 623 },
      { readAt: new Date("2023-07-01"), valueT1: 641 },
      { readAt: new Date("2023-10-01"), valueT1: 704 },
      { readAt: new Date("2024-01-01"), valueT1: 849 },
      { readAt: new Date("2024-04-01"), valueT1: 918 },
      { readAt: new Date("2024-07-01"), valueT1: 934 },
      { readAt: new Date("2024-10-01"), valueT1: 998 },
      { readAt: new Date("2025-01-01"), valueT1: 1142 },
      { readAt: new Date("2025-04-01"), valueT1: 1208 },
    ],
  },
  // Cold water meter (since 2022-03-15)
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "cold_water",
    meterValidFrom: new Date("2022-03-15"),
    readings: [
      { readAt: new Date("2022-04-01"), valueT1: 126.4 },
      { readAt: new Date("2022-07-01"), valueT1: 145.2 },
      { readAt: new Date("2022-10-01"), valueT1: 162.8 },
      { readAt: new Date("2023-01-01"), valueT1: 183.5 },
      { readAt: new Date("2023-04-01"), valueT1: 201.0 },
      { readAt: new Date("2023-07-01"), valueT1: 219.6 },
      { readAt: new Date("2023-10-01"), valueT1: 237.1 },
      { readAt: new Date("2024-01-01"), valueT1: 258.4 },
      { readAt: new Date("2024-04-01"), valueT1: 275.9 },
      { readAt: new Date("2024-07-01"), valueT1: 294.3 },
      { readAt: new Date("2024-10-01"), valueT1: 312.0 },
      { readAt: new Date("2025-01-01"), valueT1: 332.7 },
      { readAt: new Date("2025-04-01"), valueT1: 351.2 },
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

    const createdById = userRows[0]!.id;
    console.log(`  Seeding readings for user ${createdById}…`);

    const accessRows = await db
      .select({ id: properties.id, name: properties.name })
      .from(propertyAccess)
      .innerJoin(properties, eq(propertyAccess.propertyId, properties.id))
      .where(
        and(
          eq(propertyAccess.userId, createdById),
          isNull(propertyAccess.deletedAt),
          isNull(properties.deletedAt),
        ),
      );
    const propertyByName = new Map(accessRows.map((p) => [p.name, p.id]));

    const serviceTypeRows = await db
      .select({ id: serviceTypes.id, code: serviceTypes.code })
      .from(serviceTypes);
    const serviceTypeByCode = new Map(serviceTypeRows.map((st) => [st.code, st.id]));

    for (const entry of SEED_READINGS) {
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

      const meterRows = await db
        .select({ id: meters.id })
        .from(meters)
        .where(
          and(
            eq(meters.propertyId, propertyId),
            eq(meters.serviceTypeId, serviceTypeId),
            eq(meters.validFrom, entry.meterValidFrom),
            isNull(meters.deletedAt),
          ),
        )
        .limit(1);

      if (meterRows.length === 0) {
        console.log(
          `  Meter "${entry.serviceTypeCode}" (validFrom: ${entry.meterValidFrom.toISOString().slice(0, 10)}) not found — run db:seed:meters first.`,
        );
        continue;
      }

      const meterId = meterRows[0]!.id;

      for (const reading of entry.readings) {
        const existing = await db
          .select({ id: readings.id })
          .from(readings)
          .where(
            and(
              eq(readings.meterId, meterId),
              eq(readings.readAt, reading.readAt),
              isNull(readings.deletedAt),
            ),
          )
          .limit(1);

        if (existing.length > 0) {
          console.log(
            `  Skipping reading for "${entry.serviceTypeCode}" on ${reading.readAt.toISOString().slice(0, 10)} — already exists.`,
          );
          continue;
        }

        await db.insert(readings).values({
          meterId,
          readAt: reading.readAt,
          valueT1: String(reading.valueT1),
          valueT2: reading.valueT2 !== undefined ? String(reading.valueT2) : null,
          valueT3: reading.valueT3 !== undefined ? String(reading.valueT3) : null,
          notes: reading.notes ?? null,
          createdBy: createdById,
        });

        console.log(
          `  Created reading for "${entry.serviceTypeCode}" on ${reading.readAt.toISOString().slice(0, 10)} — T1: ${reading.valueT1}${reading.valueT2 !== undefined ? ` / T2: ${reading.valueT2}` : ""}`,
        );
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
