"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { SeverityLevel } from "@sentry/nextjs";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { TTelegramLinkStatus } from "@/features/notifications";

import { captureServerException, triggerServerError } from "../../actions";
import { TelegramTestCard } from "./components/telegram-test-card";
import { TriggerCard } from "./components/trigger-card";
import { CODE_CLASS, DEFAULT_DEBUG_MESSAGE, SENTRY_LEVELS } from "./constants";

type TProps = {
  telegramStatus: TTelegramLinkStatus;
};

export const DebugClient = ({ telegramStatus }: TProps) => {
  const [message, setMessage] = useState(DEFAULT_DEBUG_MESSAGE);
  const [level, setLevel] = useState<SeverityLevel>("error");
  const [tagKey, setTagKey] = useState("");
  const [tagValue, setTagValue] = useState("");
  const [isPending, startTransition] = useTransition();

  const effectiveMessage = message.trim() || DEFAULT_DEBUG_MESSAGE;

  const handleClientThrow = () => {
    // Uncaught error in a browser event handler — React does not catch it, so it
    // reaches window.onerror and the client Sentry SDK captures it.
    throw new Error(effectiveMessage);
  };

  const handleServerThrow = () => {
    startTransition(async () => {
      try {
        await triggerServerError(effectiveMessage);
      } catch {
        // The thrown server error rejects the action — expected. It is already
        // captured by onRequestError before the rejection reaches us.
        toast.success("Server error thrown — check Sentry (look for the correlationId tag)");
      }
    });
  };

  const handleCapture = () => {
    startTransition(async () => {
      const result = await captureServerException({
        message: effectiveMessage,
        level,
        tagKey: tagKey.trim() || undefined,
        tagValue: tagValue.trim() || undefined,
      });
      if (result.ok) {
        toast.success(`Exception captured (level: ${level}) — check Sentry`);
      } else {
        toast.error("Failed to capture exception");
      }
    });
  };

  return (
    <div className="space-y-10">
      <section className="space-y-6">
        <h2 className="text-muted-foreground text-sm font-medium">Error monitoring</h2>

        <Card>
          <CardHeader>
            <CardTitle>Customize</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="debug-message">Error message</Label>
              <Input
                id="debug-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={DEFAULT_DEBUG_MESSAGE}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="debug-level">Level (captured only)</Label>
              <Select value={level} onValueChange={(value) => setLevel(value as SeverityLevel)}>
                <SelectTrigger id="debug-level" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SENTRY_LEVELS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label htmlFor="debug-tag-key">Tag key (captured only)</Label>
                <Input
                  id="debug-tag-key"
                  value={tagKey}
                  onChange={(e) => setTagKey(e.target.value)}
                  placeholder="feature"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="debug-tag-value">Tag value</Label>
                <Input
                  id="debug-tag-value"
                  value={tagValue}
                  onChange={(e) => setTagValue(e.target.value)}
                  placeholder="billing"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-3">
          <TriggerCard
            title="Throw client error"
            variant="destructive"
            buttonLabel="Throw in browser"
            pending={isPending}
            onTrigger={handleClientThrow}
            description={
              <>
                Throws an uncaught error in the browser. Caught by the client Sentry SDK (
                <code className={CODE_CLASS}>instrumentation-client.ts</code>). Verifies client-side
                capture. No correlation id (the browser has no request context).
              </>
            }
          />

          <TriggerCard
            title="Throw server error"
            variant="destructive"
            buttonLabel="Throw on server"
            pending={isPending}
            onTrigger={handleServerThrow}
            description={
              <>
                A Server Action throws an uncaught error. Caught by{" "}
                <code className={CODE_CLASS}>onRequestError</code> in{" "}
                <code className={CODE_CLASS}>instrumentation.ts</code>, which tags the event with
                the <code className={CODE_CLASS}>correlationId</code> read from the proxy-forwarded{" "}
                <code className={CODE_CLASS}>x-correlation-id</code> header. Verifies the
                header-based correlation bridge.
              </>
            }
          />

          <TriggerCard
            title="Capture exception"
            variant="secondary"
            buttonLabel="Capture (no throw)"
            pending={isPending}
            onTrigger={handleCapture}
            description={
              <>
                A Server Action calls <code className={CODE_CLASS}>Sentry.captureException</code>{" "}
                inside an ALS scope, so the server <code className={CODE_CLASS}>beforeSend</code>{" "}
                tags it with the <code className={CODE_CLASS}>correlationId</code> and a matching{" "}
                <code className={CODE_CLASS}>logger.error</code> line is emitted. Uses the level and
                optional tag above, and attaches fake PII (email/amount/account) that must appear{" "}
                <code className={CODE_CLASS}>[REDACTED]</code> in Sentry.
              </>
            }
          />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-muted-foreground text-sm font-medium">Notifications</h2>

        <TelegramTestCard status={telegramStatus} />
      </section>
    </div>
  );
};
