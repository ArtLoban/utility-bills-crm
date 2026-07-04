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
import { useServiceLabel } from "@/features/services/hooks/use-service-label";
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
  const tRow = useTranslations("properties.detail.row");
  const resolveLabel = useServiceLabel();
  const locale = useLocale();

  const code = serviceType.code as TServiceTypeCode;
  const { color, Icon } = getServiceTypeVisuals(code);
  const name = resolveLabel({ name: service.name, code });

  const readingPart = METERED_SERVICE_CODES.has(code)
    ? lastReadingAt
      ? tRow("lastReading", { date: format(lastReadingAt, DISPLAY_DATE_FORMAT) })
      : tRow("noReadings")
    : tRow("noMeter");
  const secondary = [providerName, readingPart].filter(Boolean).join(" · ");

  return (
    <Link
      href={`/properties/${propertyId}/services/${service.id}`}
      className={`group hover:bg-muted flex items-center gap-4 px-6 py-4.5 no-underline transition-colors duration-100 ${!isLast ? "border-border border-b" : ""}`}
    >
      <IconBadge icon={Icon} color={color} />

      <div className="min-w-0 flex-1">
        <p className="text-foreground mb-0.5 text-sm font-semibold">{name}</p>
        <p className="text-muted-foreground truncate text-xs">{secondary}</p>
      </div>

      <p
        className={`shrink-0 text-base font-semibold tabular-nums ${
          balance === null
            ? "text-muted-foreground"
            : balance.balance > 0
              ? "text-destructive"
              : balance.balance < 0
                ? "text-success"
                : "text-muted-foreground"
        }`}
      >
        {balance === null ? "—" : formatBalance(balance.balance, locale)}
      </p>

      <ChevronRight
        size={16}
        strokeWidth={2}
        className="text-muted-foreground group-hover:text-primary shrink-0"
      />
    </Link>
  );
};

export { ServiceRow };
