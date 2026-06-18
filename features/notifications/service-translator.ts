import { createTranslator } from "next-intl";

import { SERVICE_TYPE_CODES } from "@/features/services/service-type";
import type { TLocale } from "@/lib/locale/constants";

import type { TTranslateService } from "./digest";

// Builds a service-name translator bound to a single locale, with no request-based negotiation:
// createTranslator is the explicit-locale core translator. The labels are precomputed from the
// known service-type codes (typed literals) so the digest's string-keyed lookup stays type-safe.
// Lives in its own module (not digest.ts, which is deliberately pure/locale-agnostic) so both the
// cron delivery pass and the admin sample-digest tool can render in a chosen locale.
export const serviceTranslatorFor = async (locale: TLocale): Promise<TTranslateService> => {
  // Relative (not `@/`) specifier: a template-literal dynamic import needs a statically
  // resolvable directory for the bundler to build the import context — the same form the
  // next-intl request loader uses (i18n/request.ts).
  const messages = (await import(`../../messages/${locale}.json`)).default;
  const t = createTranslator({ locale, messages, namespace: "services.types" });

  const labels: Record<string, string> = Object.fromEntries(
    Object.values(SERVICE_TYPE_CODES).map((code) => [code, t(code)]),
  );

  return (code) => labels[code] ?? code;
};
