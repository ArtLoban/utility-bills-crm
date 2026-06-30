import { SERVICE_TYPE_COLORS, SERVICE_TYPE_CODES } from "@/features/services/service-type";

const NAV_ITEMS = ["Dashboard", "Properties", "Providers", "Meters", "Bills", "Payments"] as const;

const SERVICES = [
  {
    name: "Electricity",
    provider: "YASNO",
    color: SERVICE_TYPE_COLORS[SERVICE_TYPE_CODES.ELECTRICITY],
    balance: "−₴1,180",
    status: "Due in 3 days",
    statusColor: "var(--mockup-danger)",
  },
  {
    name: "Gas",
    provider: "Naftogaz",
    color: SERVICE_TYPE_COLORS[SERVICE_TYPE_CODES.GAS],
    balance: "−₴640",
    status: "Due in 12 days",
    statusColor: "var(--mockup-danger)",
  },
  {
    name: "Cold water",
    provider: "Kyivvodokanal",
    color: SERVICE_TYPE_COLORS[SERVICE_TYPE_CODES.COLD_WATER],
    balance: "+₴90",
    status: "Overpaid",
    statusColor: "var(--mockup-positive)",
  },
  {
    name: "Internet",
    provider: "Kyivstar",
    color: SERVICE_TYPE_COLORS[SERVICE_TYPE_CODES.INTERNET],
    balance: "₴0",
    status: "Settled",
    statusColor: "var(--mockup-muted-fg)",
  },
];

export const PropertyDetailMockup = () => {
  return (
    <div
      className="select-none"
      style={{ fontFamily: "Inter, -apple-system, sans-serif", background: "var(--mockup-bg)" }}
    >
      {/* Top navigation — Properties tab active */}
      <div
        className="flex h-12 items-center gap-1 px-5"
        style={{
          borderBottom: "1px solid var(--mockup-border)",
          background: "var(--mockup-frame-bg)",
        }}
      >
        <div className="mr-4 flex shrink-0 items-center gap-[7px]">
          <div
            className="size-5 shrink-0 rounded-[4px]"
            style={{ background: "var(--mockup-accent)" }}
          />
          <span
            className="text-xs font-semibold whitespace-nowrap"
            style={{ color: "var(--mockup-fg)" }}
          >
            Utility Bills CRM
          </span>
        </div>

        {NAV_ITEMS.map((label) => {
          const active = label === "Properties";
          return (
            <div
              key={label}
              className="rounded-[5px] px-[10px] py-1 text-[11px] whitespace-nowrap"
              style={{
                fontWeight: active ? 600 : 400,
                color: active ? "var(--mockup-fg)" : "var(--mockup-muted-fg)",
                background: active ? "var(--mockup-muted)" : "transparent",
              }}
            >
              {label}
            </div>
          );
        })}

        <div className="flex-1" />

        <div
          className="flex items-center gap-[5px] rounded-md px-[10px] py-1"
          style={{ border: "1px solid var(--mockup-border)", background: "var(--mockup-muted)" }}
        >
          <span className="text-[11px]" style={{ color: "var(--mockup-fg)" }}>
            Apartment · Kyiv
          </span>
          <span className="text-[9px]" style={{ color: "var(--mockup-muted-fg)" }}>
            ▾
          </span>
        </div>

        <div
          className="ml-1 flex size-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
          style={{ background: "var(--mockup-accent)" }}
        >
          A
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-5">
        {/* Breadcrumb */}
        <div
          className="mb-[14px] flex items-center gap-[5px] text-[10px]"
          style={{ color: "var(--mockup-muted-fg)" }}
        >
          <span>Properties</span>
          <span>/</span>
          <span className="font-medium" style={{ color: "var(--mockup-fg)" }}>
            Apartment · Kyiv
          </span>
        </div>

        {/* Page header */}
        <div className="mb-[18px] flex items-start justify-between">
          <div>
            <div className="mb-1 text-lg font-semibold" style={{ color: "var(--mockup-fg)" }}>
              Apartment · Kyiv
            </div>
            <div className="text-[10px]" style={{ color: "var(--mockup-muted-fg)" }}>
              Shevchenko St 14, Kyiv · <span style={{ color: "var(--mockup-accent)" }}>Owner</span>
            </div>
          </div>
          <div className="flex gap-[7px]">
            <div
              className="rounded-md px-3 py-[5px] text-[10px]"
              style={{
                background: "var(--mockup-muted)",
                border: "1px solid var(--mockup-border)",
                color: "var(--mockup-fg)",
              }}
            >
              Share
            </div>
            <div
              className="rounded-md px-3 py-[5px] text-[10px] font-medium text-white"
              style={{ background: "var(--mockup-accent)" }}
            >
              + Add service
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-4 flex" style={{ borderBottom: "1px solid var(--mockup-border)" }}>
          {(["Overview", "Meters", "Sharing"] as const).map((tab, i) => (
            <div
              key={tab}
              className="-mb-px px-[14px] py-[6px] text-[11px]"
              style={{
                fontWeight: i === 0 ? 500 : 400,
                color: i === 0 ? "var(--mockup-fg)" : "var(--mockup-muted-fg)",
                borderBottom: i === 0 ? "2px solid var(--mockup-accent)" : "2px solid transparent",
              }}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* Service rows */}
        <div className="flex flex-col gap-2">
          {SERVICES.map(({ name, provider, color, balance, status, statusColor }) => (
            <div
              key={name}
              className="flex items-center gap-3 rounded-lg px-[14px] py-3"
              style={{
                background: "var(--mockup-card)",
                border: "1px solid var(--mockup-border)",
              }}
            >
              <div
                className="flex size-8 shrink-0 items-center justify-center rounded-[7px]"
                style={{
                  background: `color-mix(in srgb, ${color} 14%, transparent)`,
                  border: `1px solid color-mix(in srgb, ${color} 25%, transparent)`,
                }}
              >
                <div className="size-[11px] rounded-[3px]" style={{ background: color }} />
              </div>

              <div className="flex-1">
                <div className="text-xs font-medium" style={{ color: "var(--mockup-fg)" }}>
                  {name}
                </div>
                <div className="mt-px text-[9px]" style={{ color: "var(--mockup-muted-fg)" }}>
                  {provider}
                </div>
              </div>

              <div className="text-right">
                <div
                  className="text-[13px] font-semibold"
                  style={{
                    color:
                      statusColor === "var(--mockup-danger)" ? statusColor : "var(--mockup-fg)",
                  }}
                >
                  {balance}
                </div>
                <div className="mt-px text-[9px]" style={{ color: statusColor }}>
                  {status}
                </div>
              </div>

              <div className="ml-1 text-xs" style={{ color: "var(--mockup-muted-fg)" }}>
                ›
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
