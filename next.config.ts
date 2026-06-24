import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

// Extra origins allowed for Next.js dev cross-origin requests (e.g. a LAN IP for testing
// on a phone). Dev-only and machine-specific, so it lives in env, not in source.
const devAllowedOrigins = (process.env.DEV_ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  serverExternalPackages: ["pino", "pino-pretty"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "lh3.googleusercontent.com" }],
  },
  ...(devAllowedOrigins.length > 0 && { allowedDevOrigins: devAllowedOrigins }),
};

// Sentry wraps the config to upload source maps on the production build and to
// instrument the SDK. Source-map upload runs only when SENTRY_AUTH_TOKEN (+ org/
// project) are set — local/preview builds without them skip upload gracefully.
export default withSentryConfig(withNextIntl(nextConfig), {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  // authToken is read from SENTRY_AUTH_TOKEN automatically.
  silent: !process.env.CI,
  widenClientFileUpload: true,
  webpack: {
    treeshake: {
      removeDebugLogging: true,
    },
  },
});
