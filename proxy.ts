import { type NextRequest, NextResponse } from "next/server";
import { CORRELATION_ID_HEADER } from "@/lib/logger/constants";

// Auth.js uses different cookie names depending on protocol:
// HTTP (dev)  → authjs.session-token
// HTTPS (prod) → __Secure-authjs.session-token
//
// This only checks cookie *presence*, not validity — the pg driver is
// incompatible with Edge Runtime so a full DB lookup isn't possible here.
// Real session validation happens in server components via auth().
const getSessionToken = (req: NextRequest) =>
  req.cookies.get("authjs.session-token") ?? req.cookies.get("__Secure-authjs.session-token");

export const proxy = (req: NextRequest) => {
  if (!getSessionToken(req)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // crypto.randomUUID() is available in Edge Runtime.
  // We forward the ID on the *request* headers so server components can read it
  // via headers() from next/headers, and on the *response* headers for clients.
  const correlationId = crypto.randomUUID();

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set(CORRELATION_ID_HEADER, correlationId);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set(CORRELATION_ID_HEADER, correlationId);

  return response;
};

export const config = {
  matcher: ["/dashboard/:path*"],
};
