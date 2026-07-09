"use client";

import type { ReactNode } from "react";
import { Check, Send } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

import { SettingsCard, SettingsCardBody, SettingsCardHeader } from "../settings-card";
import { useTelegramLink } from "./hooks/use-telegram-link";

type TProps = {
  initialConnected: boolean;
  initialLabel: string | null;
};

export const TelegramSection = ({ initialConnected, initialLabel }: TProps) => {
  const t = useTranslations("settings.telegram");
  const { connected, label, deepLink, isStarting, isDisconnecting, connect, disconnect } =
    useTelegramLink({ initialConnected, initialLabel });

  // Three mutually exclusive states; selected with if/else rather than a nested ternary, and kept
  // inline rather than split into three trivial subcomponents (rules: don't over-extract).
  let body: ReactNode;
  if (connected) {
    body = (
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Check className="text-success size-4" />
          <span className="text-foreground text-sm font-medium">
            {label ? t("connected.statusAs", { label }) : t("connected.status")}
          </span>
        </div>
        <Button variant="outline" size="lg" onClick={disconnect} disabled={isDisconnecting}>
          {t("connected.disconnect")}
        </Button>
      </div>
    );
  } else if (deepLink) {
    body = (
      <div className="flex flex-col gap-3">
        <p className="text-muted-foreground text-sm leading-relaxed">{t("pending.instruction")}</p>
        <div className="flex items-center gap-3">
          <Button asChild size="lg">
            <a href={deepLink} target="_blank" rel="noopener noreferrer">
              <Send className="size-4" />
              {t("pending.open")}
            </a>
          </Button>
          <span className="text-muted-foreground text-sm">{t("pending.waiting")}</span>
        </div>
      </div>
    );
  } else {
    body = (
      <div className="flex flex-col gap-3">
        <p className="text-muted-foreground text-sm leading-relaxed">{t("notConnected.hint")}</p>
        <Button size="lg" onClick={connect} disabled={isStarting} className="self-start">
          <Send className="size-4" />
          {t("notConnected.connect")}
        </Button>
      </div>
    );
  }

  return (
    <SettingsCard>
      <SettingsCardHeader title={t("title")} description={t("description")} />
      <SettingsCardBody>{body}</SettingsCardBody>
    </SettingsCard>
  );
};
