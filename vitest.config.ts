import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    setupFiles: ["./tests/setup.ts"],
    // Vitest's default `include` matches *.spec.ts, which collides with Playwright's
    // testDir (./e2e). Without this, vitest tries to execute a Playwright spec and the
    // whole run fails on it — keep e2e out of the unit run, it belongs to `playwright test`.
    exclude: ["**/node_modules/**", "**/e2e/**"],
    // Integration tests share one real database — parallel file execution causes
    // global-count assertions to race against fixtures from concurrent test files.
    // Sequential execution (maxWorkers: 1) is the correct baseline for DB integration tests.
    maxWorkers: 1,
  },
});
