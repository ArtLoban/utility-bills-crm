import { config } from "dotenv";

// Load .env.local before any module imports — ensures DATABASE_URL is set
// before db/client.ts Pool is instantiated.
config({ path: ".env.local" });

import { vi } from "vitest";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  updateTag: vi.fn(),
  // Identity: outside a Next request context unstable_cache has no cache to talk to,
  // and these suites test what the reader returns, not that it is cached. The caching
  // itself is verified against a running server, not here.
  unstable_cache: <T>(fn: T): T => fn,
}));

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));
