import { getLocale, getTranslations } from "next-intl/server";
import { parseISO } from "date-fns";

import { InfoGrid } from "@/components/info-grid";
import type { TInfoRow } from "@/components/info-grid/types";
import { NotesCard } from "@/components/notes-card";
import { Surface } from "@/components/surface";
import { IconBadge } from "@/components/icon-badge";
import { formatMoney } from "@/lib/format/money";
import { formatDisplayDate } from "@/lib/format/date";
import { getServiceTypeVisuals } from "@/features/services/service-type";
import { PropertyIdentity } from "@/features/properties/components/property-identity";
import type { TPaymentGlobalRow } from "@/features/payments/types";

type TProps = {
  payment: TPaymentGlobalRow;
  serviceLabel: string;
};

export const PaymentDetail = async ({ payment, serviceLabel }: TProps) => {
  const { payment: record, serviceTypeCode, property } = payment;
  const [t, locale] = await Promise.all([getTranslations("payments.detail.fields"), getLocale()]);
  const { color, Icon } = getServiceTypeVisuals(serviceTypeCode);

  const rows: TInfoRow[] = [
    {
      label: t("property"),
      value: <PropertyIdentity name={property.name} type={property.type} />,
    },
    {
      label: t("paidAt"),
      value: formatDisplayDate(parseISO(record.paidAt)),
    },
    {
      label: t("createdAt"),
      value: formatDisplayDate(record.createdAt),
    },
  ];

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <Surface className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <IconBadge
              icon={Icon}
              color={color}
              size="lg"
              border
              className="max-sm:size-9 max-sm:[&>svg]:size-4.5"
            />
            <p className="text-foreground min-w-0 flex-1 truncate text-xl">{serviceLabel}</p>
          </div>
          <p className="text-success text-2xl font-semibold tracking-tight tabular-nums sm:ml-auto sm:shrink-0 sm:text-3xl">
            {formatMoney(record.amount, locale)}
          </p>
        </Surface>
        <Surface className="px-4 sm:px-5">
          <InfoGrid rows={rows} />
        </Surface>
      </div>
      <NotesCard notes={record.notes} />
    </div>
  );
};
