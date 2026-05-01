const services = [
  {
    name: "Electricity",
    provider: "YASNO",
    color: "var(--mockup-accent)",
    colorHex: "#7c3aed",
    balance: "−€148",
    due: "Due 3 days",
  },
  {
    name: "Gas",
    provider: "Naftogaz",
    color: "#f59e0b",
    colorHex: "#f59e0b",
    balance: "−€62",
    due: "Due 12 days",
  },
  {
    name: "Water",
    provider: "Kyivvodokanal",
    color: "#0d9488",
    colorHex: "#0d9488",
    balance: "+€14",
    due: "Overpaid",
  },
  {
    name: "Internet",
    provider: "Kyivstar",
    color: "#3b82f6",
    colorHex: "#3b82f6",
    balance: "€0",
    due: "Clear",
  },
] as const;

const balanceColor = (balance: string) => {
  if (balance.startsWith("−")) return "#dc2626";
  if (balance.startsWith("+")) return "#16a34a";
  return "var(--mockup-fg-sub)";
};

export const PropertyDetailMockup = () => {
  const cardStyle: React.CSSProperties = {
    background: "var(--mockup-card)",
    border: "1px solid var(--mockup-border)",
    borderRadius: 7,
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
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
      <div
        style={{
          height: 44,
          borderBottom: "1px solid var(--mockup-border)",
          display: "flex",
          alignItems: "center",
          padding: "0 18px",
          gap: 20,
          background: "var(--mockup-bg)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 18,
              height: 18,
              background: "var(--mockup-accent)",
              borderRadius: 3,
            }}
          />
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
        {["Dashboard", "Properties", "Bills"].map((label) => (
          <span
            key={label}
            style={{
              fontSize: 11,
              color: "var(--mockup-muted-fg)",
              padding: "3px 6px",
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
            minHeight: 360,
            background: "var(--mockup-bg)",
          }}
        >
          {(
            [
              ["Dashboard", false],
              ["Properties", true],
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
            background: "var(--mockup-bg)",
          }}
        >
          {/* Breadcrumb */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 10,
              color: "var(--mockup-muted-fg)",
              marginBottom: 12,
            }}
          >
            <span>Properties</span>
            <span>/</span>
            <span
              style={{
                color: "var(--mockup-fg)",
                fontWeight: 500,
              }}
            >
              Apartment · Kyiv
            </span>
          </div>

          {/* Page header */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: 14,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "var(--mockup-fg)",
                  marginBottom: 4,
                }}
              >
                Apartment · Kyiv
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "var(--mockup-muted-fg)",
                }}
              >
                Shevchenko St 14, Kyiv · Owner
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <div
                style={{
                  padding: "5px 10px",
                  background: "var(--mockup-muted)",
                  border: "1px solid var(--mockup-border)",
                  borderRadius: 5,
                  fontSize: 10,
                  color: "var(--mockup-fg)",
                }}
              >
                Share
              </div>
              <div
                style={{
                  padding: "5px 10px",
                  background: "var(--mockup-accent)",
                  borderRadius: 5,
                  fontSize: 10,
                  color: "#fff",
                  fontWeight: 500,
                }}
              >
                Add service
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid var(--mockup-border)",
              marginBottom: 14,
            }}
          >
            {["Overview", "Bills", "Readings", "Sharing"].map((tab, i) => (
              <div
                key={tab}
                style={{
                  fontSize: 11,
                  fontWeight: i === 0 ? 500 : 400,
                  color: i === 0 ? "var(--mockup-fg)" : "var(--mockup-muted-fg)",
                  padding: "6px 12px",
                  borderBottom:
                    i === 0 ? "2px solid var(--mockup-accent)" : "2px solid transparent",
                  marginBottom: -1,
                }}
              >
                {tab}
              </div>
            ))}
          </div>

          {/* Service rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {services.map(({ name, provider, color, colorHex, balance, due }) => (
              <div
                key={name}
                style={{
                  ...cardStyle,
                  padding: "10px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: `${colorHex}18`,
                    border: `1px solid ${colorHex}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 2,
                      background: color,
                      opacity: 0.8,
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: "var(--mockup-fg)",
                    }}
                  >
                    {name}
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: "var(--mockup-muted-fg)",
                    }}
                  >
                    {provider}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: balanceColor(balance),
                    }}
                  >
                    {balance}
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: "var(--mockup-muted-fg)",
                      marginTop: 1,
                    }}
                  >
                    {due}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
