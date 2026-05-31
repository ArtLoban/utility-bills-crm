import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    setupFiles: ["./tests/setup.ts"],
    // Integration tests share one real database — parallel file execution causes
    // global-count assertions to race against fixtures from concurrent test files.
    // Sequential execution (maxWorkers: 1) is the correct baseline for DB integration tests.
    maxWorkers: 1,
  },
});
