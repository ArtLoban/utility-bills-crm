import { config } from "dotenv";

config({ path: ".env.local" });

import { and, eq, isNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "../schema";
import { users } from "../schema/auth";
import { providers } from "../schema/providers";

type TSeedEntry = {
  name: string;
  website?: string;
  phone?: string;
  notes?: string;
};

const SEED_PROVIDERS: TSeedEntry[] = [
  { name: "Kyivenergo", phone: "+380 44 207-00-00" },
  { name: "Naftogaz", website: "https://naftogaz.com" },
  { name: "Kyivvodokanal", phone: "+380 44 206-00-00", notes: "Water supplier" },
];

const main = async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  try {
    // Find dev user by SEED_USER_EMAIL or fall back to first user
    const seedEmail = process.env.SEED_USER_EMAIL;
    const userRows = seedEmail
      ? await db.select({ id: users.id }).from(users).where(eq(users.email, seedEmail)).limit(1)
      : await db.select({ id: users.id }).from(users).limit(1);

    if (userRows.length === 0) {
      console.log("  No users found — run the app and sign in first.");
      return;
    }

    const ownerId = userRows[0]!.id;
    console.log(`  Seeding providers for user ${ownerId}…`);

    for (const entry of SEED_PROVIDERS) {
      // Idempotency: skip if an active provider with this name already exists for this owner
      const existing = await db
        .select({ id: providers.id })
        .from(providers)
        .where(
          and(
            eq(providers.ownerId, ownerId),
            eq(providers.name, entry.name),
            isNull(providers.deletedAt),
          ),
        )
        .limit(1);

      if (existing.length > 0) {
        console.log(`  Skipping "${entry.name}" — already exists.`);
        continue;
      }

      await db.insert(providers).values({
        ownerId,
        name: entry.name,
        website: entry.website ?? null,
        phone: entry.phone ?? null,
        notes: entry.notes ?? null,
      });
      console.log(`  Created provider "${entry.name}"`);
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
