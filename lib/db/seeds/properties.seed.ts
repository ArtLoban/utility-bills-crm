import { config } from "dotenv";

config({ path: ".env.local" });

import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "../schema";
import { propertyAccess, properties } from "../schema/properties";
import { users } from "../schema/auth";

const SEED_PROPERTIES: Array<{ name: string; type: schema.TPropertyType; address: string }> = [
  { name: "Квартира на Хрещатику", type: "apartment", address: "вул. Хрещатик, 1, Київ" },
  { name: "Заміський будинок", type: "house", address: "с. Петрівське, вул. Садова, 12" },
  { name: "Дача", type: "cottage", address: "Київська обл., Бориспільський р-н" },
];

const main = async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  try {
    // Find developer's user account
    const emailEnv = process.env.SEED_USER_EMAIL;
    const userRows = emailEnv
      ? await db.select().from(users).where(eq(users.email, emailEnv)).limit(1)
      : await db.select().from(users).orderBy(users.createdAt).limit(1);

    if (userRows.length === 0) {
      console.log("No user found. Sign in at least once before running this seed.");
      return;
    }

    // userRows[0] is always defined here — guarded by the length check above
    const user = userRows[0]!;
    console.log(`Seeding for user: ${user.email}`);

    // Idempotency: skip if this user already has ≥ 3 owner access rows
    const existingAccess = await db
      .select()
      .from(propertyAccess)
      .where(eq(propertyAccess.userId, user.id));

    if (existingAccess.length >= SEED_PROPERTIES.length) {
      console.log(`Already seeded (${existingAccess.length} access rows found). Nothing to do.`);
      return;
    }

    // Insert properties and their access rows in one transaction
    await db.transaction(async (tx) => {
      for (const seed of SEED_PROPERTIES) {
        const inserted = await tx
          .insert(properties)
          .values({ name: seed.name, type: seed.type, address: seed.address })
          .returning({ id: properties.id });

        // .returning() always yields a row for a successful single insert
        const propertyId = inserted[0]!.id;

        await tx.insert(propertyAccess).values({
          propertyId,
          userId: user.id,
          propertyRole: "owner",
          grantedBy: user.id,
        });

        console.log(`  Created property "${seed.name}" (${seed.type})`);
      }
    });

    console.log("Done.");
  } finally {
    await pool.end();
  }
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
