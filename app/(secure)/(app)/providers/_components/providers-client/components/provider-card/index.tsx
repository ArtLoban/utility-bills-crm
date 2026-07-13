"use client";

import { useTranslations } from "next-intl";

import { Surface } from "@/components/surface";
import { formatDisplayDate } from "@/lib/format/date";
import type { TProviderWithUsage } from "@/app/(secure)/(app)/providers/_data/queries";
import { ProviderMonogram } from "./components/provider-monogram";
import { ProviderContact } from "./components/provider-contact";
import { ProviderCardActions } from "./components/provider-card-actions";

type TProps = {
  provider: TProviderWithUsage;
};

export const ProviderCard = ({ provider }: TProps) => {
  const t = useTranslations("providers");
  const { id, name, phone, website, notes, usageCount, createdAt } = provider;

  return (
    <Surface className="flex flex-col gap-3 p-4 sm:px-5">
      <div className="flex items-start gap-4">
        <ProviderMonogram seed={id} letter={name.charAt(0)} />
        <div className="min-w-0 flex-1">
          <p className="text-md mb-1.5 leading-tight font-semibold tracking-tight">{name}</p>
          <ProviderContact phone={phone} website={website} />
          <p className="text-muted-foreground text-xs leading-none">
            {usageCount > 0 ? t("usage.used", { count: usageCount }) : t("usage.notInUse")}
          </p>
        </div>
        <ProviderCardActions provider={provider} />
      </div>
      {notes && <p className="text-muted-foreground m-0 text-sm leading-normal">{notes}</p>}
      <p className="text-muted-foreground mt-1 text-xs leading-none">
        {t("meta.created", { date: formatDisplayDate(createdAt) })}
      </p>
    </Surface>
  );
};
