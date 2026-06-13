import type { NextConfig } from "next";
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

export default withNextIntl(nextConfig);
