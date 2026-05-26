import { config } from "dotenv";

config({ path: ".env.local" });

import { and, eq, isNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "../schema";
import { users } from "../schema/auth";
import { bills } from "../schema/bills";
import { properties, propertyAccess } from "../schema/properties";
import { services } from "../schema/services";
import { serviceTypes } from "../schema/service-types";

type TSeedEntry = {
  propertyName: string;
  serviceTypeCode: string;
  month: string; // "YYYY-MM"
  amount: number;
  notes?: string;
};

const SEED_BILLS: TSeedEntry[] = [
  // --- Квартира на Хрещатику — electricity (12 months) ---
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "electricity",
    month: "2025-06",
    amount: 412.5,
  },
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "electricity",
    month: "2025-07",
    amount: 380.0,
  },
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "electricity",
    month: "2025-08",
    amount: 395.0,
  },
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "electricity",
    month: "2025-09",
    amount: 340.0,
  },
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "electricity",
    month: "2025-10",
    amount: 460.0,
  },
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "electricity",
    month: "2025-11",
    amount: 530.0,
  },
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "electricity",
    month: "2025-12",
    amount: 615.0,
  },
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "electricity",
    month: "2026-01",
    amount: 680.0,
  },
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "electricity",
    month: "2026-02",
    amount: 645.0,
  },
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "electricity",
    month: "2026-03",
    amount: 510.0,
  },
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "electricity",
    month: "2026-04",
    amount: 420.0,
  },
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "electricity",
    month: "2026-05",
    amount: 390.0,
  },

  // --- Квартира на Хрещатику — gas (8 months) ---
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "gas",
    month: "2025-10",
    amount: 820.0,
  },
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "gas",
    month: "2025-11",
    amount: 1240.0,
  },
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "gas",
    month: "2025-12",
    amount: 1580.0,
    notes: "Холодный месяць",
  },
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "gas",
    month: "2026-01",
    amount: 1720.0,
    notes: "Рекордне споживання",
  },
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "gas",
    month: "2026-02",
    amount: 1490.0,
  },
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "gas",
    month: "2026-03",
    amount: 940.0,
  },
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "gas",
    month: "2026-04",
    amount: 310.0,
  },
  {
    propertyName: "Квартира на Хрещатику",
    serviceTypeCode: "gas",
    month: "2026-05",
    amount: 120.0,
  },

  // --- Дача — electricity (6 months) ---
  { propertyName: "Дача", serviceTypeCode: "electricity", month: "2025-06", amount: 95.0 },
  { propertyName: "Дача", serviceTypeCode: "electricity", month: "2025-07", amount: 110.0 },
  { propertyName: "Дача", serviceTypeCode: "electricity", month: "2025-08", amount: 130.0 },
  { propertyName: "Дача", serviceTypeCode: "electricity", month: "2025-09", amount: 88.0 },
  { propertyName: "Дача", serviceTypeCode: "electricity", month: "2026-04", amount: 72.0 },
  { propertyName: "Дача", serviceTypeCode: "electricity", month: "2026-05", amount: 68.0 },

  // --- Дача — hot_water (4 months) ---
  { propertyName: "Дача", serviceTypeCode: "hot_water", month: "2025-06", amount: 340.0 },
  { propertyName: "Дача", serviceTypeCode: "hot_water", month: "2025-07", amount: 360.0 },
  { propertyName: "Дача", serviceTypeCode: "hot_water", month: "2025-08", amount: 355.0 },
  { propertyName: "Дача", serviceTypeCode: "hot_water", month: "2025-09", amount: 290.0 },
];

// Expands "YYYY-MM" → ISO date strings for period_start, period_end, period_month
const expandMonth = (month: string) => {
  const [yearStr, monthStr] = month.split("-");
  const year = Number(yearStr);
  const mo = Number(monthStr);
  const first = new Date(Date.UTC(year, mo - 1, 1));
  const last = new Date(Date.UTC(year, mo, 0));
  return {
    periodStart: first.toISOString().slice(0, 10),
    periodEnd: last.toISOString().slice(0, 10),
    periodMonth: first.toISOString().slice(0, 10),
  };
};

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
    console.log(`  Seeding bills for user ${ownerId}…`);

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

    for (const entry of SEED_BILLS) {
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

      const { periodStart, periodEnd, periodMonth } = expandMonth(entry.month);

      // Idempotency: skip if bill for this (serviceId, periodMonth) already exists
      const existing = await db
        .select({ id: bills.id })
        .from(bills)
        .where(
          and(
            eq(bills.serviceId, serviceId),
            eq(bills.periodMonth, periodMonth),
            isNull(bills.deletedAt),
          ),
        )
        .limit(1);

      if (existing.length > 0) {
        console.log(
          `  SKIP: bill "${entry.serviceTypeCode}" ${entry.month} on "${entry.propertyName}" — already exists.`,
        );
        skipped++;
        continue;
      }

      await db.insert(bills).values({
        serviceId,
        periodStart,
        periodEnd,
        periodMonth,
        amount: String(entry.amount),
        notes: entry.notes ?? null,
        createdBy: ownerId,
      });

      console.log(
        `  Created: "${entry.propertyName}" / ${entry.serviceTypeCode} / ${entry.month} — ${entry.amount}`,
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
