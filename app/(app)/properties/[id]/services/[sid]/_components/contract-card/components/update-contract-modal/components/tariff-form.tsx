import { Calendar, Info } from "lucide-react";

const T1_COLOR = "#f59e0b";
const T2_COLOR = "#6366f1";

const TariffForm = () => (
  <div className="flex flex-col gap-4">
    {/* Effective date */}
    <div>
      <label
        className="mb-1.5 block text-zinc-950 dark:text-zinc-50"
        style={{ fontSize: 13.5, fontWeight: 500 }}
      >
        Effective date
      </label>
      <div className="relative">
        {/* devnote: replace defaultValue inputs with controlled state when form submission is wired */}
        <input
          type="text"
          defaultValue="Nov 1, 2025"
          className="w-full text-zinc-950 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
          style={{
            height: 34,
            padding: "0 34px 0 10px",
            fontSize: 13.5,
            borderRadius: 6,
            border: "1px solid #e4e4e7",
            outline: "none",
          }}
        />
        <Calendar
          size={14}
          className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-zinc-500 dark:text-zinc-400"
        />
      </div>
    </div>

    {/* New rates */}
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
              type="text"
              defaultValue="4.32"
              className="w-full"
              style={{
                height: 34,
                padding: "0 52px 0 10px",
                fontSize: 13.5,
                borderRadius: 6,
                border: `1.5px solid ${T1_COLOR}50`,
                background: T1_COLOR + "0C",
                fontFeatureSettings: '"tnum" 1',
                outline: "none",
              }}
            />
            <span
              className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-zinc-500"
              style={{ fontSize: 12 }}
            >
              ₴/kWh
            </span>
          </div>
        </div>

        {/* T2 */}
        <div>
          <div
            className="mb-1 text-zinc-500 dark:text-zinc-400"
            style={{ fontSize: 12, fontWeight: 500 }}
          >
            T2 (night)
          </div>
          <div className="relative">
            <input
              type="text"
              defaultValue="2.16"
              className="w-full"
              style={{
                height: 34,
                padding: "0 52px 0 10px",
                fontSize: 13.5,
                borderRadius: 6,
                border: `1.5px solid ${T2_COLOR}50`,
                background: T2_COLOR + "0C",
                fontFeatureSettings: '"tnum" 1',
                outline: "none",
              }}
            />
            <span
              className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-zinc-500"
              style={{ fontSize: 12 }}
            >
              ₴/kWh
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* Info callout */}
    <div
      className="flex items-start gap-2.5 rounded-[8px] border border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-950/20"
      style={{ padding: "12px 14px" }}
    >
      <Info size={15} className="mt-px shrink-0 text-blue-500 dark:text-blue-400" />
      <p
        className="text-blue-800 dark:text-blue-300"
        style={{ fontSize: 12.5, margin: 0, lineHeight: 1.5 }}
      >
        The current tariff will be closed on <strong>Oct 31, 2025</strong>. New tariff will apply
        from <strong>Nov 1, 2025</strong> onwards. All existing readings and bills remain unchanged.
      </p>
    </div>
  </div>
);

export { TariffForm };
