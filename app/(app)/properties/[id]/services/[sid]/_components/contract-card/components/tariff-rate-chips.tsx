import type { TTariff } from "@/lib/db/schema/tariffs";

const UNIT_LABELS: Record<string, string> = { kwh: "kWh", m3: "m³", gcal: "Gcal" };

type TRateChip = { label: string; value: string; unit: string; color: string };

const buildChips = (tariff: TTariff, serviceUnit: string | null): TRateChip[] => {
  const unitLabel = serviceUnit ? (UNIT_LABELS[serviceUnit] ?? serviceUnit) : "";

  if (tariff.fixedAmount !== null) {
    return [{ label: "Fixed", value: tariff.fixedAmount, unit: "₴/mo", color: "#10b981" }];
  }

  const chips: TRateChip[] = [];
  if (tariff.rateT1)
    chips.push({
      label: "T1 · Day",
      value: tariff.rateT1,
      unit: `₴/${unitLabel}`,
      color: "#f59e0b",
    });
  if (tariff.rateT2)
    chips.push({
      label: "T2 · Night",
      value: tariff.rateT2,
      unit: `₴/${unitLabel}`,
      color: "#6366f1",
    });
  if (tariff.rateT3)
    chips.push({
      label: "T3 · Peak",
      value: tariff.rateT3,
      unit: `₴/${unitLabel}`,
      color: "#7c3aed",
    });
  return chips;
};

type TProps = { tariff: TTariff; serviceUnit: string | null };

const TariffRateChips = ({ tariff, serviceUnit }: TProps) => {
  const chips = buildChips(tariff, serviceUnit);

  return (
    <div className="flex gap-2.5">
      {chips.map((chip) => (
        <div
          key={chip.label}
          className="flex flex-1 flex-col"
          style={{
            padding: "10px 12px",
            borderRadius: 8,
            background: chip.color + "0F",
            border: `1px solid ${chip.color}25`,
          }}
        >
          <span
            className="text-zinc-500 dark:text-zinc-400"
            style={{ fontSize: 11, marginBottom: 3 }}
          >
            {chip.label}
          </span>
          <div className="flex items-baseline gap-1">
            <span
              style={{
                fontSize: 17,
                fontWeight: 700,
                fontFeatureSettings: '"tnum" 1',
                color: chip.color,
              }}
            >
              {chip.value}
            </span>
            <span className="text-zinc-500 dark:text-zinc-400" style={{ fontSize: 11.5 }}>
              {chip.unit}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export { TariffRateChips };
