import pino from "pino";
import pretty from "pino-pretty";

const isDev = process.env.NODE_ENV === "development";

// pino.transport() spawns a worker thread — its stdout is not captured by Next.js dev server.
// pino-pretty as a stream runs synchronously in the same thread, output reaches the console.
const stream = isDev
  ? pretty({ colorize: true, ignore: "pid,hostname", translateTime: "HH:MM:ss" })
  : undefined;

export const logger = pino({ level: isDev ? "debug" : "info" }, stream);

export const withCorrelationId = (correlationId: string) => logger.child({ correlationId });
