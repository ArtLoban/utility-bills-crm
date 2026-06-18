import {
  consumeStartToken,
  isValidWebhookSecret,
  parseStartCommand,
} from "@/features/notifications";
import { logger } from "@/lib/logger";
import { runWithCorrelationId } from "@/lib/logger/correlation-context";

// Node runtime: consumeStartToken uses the `pg` driver, which is not edge-compatible.
export const runtime = "nodejs";
// Never cache or statically optimize — this is a side-effecting, secret-gated inbound webhook.
export const dynamic = "force-dynamic";

// Public endpoint Telegram POSTs updates to (registered via the setWebhook script).
//
// Side-effecting POST is the contract here — this is an inbound webhook, not a navigable page.
// It is fail-closed on Telegram's secret-token header. Every other update — a non-/start message,
// or a /start whose token is unknown / expired / already consumed — is acknowledged with 200 and
// binds nothing, so Telegram does not retry and create pressure.
// Telegram does not forward our correlation header, and this route sits outside the
// proxy matcher — so the correlation id is generated at entry.
export const POST = async (request: Request): Promise<Response> =>
  runWithCorrelationId(crypto.randomUUID(), async () => {
    if (!isValidWebhookSecret(request)) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body: unknown = await request.json().catch(() => null);
    const start = parseStartCommand(body);

    if (start) {
      const bound = await consumeStartToken(start);
      logger.info({ chatId: start.chatId, bound }, "telegram /start processed");
    }

    return new Response("OK", { status: 200 });
  });
