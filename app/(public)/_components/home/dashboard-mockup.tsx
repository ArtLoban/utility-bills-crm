const bars = [52, 38, 61, 48, 75, 58, 80];
const months = ["N", "D", "J", "F", "M", "A", "M"];

const chartPoints = [
  [0, 58],
  [85, 48],
  [170, 52],
  [255, 34],
  [340, 38],
  [425, 22],
  [510, 28],
  [600, 14],
] as const;

export const DashboardMockup = () => {
  const S = {
    topBar: {
      height: 44,
      borderBottom: "1px solid var(--mockup-border)",
      display: "flex",
      alignItems: "center",
      padding: "0 18px",
      gap: 20,
      background: "var(--mockup-bg)",
    } as React.CSSProperties,
    logoMark: {
      width: 18,
      height: 18,
      background: "var(--mockup-accent)",
      borderRadius: 3,
      flexShrink: 0,
    } as React.CSSProperties,
    card: {
      background: "var(--mockup-card)",
      border: "1px solid var(--mockup-border)",
      borderRadius: 7,
      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
    } as React.CSSProperties,
  };

  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        background: "var(--mockup-bg)",
        userSelect: "none",
      }}
    >
      {/* Top bar */}
      <div style={S.topBar}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={S.logoMark} />
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--mockup-fg)",
            }}
          >
            Utility Bills CRM
          </span>
        </div>
        <div style={{ flex: 1 }} />
        {["Dashboard", "Properties", "Bills"].map((label, i) => (
          <span
            key={label}
            style={{
              fontSize: 11,
              color: i === 0 ? "var(--mockup-fg)" : "var(--mockup-muted-fg)",
              fontWeight: i === 0 ? 600 : 400,
              padding: "3px 6px",
              borderRadius: 4,
              background: i === 0 ? "var(--mockup-muted)" : "transparent",
            }}
          >
            {label}
          </span>
        ))}
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "var(--mockup-muted)",
            border: "1px solid var(--mockup-border)",
          }}
        />
      </div>

      {/* Layout */}
      <div style={{ display: "flex" }}>
        {/* Sidebar */}
        <div
          style={{
            width: 180,
            borderRight: "1px solid var(--mockup-border)",
            padding: "14px 10px",
            minHeight: 420,
            background: "var(--mockup-bg)",
          }}
        >
          <div
            style={{
              fontSize: 9,
              fontWeight: 600,
              color: "var(--mockup-muted-fg)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              padding: "0 6px",
              marginBottom: 8,
            }}
          >
            Menu
          </div>
          {(
            [
              ["Dashboard", true],
              ["Properties", false],
              ["Bills", false],
              ["Reports", false],
            ] as const
          ).map(([label, active]) => (
            <div
              key={label}
              style={{
                padding: "6px 8px",
                borderRadius: 5,
                background: active ? "var(--mockup-muted)" : "transparent",
                color: active ? "var(--mockup-fg)" : "var(--mockup-muted-fg)",
                fontSize: 11,
                fontWeight: active ? 500 : 400,
                marginBottom: 2,
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div
          style={{
            flex: 1,
            padding: "18px 20px",
            overflow: "hidden",
            background: "var(--mockup-bg)",
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "var(--mockup-fg)",
              marginBottom: 14,
            }}
          >
            Dashboard
          </div>

          {/* Stat cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 10,
              marginBottom: 14,
            }}
          >
            {(
              [
                ["Balance", "−€312", "3 props"],
                ["This month", "€128", "Bills"],
                ["Paid", "€94", "Payments"],
                ["Properties", "3", "Active"],
              ] as const
            ).map(([label, value, sub]) => (
              <div key={label} style={{ ...S.card, padding: "10px 12px" }}>
                <div
                  style={{
                    fontSize: 9,
                    color: "var(--mockup-muted-fg)",
                    marginBottom: 5,
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    color: "var(--mockup-fg)",
                    lineHeight: 1,
                  }}
                >
                  {value}
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: "var(--mockup-muted-fg)",
                    marginTop: 4,
                  }}
                >
                  {sub}
                </div>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginBottom: 10,
            }}
          >
            {/* Pie chart */}
            <div style={{ ...S.card, padding: "12px 14px" }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  color: "var(--mockup-fg)",
                  marginBottom: 10,
                }}
              >
                Expense breakdown
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <svg width={72} height={72} viewBox="0 0 72 72">
                  <circle
                    cx="36"
                    cy="36"
                    r="26"
                    fill="none"
                    stroke="var(--mockup-accent)"
                    strokeWidth="16"
                    strokeDasharray="81 82"
                    strokeDashoffset="0"
                  />
                  <circle
                    cx="36"
                    cy="36"
                    r="26"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="16"
                    strokeDasharray="49 114"
                    strokeDashoffset="-81"
                  />
                  <circle
                    cx="36"
                    cy="36"
                    r="26"
                    fill="none"
                    stroke="#0d9488"
                    strokeWidth="16"
                    strokeDasharray="32 130"
                    strokeDashoffset="-130"
                  />
                  <circle cx="36" cy="36" r="16" fill="var(--mockup-card)" />
                </svg>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {(
                    [
                      ["Electricity", "var(--mockup-accent)"],
                      ["Gas", "#f59e0b"],
                      ["Water", "#0d9488"],
                    ] as const
                  ).map(([label, color]) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <div
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: 2,
                          background: color,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 9,
                          color: "var(--mockup-muted-fg)",
                        }}
                      >
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bar chart */}
            <div style={{ ...S.card, padding: "12px 14px" }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  color: "var(--mockup-fg)",
                  marginBottom: 10,
                }}
              >
                Monthly spend
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 5,
                  height: 60,
                }}
              >
                {bars.map((h, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: h * 0.75,
                        background:
                          i === bars.length - 1
                            ? "var(--mockup-accent)"
                            : "var(--mockup-bar-inactive)",
                        borderRadius: "2px 2px 0 0",
                      }}
                    />
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 5, marginTop: 5 }}>
                {months.map((m, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      textAlign: "center",
                      fontSize: 8,
                      color: "var(--mockup-muted-fg)",
                    }}
                  >
                    {m}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Line chart */}
          <div style={{ ...S.card, padding: "12px 14px" }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 500,
                color: "var(--mockup-fg)",
                marginBottom: 8,
              }}
            >
              Consumption trend — kWh
            </div>
            <svg width="100%" height={68} viewBox="0 0 600 68" preserveAspectRatio="none">
              <defs>
                <linearGradient id="mockup-lg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--mockup-accent-light)" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="var(--mockup-accent-light)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon
                points={`${chartPoints.map(([x, y]) => `${x},${y}`).join(" ")} 600,68 0,68`}
                fill="url(#mockup-lg)"
              />
              <polyline
                points={chartPoints.map(([x, y]) => `${x},${y}`).join(" ")}
                fill="none"
                stroke="var(--mockup-accent-light)"
                strokeWidth="1.8"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {chartPoints.map(([x, y]) => (
                <circle key={x} cx={x} cy={y} r="2.5" fill="var(--mockup-accent-light)" />
              ))}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
