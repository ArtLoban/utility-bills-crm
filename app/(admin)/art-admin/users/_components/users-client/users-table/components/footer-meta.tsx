"use client";

import { useTranslations } from "next-intl";

type TProps = {
  total: number;
};

export const FooterMeta = ({ total }: TProps) => {
  const t = useTranslations("adminUsers");

  return (
    <span className="text-muted-foreground text-sm tabular-nums">
      {t("footer.users", { count: total })}
    </span>
  );
};
