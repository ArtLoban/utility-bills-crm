import { deliverDueReminders } from "@/features/notifications";
import { logger } from "@/lib/logger";
import { runWithCorrelationId } from "@/lib/logger/correlation-context";

// Node runtime: the delivery job uses the `pg` driver, which is not edge-compatible.
export const runtime = "nodejs";
// Never cache or statically optimize — this is a side-effecting, secret-gated job endpoint.
export const dynamic = "force-dynamic";

// Daily reminder-digest cron, invoked by Vercel Cron (see vercel.json).
//
// Deliberate, scoped exception to "GET routes are side-effect-free": Vercel invokes crons with
// GET + `Authorization: Bearer ${CRON_SECRET}`. This endpoint is not a navigable page — it is
// unlinked, non-prefetchable, and gated by a shared secret — so the usual reason for the rule
// (a prefetch/crawl triggering a mutation) does not apply. Any request without the matching
// secret is rejected; a missing secret fails closed.
// No proxy-forwarded header reaches this route (the proxy matcher excludes /api/*),
// and cron has no upstream request — so the correlation id is generated at entry.
export const GET = async (request: Request): Promise<Response> =>
  runWithCorrelationId(crypto.randomUUID(), async () => {
    const secret = process.env.CRON_SECRET;
    const authorized =
      Boolean(secret) && request.headers.get("authorization") === `Bearer ${secret}`;

    if (!authorized) {
      return new Response("Unauthorized", { status: 401 });
    }

    const summary = await deliverDueReminders();
    logger.info(summary, "reminder digest cron completed");

    return Response.json(summary);
  });
