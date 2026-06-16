import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

// Build-time migrator for Vercel production deploys. Wired into vercel.json's buildCommand
// (`db:migrate:deploy && build`), so a failed migration aborts the build and leaves the previous
// deployment live (fail-safe). Reads process.env directly — Vercel injects env at build time and
// .env.local is never deployed, so no dotenv here. Local migration stays `npm run db:migrate`.
//
// Migrations target the DIRECT (unpooled) Neon endpoint (#149): DDL and the migration session must
// not go through PgBouncer transaction pooling. Set MIGRATE_DATABASE_URL to the direct endpoint on
// Vercel when the runtime DATABASE_URL is the pooled one.
const MIGRATIONS_FOLDER = "lib/db/migrations";

const isPooledHost = (connectionString: string): boolean => {
  try {
    return new URL(connectionString).hostname.includes("-pooler");
  } catch {
    // Not a parseable URL — let the driver surface the real connection error later.
    return false;
  }
};

const main = async (): Promise<void> => {
  if (process.env.VERCEL_ENV !== "production") {
    console.log(
      `[migrate-deploy] VERCEL_ENV=${process.env.VERCEL_ENV ?? "(unset)"} — skipping (production only).`,
    );
    return;
  }

  const connectionString = process.env.MIGRATE_DATABASE_URL ?? process.env.DATABASE_URL;
  if (!connectionString) {
    console.error(
      "[migrate-deploy] Neither MIGRATE_DATABASE_URL nor DATABASE_URL is set — cannot migrate.",
    );
    process.exit(1);
  }

  if (!process.env.MIGRATE_DATABASE_URL && isPooledHost(connectionString)) {
    console.warn(
      "[migrate-deploy] DATABASE_URL points at a pooled (-pooler) endpoint and MIGRATE_DATABASE_URL " +
        "is unset. Migrations should run against the DIRECT endpoint (#149). Set MIGRATE_DATABASE_URL.",
    );
  }

  const pool = new Pool({ connectionString });
  try {
    console.log("[migrate-deploy] Applying pending migrations…");
    await migrate(drizzle(pool), { migrationsFolder: MIGRATIONS_FOLDER });
    console.log("[migrate-deploy] Migrations up to date.");
  } finally {
    await pool.end();
  }
};

main().catch((error: unknown) => {
  console.error("[migrate-deploy] Migration failed:", error);
  process.exit(1);
});
