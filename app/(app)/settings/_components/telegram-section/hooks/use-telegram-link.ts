"use client";

import { useEffect, useState, useTransition } from "react";

import {
  disconnectTelegram,
  getTelegramLinkStatus,
  startTelegramLink,
} from "@/features/notifications/linking-actions";
import { useActionErrorHandler } from "@/lib/hooks/use-action-error-handler";

// While a deep-link is pending, poll for the binding that arrives out-of-band via the webhook.
const POLL_INTERVAL_MS = 3000;

type TArgs = { initialConnected: boolean; initialLabel: string | null };

export const useTelegramLink = ({ initialConnected, initialLabel }: TArgs) => {
  const [connected, setConnected] = useState(initialConnected);
  const [label, setLabel] = useState(initialLabel);
  const [deepLink, setDeepLink] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [isStarting, startLinking] = useTransition();
  const [isDisconnecting, startDisconnecting] = useTransition();
  const handleError = useActionErrorHandler({});

  const connect = () =>
    startLinking(async () => {
      const result = await startTelegramLink();
      if (!result.ok) {
        handleError(result.error);
        return;
      }
      setDeepLink(result.value.deepLink);
      setExpiresAt(result.value.expiresAt);
    });

  const disconnect = () =>
    startDisconnecting(async () => {
      const result = await disconnectTelegram();
      if (!result.ok) {
        handleError(result.error);
        return;
      }
      setConnected(false);
      setLabel(null);
      setDeepLink(null);
      setExpiresAt(null);
    });

  useEffect(() => {
    if (!deepLink || connected) return;

    const stopAt = expiresAt ? new Date(expiresAt).getTime() : Infinity;

    const poll = async () => {
      if (Date.now() > stopAt) {
        // Token window closed before confirmation — drop back to the connect prompt.
        setDeepLink(null);
        setExpiresAt(null);
        return;
      }
      const status = await getTelegramLinkStatus();
      if (status.connected) {
        setConnected(true);
        setLabel(status.label);
        setDeepLink(null);
        setExpiresAt(null);
      }
    };

    const interval = setInterval(() => void poll(), POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [deepLink, connected, expiresAt]);

  return { connected, label, deepLink, isStarting, isDisconnecting, connect, disconnect };
};
