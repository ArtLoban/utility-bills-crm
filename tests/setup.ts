import { config } from "dotenv";

// Load .env.local before any module imports — ensures DATABASE_URL is set
// before db/client.ts Pool is instantiated.
config({ path: ".env.local" });

import { vi } from "vitest";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));
