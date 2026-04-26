import { type NextRequest, NextResponse } from "next/server";

// Auth.js uses different cookie names depending on protocol:
// HTTP (dev)  → authjs.session-token
// HTTPS (prod) → __Secure-authjs.session-token
//
// This only checks cookie *presence*, not validity — the pg driver is
// incompatible with Edge Runtime so a full DB lookup isn't possible here.
// Real session validation happens in server components via auth().
const getSessionToken = (req: NextRequest) =>
  req.cookies.get("authjs.session-token") ?? req.cookies.get("__Secure-authjs.session-token");

export const middleware = (req: NextRequest) => {
  if (!getSessionToken(req)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
};

export const config = {
  matcher: ["/dashboard/:path*"],
};
