const NAV_ITEMS = ["Dashboard", "Properties", "Meters", "Bills", "Payments", "Settings"] as const;

const MONTHS = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"] as const;

const BAR_HEIGHTS = [52, 48, 60, 44, 68, 56, 72, 100];

const CHART_POINTS: readonly [number, number][] = [
  [0, 62],
  [86, 54],
  [172, 58],
  [258, 44],
  [344, 48],
  [430, 36],
  [516, 42],
  [602, 28],
];

const SERVICES = [
  { label: "Electricity", color: "oklch(0.558 0.288 293)" },
  { label: "Gas", color: "#f59e0b" },
  { label: "Water", color: "#0d9488" },
  { label: "Internet", color: "#3b82f6" },
] as const;

const SERVICE_PERCENTS = ["42%", "26%", "18%", "14%"] as const;

// Precomputed strokeDasharray offsets for the 3 visible pie slices
const PIE_SLICES = [
  { color: "oklch(0.558 0.288 293)", dash: 103, gap: 60, offset: 0 },
  { color: "#f59e0b", dash: 64, gap: 99, offset: -103 },
  { color: "#0d9488", dash: 44, gap: 119, offset: -167 },
] as const;

const STAT_CARDS = [
  { label: "Total balance", value: "−₴4,820", sub: "across 3 properties", valueColor: "#f87171" },
  { label: "Billed this month", value: "₴3,180", sub: "11 services", valueColor: null },
  { label: "Paid this month", value: "₴2,640", sub: "6 payments", valueColor: null },
  { label: "Properties", value: "3", sub: "all active", valueColor: null },
] as const;

