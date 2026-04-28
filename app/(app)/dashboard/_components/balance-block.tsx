import Link from "next/link";
import { Home, TreePine, ChevronRight } from "lucide-react";
import type { TDashboardData } from "../_data/mock";

type TProps = {
  data: TDashboardData["balance"];
};

type TPropertyType = "apartment" | "house" | "cottage" | "other";

const PropertyIcon = ({ type }: { type: TPropertyType }) => {
  if (type === "cottage") {
    return <TreePine size={15} className="text-zinc-500" />;
  }
  return <Home size={15} className="text-zinc-500" />;
};

const formatBalance = (balance: number): string => {
  const sign = balance < 0 ? "−" : "+";
  return `${sign}${Math.abs(balance).toLocaleString("uk-UA")} UAH`;
};

const balanceColor = (balance: number): string => {
  if (balance < 0) return "#dc2626";
  if (balance > 0) return "#16a34a";
  return "#71717a";
};

export const BalanceBlock = ({ data }: TProps) => {
  const { totalDebt, debtServicesCount, totalOverpayment, overpayServicesCount, byProperty } = data;

  return (
    <div
      className="rounded-lg border bg-white shadow transition-shadow duration-150 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none dark:hover:shadow-none"
      style={{
        overflow: "hidden",
      }}
    >
      {/* Top section — summary KV grid */}
      <div className="border-b dark:border-zinc-800" style={{ padding: "20px 24px 16px" }}>
        <div
          className="text-zinc-500"
          style={{
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: 0.2,
            textTransform: "uppercase",
          }}
        >
          Current balance
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 32,
            marginTop: 14,
          }}
        >
          {/* Total debt */}
          <div>
            <div className="text-zinc-500" style={{ fontSize: 12.5, marginBottom: 6 }}>
              Total debt
            </div>
            <div
              style={{
                fontSize: 30,
                fontWeight: 600,
                letterSpacing: -0.8,
                color: "#dc2626",
                fontVariantNumeric: "tabular-nums",
                fontFeatureSettings: '"tnum" 1',
                lineHeight: 1,
              }}
            >
              {"−"}
              {totalDebt.toLocaleString("uk-UA")}{" "}
              <span style={{ fontSize: 15, fontWeight: 500, letterSpacing: -0.2 }}>UAH</span>
            </div>
            <div className="text-zinc-500" style={{ fontSize: 12.5, marginTop: 6 }}>
              across {debtServicesCount} services
            </div>
          </div>

          {/* Total overpayment */}
          <div>
            <div className="text-zinc-500" style={{ fontSize: 12.5, marginBottom: 6 }}>
              Total overpayment
            </div>
            <div
              style={{
                fontSize: 30,
                fontWeight: 600,
                letterSpacing: -0.8,
                color: "#16a34a",
                fontVariantNumeric: "tabular-nums",
                fontFeatureSettings: '"tnum" 1',
                lineHeight: 1,
              }}
            >
              {"+"}
              {totalOverpayment.toLocaleString("uk-UA")}{" "}
              <span style={{ fontSize: 15, fontWeight: 500, letterSpacing: -0.2 }}>UAH</span>
            </div>
            <div className="text-zinc-500" style={{ fontSize: 12.5, marginTop: 6 }}>
              across {overpayServicesCount} service
            </div>
          </div>
        </div>
      </div>

      {/* By property section */}
      <div>
        <div
          className="text-zinc-500"
          style={{
            padding: "12px 24px 8px",
            fontSize: 11.5,
            fontWeight: 500,
            letterSpacing: 0.2,
            textTransform: "uppercase",
          }}
        >
          By property
        </div>

        <div>
          {byProperty.map((property, i) => {
            const isLast = i === byProperty.length - 1;
            return (
              <Link
                key={property.id}
                href={`/properties/${property.id}`}
                className="flex items-center hover:bg-zinc-50 dark:hover:bg-zinc-800"
                style={{
                  gap: 12,
                  padding: "12px 24px",
                  borderBottom: isLast ? "none" : "1px solid #e4e4e7",
                  textDecoration: "none",
                  transition: "background 120ms",
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 6,
                    background: "#f4f4f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <PropertyIcon type={property.type} />
                </div>

                <div
                  className="text-zinc-950 dark:text-zinc-50"
                  style={{ flex: 1, fontSize: 13.5, fontWeight: 500 }}
                >
                  {property.name}
                </div>

                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: balanceColor(property.balance),
                    fontVariantNumeric: "tabular-nums",
                    fontFeatureSettings: '"tnum" 1',
                  }}
                >
                  {formatBalance(property.balance)}
                </div>

                <ChevronRight size={15} className="text-zinc-500" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
