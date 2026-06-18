import { headers } from "next/headers";

import { CORRELATION_ID_HEADER } from "./constants";
import { getCorrelationId } from "./correlation-context";

const FALLBACK = "no-correlation-id";

// Resolves the correlation id for code paths that are NOT wrapped in an ALS
// context — primarily RSC renders and Server Actions, where the id arrives only
// on the proxy-forwarded `x-correlation-id` request header. Prefers an active
// ALS id when one exists (e.g. a route handler that also reads headers).
//
// Async because reading request headers is async. Never throws: outside a request
// scope (static generation, tests) it falls back to a sentinel rather than failing
// the log call it feeds.
export const resolveCorrelationId = async (): Promise<string> => {
  const fromContext = getCorrelationId();
  if (fromContext) return fromContext;

  try {
    const headersList = await headers();
    return headersList.get(CORRELATION_ID_HEADER) ?? FALLBACK;
  } catch {
    return FALLBACK;
  }
};
