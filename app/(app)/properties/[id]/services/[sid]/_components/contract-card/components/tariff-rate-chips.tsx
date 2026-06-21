import { getTranslations } from "next-intl/server";

import { FIXED_RATE_COLOR_VAR, UNIT_LABELS, ZONE_COLOR_VARS } from "@/lib/constants/zones";
import type { TTariff } from "@/lib/db/schema/tariffs";
import type { TServiceTypeUnit } from "@/lib/db/schema/service-types";

type TRateChip = { label: string; value: string; unit: string; color: string };
type TProps = { tariff: TTariff; serviceUnit: TServiceTypeUnit | null };

export const TariffRateChips = async ({ tariff, serviceUnit }: TProps) => {
  const t = await getTranslations("services.detail.contract.rates");
  const perUnit = t("perUnit", { unit: serviceUnit ? UNIT_LABELS[serviceUnit] : "" });

  const chips: TRateChip[] =
    tariff.fixedAmount !== null
      ? [
          {
            label: t("fixed"),
            value: tariff.fixedAmount,
            unit: t("perMonth"),
            color: FIXED_RATE_COLOR_VAR,
          },
        ]
      : [
          tariff.rateT1 && {
            label: t("t1"),
            value: tariff.rateT1,
            unit: perUnit,
            color: ZONE_COLOR_VARS[0],
          },
          tariff.rateT2 && {
            label: t("t2"),
            value: tariff.rateT2,
            unit: perUnit,
            color: ZONE_COLOR_VARS[1],
          },
          tariff.rateT3 && {
            label: t("t3"),
            value: tariff.rateT3,
            unit: perUnit,
            color: ZONE_COLOR_VARS[2],
          },
        ].filter((chip): chip is TRateChip => Boolean(chip));

  return (
    <div className="flex flex-wrap gap-2.5">
      {chips.map((chip) => (
        <div
          key={chip.label}
          className="flex flex-1 flex-col rounded-lg px-3 py-2.5"
          style={{
            background: `color-mix(in srgb, ${chip.color} 6%, transparent)`,
            border: `1px solid color-mix(in srgb, ${chip.color} 25%, transparent)`,
          }}
        >
          <span className="text-muted-foreground text-xs">{chip.label}</span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold tabular-nums" style={{ color: chip.color }}>
              {chip.value}
            </span>
            <span className="text-muted-foreground text-xs">{chip.unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
