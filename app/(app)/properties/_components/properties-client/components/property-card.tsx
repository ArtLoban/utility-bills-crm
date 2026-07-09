import Link from "next/link";
import { ChevronRight, Users } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { TPropertyListItem } from "@/app/(app)/properties/_data/queries";
import { PROPERTY_ROLES } from "@/lib/db/schema/properties";
import { PROPERTY_TYPE_ICONS } from "@/features/properties/property-type";
import { formatBalance } from "@/features/ledger";
import { IconBadge } from "@/components/icon-badge";
import { Surface } from "@/components/surface";
import { ROUTES } from "@/lib/routes";

type TProps = {
  property: TPropertyListItem;
};

export const PropertyCard = ({ property }: TProps) => {
  const t = useTranslations("properties");
  const locale = useLocale();
  const Icon = PROPERTY_TYPE_ICONS[property.type];
  const isShared = property.role !== PROPERTY_ROLES.OWNER;
  const { balance } = property.balance;

  return (
    <Surface asChild elevation="hover" className="group block px-4 py-6 md:px-6">
      <Link href={`${ROUTES.properties}/${property.id}`}>
        <div className="flex items-start gap-3">
          <IconBadge icon={Icon} color="var(--brand)" border />

          <div className="min-w-0">
            <p className="text-foreground overflow-hidden text-sm font-semibold tracking-[-0.2px] text-ellipsis whitespace-nowrap">
              {property.name}
            </p>
            {property.address && (
              <p className="text-muted-foreground mt-0.5 text-xs">{property.address}</p>
            )}
          </div>
        </div>

        <div className="border-border mt-4 flex items-center gap-2.5 border-t pt-4">
          <span className="text-muted-foreground text-xs">
            {t("card.services", { count: property.serviceCount })}
          </span>

          {isShared && (
            <>
              <span className="text-border">·</span>

              <span className="bg-muted text-foreground flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium">
                <Users size={11} className="text-muted-foreground" />
                {t("card.shared")}
              </span>

              <span className="text-muted-foreground text-xs">
                · {t("card.role")}:{" "}
                <span className="text-foreground font-medium">
                  {t(`card.roles.${property.role}`)}
                </span>
              </span>
            </>
          )}
        </div>

        <div className="border-border mt-4 flex items-end justify-between border-t pt-4">
          <div>
            <p className="text-muted-foreground mb-1 text-xs font-medium tracking-[0.3px] uppercase">
              {t("card.balance")}
            </p>
            <p
              className={`text-xl font-semibold tracking-[-0.4px] tabular-nums ${
                balance > 0
                  ? "text-destructive"
                  : balance < 0
                    ? "text-success"
                    : "text-muted-foreground"
              }`}
            >
              {formatBalance(balance, locale)}
            </p>
          </div>

          <div className="text-muted-foreground group-hover:text-brand flex items-center gap-0.5">
            <span className="text-sm font-medium">{t("card.open")}</span>
            <ChevronRight size={14} strokeWidth={2} />
          </div>
        </div>
      </Link>
    </Surface>
  );
};
