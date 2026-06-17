import Link from "next/link";
import { format } from "date-fns";
import { ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { IconBadge } from "@/components/icon-badge";
import type { TService } from "@/lib/db/schema/services";
import type { TServiceType } from "@/lib/db/schema/service-types";
import {
  getServiceTypeVisuals,
  METERED_SERVICE_CODES,
  TServiceTypeCode,
} from "@/features/services/service-type";
import { formatBalance } from "@/features/ledger";
import type { TBalance } from "@/features/ledger/types";
import { DISPLAY_DATE_FORMAT } from "@/lib/format/date";

type TProps = {
  service: TService;
  serviceType: TServiceType;
  providerName: string | null;
  propertyId: string;
  isLast: boolean;
  balance: TBalance | null;
  lastReadingAt: Date | null;
};

const ServiceRow = ({
  service,
  serviceType,
  providerName,
  propertyId,
  isLast,
  balance,
  lastReadingAt,
}: TProps) => {
  const tType = useTranslations("services.types");
  const tRow = useTranslations("properties.detail.row");
  const locale = useLocale();

  const code = serviceType.code as TServiceTypeCode;
  const { color, Icon } = getServiceTypeVisuals(code);
  const name = tType(code as Parameters<typeof tType>[0]);

  const readingPart = METERED_SERVICE_CODES.has(code)
    ? lastReadingAt
      ? tRow("lastReading", { date: format(lastReadingAt, DISPLAY_DATE_FORMAT) })
      : tRow("noReadings")
    : tRow("noMeter");
  const secondary = [providerName, readingPart].filter(Boolean).join(" · ");

  return (
    <Link
      href={`/properties/${propertyId}/services/${service.id}`}
      className={`group flex items-center gap-4 px-6 py-[18px] no-underline transition-colors duration-[120ms] hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${!isLast ? "border-b border-zinc-100 dark:border-zinc-800" : ""}`}
    >
      <IconBadge icon={Icon} color={color} />

      <div className="min-w-0 flex-1">
        <p className="mb-0.5 text-sm font-semibold text-zinc-950 dark:text-zinc-50">{name}</p>
        <p className="truncate text-xs text-zinc-500">{secondary}</p>
      </div>

      <p
        className={`shrink-0 text-base font-semibold tabular-nums ${
          balance === null
            ? "text-zinc-500"
            : balance.balance > 0
              ? "text-destructive"
              : balance.balance < 0
                ? "text-success"
                : "text-zinc-500"
        }`}
      >
        {balance === null ? "—" : formatBalance(balance.balance, locale)}
      </p>

      <ChevronRight
        size={16}
        strokeWidth={2}
        className="shrink-0 text-zinc-400 group-hover:text-violet-600"
      />
    </Link>
  );
};

export { ServiceRow };
