"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { IconBadge } from "@/components/icon-badge";
import { getServiceTypeDisplay } from "@/lib/constants/service-types";
import type { TService } from "@/lib/db/schema/services";
import type { TServiceType } from "@/lib/db/schema/service-types";

type TProps = {
  service: TService;
  serviceType: TServiceType;
  propertyId: string;
  isLast: boolean;
};

const ServiceRow = ({ service, serviceType, propertyId, isLast }: TProps) => {
  const t = useTranslations("services.types");
  const { color, Icon } = getServiceTypeDisplay(serviceType.code);
  const name = t(serviceType.code as Parameters<typeof t>[0]);

  return (
    <Link
      href={`/properties/${propertyId}/services/${service.id}`}
      className={`group flex items-center gap-4 px-6 py-[18px] transition-colors duration-[120ms] hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${!isLast ? "border-b border-zinc-100 dark:border-zinc-800" : ""}`}
      style={{ textDecoration: "none" }}
    >
      <IconBadge icon={Icon} color={color} />

      <div className="min-w-0 flex-1">
        <p
          className="font-semibold text-zinc-950 dark:text-zinc-50"
          style={{ fontSize: 14.5, letterSpacing: -0.1, marginBottom: 2 }}
        >
          {name}
        </p>
        <p className="truncate text-zinc-500" style={{ fontSize: 12.5 }}>
          — · —
        </p>
      </div>

      <p className="shrink-0 font-semibold text-zinc-500 tabular-nums" style={{ fontSize: 15 }}>
        —
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
