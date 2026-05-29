import { config } from "dotenv";

config({ path: ".env.local" });

import { and, eq, isNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "../schema";
import { users } from "../schema/auth";
import { payments } from "../schema/payments";
import { properties, propertyAccess } from "../schema/properties";
import { services } from "../schema/services";
import { serviceTypes } from "../schema/service-types";

type TSeedEntry = {
  propertyName: string;
  serviceTypeCode: string;
  paidAt: string; // YYYY-MM-DD
  amount: number;
  notes?: string;
};

const SEED_PAYMENTS: TSeedEntry[] = [
  // --- Квартира на Хрещатику — electricity (12 payments) ---
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "electricity",
    paidAt: "2025-06-10",
    amount: 412.5,
  },
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "electricity",
    paidAt: "2025-07-08",
    amount: 380.0,
  },
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "electricity",
    paidAt: "2025-08-07",
    amount: 395.0,
  },
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "electricity",
    paidAt: "2025-09-09",
    amount: 340.0,
  },
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "electricity",
    paidAt: "2025-10-07",
    amount: 460.0,
  },
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "electricity",
    paidAt: "2025-11-06",
    amount: 530.0,
  },
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "electricity",
    paidAt: "2025-12-09",
    amount: 615.0,
  },
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "electricity",
    paidAt: "2026-01-08",
    amount: 680.0,
  },
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "electricity",
    paidAt: "2026-02-07",
    amount: 645.0,
  },
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "electricity",
    paidAt: "2026-03-06",
    amount: 510.0,
  },
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "electricity",
    paidAt: "2026-04-08",
    amount: 420.0,
  },
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "electricity",
    paidAt: "2026-05-07",
    amount: 390.0,
  },

  // --- Квартира на Хрещатику — gas (8 payments) ---
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "gas",
    paidAt: "2025-10-15",
    amount: 820.0,
  },
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "gas",
    paidAt: "2025-11-14",
    amount: 1240.0,
  },
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "gas",
    paidAt: "2025-12-16",
    amount: 1580.0,
    notes: "Холодний місяць",
  },
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "gas",
    paidAt: "2026-01-15",
    amount: 1720.0,
    notes: "Рекордне споживання",
  },
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "gas",
    paidAt: "2026-02-13",
    amount: 1490.0,
  },
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "gas",
    paidAt: "2026-03-14",
    amount: 940.0,
  },
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "gas",
    paidAt: "2026-04-15",
    amount: 310.0,
  },
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "gas",
    paidAt: "2026-05-14",
    amount: 120.0,
  },

  // --- Дача — electricity (6 payments) ---
  { propertyName: "Дача", serviceTypeCode: "electricity", paidAt: "2025-06-20", amount: 95.0 },
  { propertyName: "Дача", serviceTypeCode: "electricity", paidAt: "2025-07-19", amount: 110.0 },
  { propertyName: "Дача", serviceTypeCode: "electricity", paidAt: "2025-08-21", amount: 130.0 },
  { propertyName: "Дача", serviceTypeCode: "electricity", paidAt: "2025-09-20", amount: 88.0 },
  { propertyName: "Дача", serviceTypeCode: "electricity", paidAt: "2026-04-19", amount: 72.0 },
  { propertyName: "Дача", serviceTypeCode: "electricity", paidAt: "2026-05-17", amount: 68.0 },

  // --- Дача — hot_water (4 payments) ---
  { propertyName: "Дача", serviceTypeCode: "hot_water", paidAt: "2025-06-25", amount: 340.0 },
  { propertyName: "Дача", serviceTypeCode: "hot_water", paidAt: "2025-07-24", amount: 360.0 },
  { propertyName: "Дача", serviceTypeCode: "hot_water", paidAt: "2025-08-23", amount: 355.0 },
  { propertyName: "Дача", serviceTypeCode: "hot_water", paidAt: "2025-09-22", amount: 290.0 },
];

const main = async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  try {
    // Resolve user
    const seedEmail = process.env.SEED_USER_EMAIL;
    const userRows = seedEmail
      ? await db.select({ id: users.id }).from(users).where(eq(users.email, seedEmail)).limit(1)
      : await db.select({ id: users.id }).from(users).limit(1);

    if (userRows.length === 0) {
      console.log("  No users found — run the app and sign in first.");
      return;
    }

    const ownerId = userRows[0]!.id;
    console.log(`  Seeding payments for user ${ownerId}…`);

    // Resolve accessible properties
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

    // Resolve service types
    const serviceTypeRows = await db
      .select({ id: serviceTypes.id, code: serviceTypes.code })
      .from(serviceTypes);
    const serviceTypeByCode = new Map(serviceTypeRows.map((st) => [st.code, st.id]));

    // Resolve services: (propertyId, serviceTypeId) → serviceId
    const serviceRows = await db
      .select({
        id: services.id,
        propertyId: services.propertyId,
        serviceTypeId: services.serviceTypeId,
      })
      .from(services)
      .where(isNull(services.deletedAt));
    const serviceKey = (propertyId: string, serviceTypeId: string) =>
      `${propertyId}:${serviceTypeId}`;
    const serviceByKey = new Map(
      serviceRows.map((s) => [serviceKey(s.propertyId, s.serviceTypeId), s.id]),
    );

    let created = 0;
    let skipped = 0;

    for (const entry of SEED_PAYMENTS) {
      const propertyId = propertyByName.get(entry.propertyName);
      if (!propertyId) {
        console.log(
          `  SKIP: property "${entry.propertyName}" not found — run db:seed:properties first.`,
        );
        skipped++;
        continue;
      }

      const serviceTypeId = serviceTypeByCode.get(entry.serviceTypeCode);
      if (!serviceTypeId) {
        console.log(`  SKIP: service type "${entry.serviceTypeCode}" not found.`);
        skipped++;
        continue;
      }

      const serviceId = serviceByKey.get(serviceKey(propertyId, serviceTypeId));
      if (!serviceId) {
        console.log(
          `  SKIP: service "${entry.serviceTypeCode}" on "${entry.propertyName}" not found — run db:seed:services first.`,
        );
        skipped++;
        continue;
      }

      // Idempotency: skip if a payment for this (serviceId, paidAt) already exists
      const existing = await db
        .select({ id: payments.id })
        .from(payments)
        .where(
          and(
            eq(payments.serviceId, serviceId),
            eq(payments.paidAt, entry.paidAt),
            isNull(payments.deletedAt),
          ),
        )
        .limit(1);

      if (existing.length > 0) {
        console.log(
          `  SKIP: payment "${entry.serviceTypeCode}" ${entry.paidAt} on "${entry.propertyName}" — already exists.`,
        );
        skipped++;
        continue;
      }

      await db.insert(payments).values({
        serviceId,
        paidAt: entry.paidAt,
        amount: String(entry.amount),
        notes: entry.notes ?? null,
        createdBy: ownerId,
      });

      console.log(
        `  Created: "${entry.propertyName}" / ${entry.serviceTypeCode} / ${entry.paidAt} — ${entry.amount}`,
      );
      created++;
    }

    console.log(`\nDone. Created: ${created}, Skipped: ${skipped}.`);
  } finally {
    await pool.end();
  }
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
