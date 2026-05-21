// Edge runtime: pino is NOT available here.
// Correlation ID is generated here and propagated via request/response headers.
// Node-side code (Server Components, Server Actions) reads it via getCorrelationId().
//
// Future: Auth.js middleware (auth() from @/lib/auth) will be integrated here in Step 1.
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { CORRELATION_ID_HEADER } from "@/lib/logger/constants";

export function middleware(request: NextRequest) {
  // Pass through an existing header (e.g. from an upstream proxy) to support
  // infrastructure-level tracing; otherwise generate a new ID for this request.
  const correlationId = request.headers.get(CORRELATION_ID_HEADER) ?? crypto.randomUUID();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(CORRELATION_ID_HEADER, correlationId);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set(CORRELATION_ID_HEADER, correlationId);
  return response;
}

export const config = {
  matcher: [
    // All routes except Next.js internals and static files.
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
