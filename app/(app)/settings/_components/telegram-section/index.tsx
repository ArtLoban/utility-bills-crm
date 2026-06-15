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

const TelegramSection = ({ initialConnected, initialLabel }: TProps) => {
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
          <Check className="size-4 text-emerald-600 dark:text-emerald-500" />
          <span className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
            {label ? t("connected.statusAs", { label }) : t("connected.status")}
          </span>
        </div>
        <Button
          variant="outline"
          onClick={disconnect}
          disabled={isDisconnecting}
          style={{ height: 36 }}
        >
          {t("connected.disconnect")}
        </Button>
      </div>
    );
  } else if (deepLink) {
    body = (
      <div className="flex flex-col gap-3">
        <p className="text-sm leading-[1.6] text-zinc-500 dark:text-zinc-400">
          {t("pending.instruction")}
        </p>
        <div className="flex items-center gap-3">
          <Button asChild style={{ height: 36 }}>
            <a href={deepLink} target="_blank" rel="noopener noreferrer">
              <Send className="size-4" />
              {t("pending.open")}
            </a>
          </Button>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">{t("pending.waiting")}</span>
        </div>
      </div>
    );
  } else {
    body = (
      <div className="flex flex-col gap-3">
        <p className="text-sm leading-[1.6] text-zinc-500 dark:text-zinc-400">
          {t("notConnected.hint")}
        </p>
        <Button
          onClick={connect}
          disabled={isStarting}
          style={{ height: 36, alignSelf: "flex-start" }}
        >
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

export { TelegramSection };
