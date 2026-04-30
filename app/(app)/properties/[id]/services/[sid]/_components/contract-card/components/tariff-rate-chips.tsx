import type { TContractInfo } from "../../../_data/mock";

type TProps = { rates: TContractInfo["tariffRates"] };

const TariffRateChips = ({ rates }: TProps) => (
  <div className="flex gap-2.5">
    {rates.map((rate) => (
      <div
        key={rate.label}
        className="flex flex-1 flex-col"
        style={{
          padding: "12px 14px",
          borderRadius: 8,
          background: rate.color + "0F",
          border: `1px solid ${rate.color}25`,
        }}
      >
        <span
          className="text-zinc-500 dark:text-zinc-400"
          style={{ fontSize: 11.5, marginBottom: 4 }}
        >
          {rate.label}
        </span>
        <div className="flex items-baseline gap-1">
          <span
            style={{
              fontSize: 20,
              fontWeight: 700,
              fontFeatureSettings: '"tnum" 1',
              color: rate.color,
            }}
          >
            {rate.rate}
          </span>
          <span
            className="text-zinc-500 dark:text-zinc-400"
            style={{ fontSize: 12, fontWeight: 500 }}
          >
            {rate.unit}
          </span>
        </div>
      </div>
    ))}
  </div>
);

export { TariffRateChips };
