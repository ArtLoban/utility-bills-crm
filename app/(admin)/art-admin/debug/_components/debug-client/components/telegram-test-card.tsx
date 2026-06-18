"use client";

import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { TTelegramLinkStatus } from "@/features/notifications";
import { ROUTES } from "@/lib/routes";

import { sendTestTelegramDigest } from "../../../actions";
import { CODE_CLASS } from "../constants";

type TProps = {
  status: TTelegramLinkStatus;
};

export const TelegramTestCard = ({ status }: TProps) => {
  const [isPending, startTransition] = useTransition();

  const handleSend = () => {
    startTransition(async () => {
      const result = await sendTestTelegramDigest();
      if (result.ok) toast.success("Sample digest sent — check your Telegram");
      else toast.error(result.error);
    });
  };

  return (
    <Card className="gap-3">
      <CardHeader>
        <CardTitle>Send sample digest</CardTitle>
        <CardDescription className="leading-relaxed">
          Sends one reminder digest — the same format and localization the daily cron delivers — to
          your own linked Telegram chat. Verifies the bot send path end-to-end without waiting for
          the schedule. Only sent when <code className={CODE_CLASS}>TELEGRAM_BOT_TOKEN</code> is
          configured.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {status.connected ? (
          <p className="text-muted-foreground text-sm">
            Connected{status.label ? ` as ${status.label}` : ""}
          </p>
        ) : (
          <p className="text-muted-foreground text-sm">
            Not linked —{" "}
            <Link href={ROUTES.settings} className="text-foreground underline underline-offset-4">
              connect Telegram in Settings
            </Link>
          </p>
        )}
        <Button size="lg" onClick={handleSend} disabled={!status.connected || isPending}>
          Send sample digest to me
        </Button>
      </CardContent>
    </Card>
  );
};
