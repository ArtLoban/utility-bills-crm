import { Info } from "lucide-react";
import { format, subDays } from "date-fns";

import type { TServiceType } from "@/lib/db/schema/service-types";

const T1_COLOR = "#f59e0b";
const T2_COLOR = "#6366f1";
const T3_COLOR = "#7c3aed";

type TTariffFormFields = {
  changeDate: string;
  setChangeDate: (v: string) => void;
  rateT1: string;
  setRateT1: (v: string) => void;
  rateT2: string;
  setRateT2: (v: string) => void;
  rateT3: string;
  setRateT3: (v: string) => void;
  fixedAmount: string;
  setFixedAmount: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
};

type TProps = { fields: TTariffFormFields; serviceType: TServiceType };

const inputStyle = (color?: string) => ({
  height: 34,
  padding: "0 52px 0 10px",
  fontSize: 13.5,
  borderRadius: 6,
  border: color ? `1.5px solid ${color}50` : "1px solid #e4e4e7",
  background: color ? color + "0C" : "transparent",
  fontFeatureSettings: '"tnum" 1',
  outline: "none",
  width: "100%",
});

const TariffForm = ({ fields, serviceType }: TProps) => {
  const isMetered = serviceType.measurementType === "metered";
  const supportsZones = serviceType.supportsZones;
  const unit = serviceType.unit;
  const unitLabel = unit === "kwh" ? "kWh" : unit === "m3" ? "m³" : unit === "gcal" ? "Gcal" : "";

  const closingDate = fields.changeDate
    ? format(subDays(new Date(fields.changeDate), 1), "MMM d, yyyy")
    : null;
  const openingDate = fields.changeDate ? format(new Date(fields.changeDate), "MMM d, yyyy") : null;

  return (
    <div className="flex flex-col gap-4">
      {/* Effective date */}
      <div>
        <label
          className="mb-1.5 block text-zinc-950 dark:text-zinc-50"
          style={{ fontSize: 13.5, fontWeight: 500 }}
        >
          Effective from
        </label>
        <div className="relative">
          <input
            type="date"
            value={fields.changeDate}
            onChange={(e) => fields.setChangeDate(e.target.value)}
            className="w-full text-zinc-950 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            style={{
              height: 34,
              padding: "0 10px",
              fontSize: 13.5,
              borderRadius: 6,
              border: "1px solid #e4e4e7",
              outline: "none",
            }}
          />
        </div>
      </div>

      {/* Rate inputs — metered */}
      {isMetered && (
        <div>
          <label
            className="mb-2 block text-zinc-500 dark:text-zinc-400"
            style={{ fontSize: 13.5, fontWeight: 500 }}
          >
            New rates
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {/* T1 */}
            <div>
              <div
                className="mb-1 text-zinc-500 dark:text-zinc-400"
                style={{ fontSize: 12, fontWeight: 500 }}
              >
                T1 (day)
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.0001"
                  min="0"
                  placeholder="0.0000"
                  value={fields.rateT1}
                  onChange={(e) => fields.setRateT1(e.target.value)}
                  style={inputStyle(T1_COLOR)}
                />
                <span
                  className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-zinc-500"
                  style={{ fontSize: 12 }}
                >
                  ₴/{unitLabel}
                </span>
              </div>
            </div>

            {/* T2 */}
            {supportsZones && (
              <div>
                <div
                  className="mb-1 text-zinc-500 dark:text-zinc-400"
                  style={{ fontSize: 12, fontWeight: 500 }}
                >
                  T2 (night)
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="0.0001"
                    min="0"
                    placeholder="0.0000"
                    value={fields.rateT2}
                    onChange={(e) => fields.setRateT2(e.target.value)}
                    style={inputStyle(T2_COLOR)}
                  />
                  <span
                    className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-zinc-500"
                    style={{ fontSize: 12 }}
                  >
                    ₴/{unitLabel}
                  </span>
                </div>
              </div>
            )}

            {/* T3 */}
            {supportsZones && (
              <div>
                <div
                  className="mb-1 text-zinc-500 dark:text-zinc-400"
                  style={{ fontSize: 12, fontWeight: 500 }}
                >
                  T3 (peak)
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="0.0001"
                    min="0"
                    placeholder="0.0000"
                    value={fields.rateT3}
                    onChange={(e) => fields.setRateT3(e.target.value)}
                    style={inputStyle(T3_COLOR)}
                  />
                  <span
                    className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-zinc-500"
                    style={{ fontSize: 12 }}
                  >
                    ₴/{unitLabel}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fixed amount */}
      {!isMetered && (
        <div>
          <label
            className="mb-1.5 block text-zinc-950 dark:text-zinc-50"
            style={{ fontSize: 13.5, fontWeight: 500 }}
          >
            Monthly amount
          </label>
          <div className="relative" style={{ maxWidth: 160 }}>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={fields.fixedAmount}
              onChange={(e) => fields.setFixedAmount(e.target.value)}
              style={{
                height: 34,
                padding: "0 42px 0 10px",
                fontSize: 13.5,
                borderRadius: 6,
                border: "1px solid #e4e4e7",
                outline: "none",
                fontFeatureSettings: '"tnum" 1',
                width: "100%",
              }}
            />
            <span
              className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-zinc-500"
              style={{ fontSize: 12 }}
            >
              ₴/mo
            </span>
          </div>
        </div>
      )}

      {/* Notes */}
      <div>
        <label
          className="mb-1.5 block text-zinc-500 dark:text-zinc-400"
          style={{ fontSize: 13, fontWeight: 500 }}
        >
          Notes (optional)
        </label>
        <textarea
          value={fields.notes}
          onChange={(e) => fields.setNotes(e.target.value)}
          rows={2}
          className="w-full resize-none text-zinc-950 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
          style={{
            padding: "8px 10px",
            fontSize: 13,
            borderRadius: 6,
            border: "1px solid #e4e4e7",
            outline: "none",
          }}
        />
      </div>

      {/* Info callout */}
      {closingDate && openingDate && (
        <div
          className="flex items-start gap-2.5 rounded-[8px] border border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-950/20"
          style={{ padding: "12px 14px" }}
        >
          <Info size={15} className="mt-px shrink-0 text-blue-500 dark:text-blue-400" />
          <p
            className="text-blue-800 dark:text-blue-300"
            style={{ fontSize: 12.5, margin: 0, lineHeight: 1.5 }}
          >
            The current tariff will be closed on <strong>{closingDate}</strong>. New tariff applies
            from <strong>{openingDate}</strong>.
          </p>
        </div>
      )}
    </div>
  );
};

export { TariffForm };
