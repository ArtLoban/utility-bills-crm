// Driver isolation point — switching to Neon touches only this file:
//   import { neon } from "@neondatabase/serverless";
//   import { drizzle } from "drizzle-orm/neon-http";
//   export const db = drizzle(neon(process.env.DATABASE_URL!), { schema });
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const db = drizzle(pool, { schema });
export type DB = typeof db;
