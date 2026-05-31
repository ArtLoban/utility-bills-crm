"use client";

import { useTranslations } from "next-intl";

type TProps = { total: number };

export const FooterMeta = ({ total }: TProps) => {
  const t = useTranslations("adminProperties");
  return (
    <span className="text-muted-foreground text-sm tabular-nums">
      {t("footer.properties", { count: total })}
    </span>
  );
};