export const DashboardMockup = () => {
  return (
    <div
      className="select-none"
      style={{ fontFamily: "Inter, -apple-system, sans-serif", background: "var(--mockup-bg)" }}
    >
      {/* Top navigation */}
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
          const active = label === "Dashboard";
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
        {/* Page header */}
        <div className="mb-[18px] flex items-start">
          <div>
            <div className="mb-[3px] text-lg font-semibold" style={{ color: "var(--mockup-fg)" }}>
              Hi, Anna
            </div>
            <div className="text-[11px]" style={{ color: "var(--mockup-muted-fg)" }}>
              Here&apos;s where every property stands this month.
            </div>
          </div>
          <div className="flex-1" />
          <div
            className="flex items-center gap-[5px] rounded-md px-[10px] py-[5px]"
            style={{ border: "1px solid var(--mockup-border)", background: "var(--mockup-muted)" }}
          >
            <span className="text-[10px]" style={{ color: "var(--mockup-muted-fg)" }}>
              Period:
            </span>
            <span className="text-[10px] font-medium" style={{ color: "var(--mockup-fg)" }}>
              Last 12 months
            </span>
            <span className="text-[9px]" style={{ color: "var(--mockup-muted-fg)" }}>
              ▾
            </span>
          </div>
        </div>

        {/* Stat cards */}
        <div className="mb-3 grid grid-cols-4 gap-[10px]">
          {STAT_CARDS.map(({ label, value, sub, valueColor }) => (
            <div
              key={label}
              className="rounded-lg px-[14px] py-3"
              style={{ background: "var(--mockup-card)", border: "1px solid var(--mockup-border)" }}
            >
              <div className="mb-[6px] text-[10px]" style={{ color: "var(--mockup-muted-fg)" }}>
                {label}
              </div>
              <div
                className="mb-[5px] text-[19px] leading-none font-semibold"
                style={{ color: valueColor ?? "var(--mockup-fg)" }}
              >
                {value}
              </div>
              <div className="text-[10px]" style={{ color: "var(--mockup-muted-fg)" }}>
                {sub}
              </div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="mb-[10px] grid grid-cols-2 gap-[10px]">
          {/* Donut chart */}
          <div
            className="rounded-lg px-4 py-[14px]"
            style={{ background: "var(--mockup-card)", border: "1px solid var(--mockup-border)" }}
          >
            <div className="mb-3 text-[11px] font-medium" style={{ color: "var(--mockup-fg)" }}>
              Expenses by service
            </div>
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <svg width={80} height={80} viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r="28"
                    fill="none"
                    stroke="var(--mockup-bar-inactive)"
                    strokeWidth="16"
                  />
                  {PIE_SLICES.map(({ color, dash, gap, offset }) => (
                    <circle
                      key={color}
                      cx="40"
                      cy="40"
                      r="28"
                      fill="none"
                      stroke={color}
                      strokeWidth="16"
                      strokeDasharray={`${dash} ${gap}`}
                      strokeDashoffset={offset}
                      transform="rotate(-90 40 40)"
                    />
                  ))}
                  <circle cx="40" cy="40" r="18" fill="var(--mockup-card)" />
                  <text
                    x="40"
                    y="38"
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="600"
                    fill="var(--mockup-fg)"
                  >
                    ₴12.4k
                  </text>
                  <text
                    x="40"
                    y="48"
                    textAnchor="middle"
                    fontSize="7"
                    fill="var(--mockup-muted-fg)"
                  >
                    this year
                  </text>
                </svg>
              </div>
              <div className="flex flex-1 flex-col gap-[7px]">
                {SERVICES.map(({ label, color }, i) => (
                  <div key={label} className="flex items-center gap-[7px]">
                    <div className="size-2 shrink-0 rounded-[2px]" style={{ background: color }} />
                    <span
                      className="flex-1 text-[10px]"
                      style={{ color: "var(--mockup-muted-fg)" }}
                    >
                      {label}
                    </span>
                    <span className="text-[10px] font-medium" style={{ color: "var(--mockup-fg)" }}>
                      {SERVICE_PERCENTS[i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bar chart */}
          <div
            className="rounded-lg px-4 py-[14px]"
            style={{ background: "var(--mockup-card)", border: "1px solid var(--mockup-border)" }}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="text-[11px] font-medium" style={{ color: "var(--mockup-fg)" }}>
                Monthly spend
              </div>
              <div className="flex gap-1">
                {(["Expenses (8)", "Consumption"] as const).map((label, i) => (
                  <div
                    key={label}
                    className="rounded-[4px] px-[7px] py-[2px] text-[9px]"
                    style={{
                      background: i === 0 ? "var(--mockup-accent)" : "transparent",
                      color: i === 0 ? "#fff" : "var(--mockup-muted-fg)",
                      fontWeight: i === 0 ? 500 : 400,
                    }}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex h-16 items-end gap-1">
              {BAR_HEIGHTS.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-[2px]"
                  style={{
                    height: `${(h / 100) * 64}px`,
                    background:
                      i === BAR_HEIGHTS.length - 1
                        ? "var(--mockup-accent)"
                        : "var(--mockup-bar-inactive)",
                  }}
                />
              ))}
            </div>
            <div className="mt-[5px] flex gap-1">
              {MONTHS.map((m) => (
                <div
                  key={m}
                  className="flex-1 text-center text-[8px]"
                  style={{ color: "var(--mockup-muted-fg)" }}
                >
                  {m}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Line chart */}
        <div
          className="rounded-lg px-4 py-[14px]"
          style={{ background: "var(--mockup-card)", border: "1px solid var(--mockup-border)" }}
        >
          <div className="mb-[10px] text-[11px] font-medium" style={{ color: "var(--mockup-fg)" }}>
            Electricity consumption — kWh
          </div>
          <svg width="100%" height={72} viewBox="0 0 602 72" preserveAspectRatio="none">
            <defs>
              <linearGradient id="mockup-area-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--mockup-accent-light)" stopOpacity="0.18" />
                <stop offset="100%" stopColor="var(--mockup-accent-light)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon
              points={`${CHART_POINTS.map(([x, y]) => `${x},${y}`).join(" ")} 602,72 0,72`}
              fill="url(#mockup-area-gradient)"
            />
            <polyline
              points={CHART_POINTS.map(([x, y]) => `${x},${y}`).join(" ")}
              fill="none"
              stroke="var(--mockup-accent-light)"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {CHART_POINTS.map(([x, y]) => (
              <circle
                key={x}
                cx={x}
                cy={y}
                r="3"
                fill="var(--mockup-bg)"
                stroke="var(--mockup-accent-light)"
                strokeWidth="1.5"
              />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
};
