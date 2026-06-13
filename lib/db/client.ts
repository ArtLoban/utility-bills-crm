// Driver isolation point — switching to Neon's serverless WebSocket driver touches only this file:
//   import { Pool } from "@neondatabase/serverless";
//   import { drizzle } from "drizzle-orm/neon-serverless";
//   export const db = drizzle(new Pool({ connectionString: process.env.DATABASE_URL }), { schema });
// neon-http is NOT the path: it has no interactive transactions, which Server Actions and seed:demo rely on.
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const db = drizzle(pool, { schema });
export type DB = typeof db;
