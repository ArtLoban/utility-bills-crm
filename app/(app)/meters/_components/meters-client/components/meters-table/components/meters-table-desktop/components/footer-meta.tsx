"use client";

import { useTranslations } from "next-intl";

type TProps = {
  total: number;
  propertyCount: number;
  activeCount: number;
};

export const FooterMeta = ({ total, propertyCount, activeCount }: TProps) => {
  const t = useTranslations("meters.list");

  return (
    <span className="text-muted-foreground text-sm">
      {t("subtitle", { count: total, propertyCount })}
      <span className="px-1">·</span>
      {t("subtitleActive", { activeCount })}
    </span>
  );
};
