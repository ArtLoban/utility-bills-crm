import Link from "next/link";
import { Home, TreePine, ChevronRight } from "lucide-react";
import type { TDashboardData } from "../_data/mock";
import { DataCard } from "@/components/data-card";
import { cn } from "@/lib/utils";
import type { TPropertyType } from "@/lib/db/schema/properties";

type TProps = {
  data: TDashboardData["balance"];
};

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
  if (balance < 0) return "var(--destructive)";
  if (balance > 0) return "var(--success)";
  return "var(--muted-foreground)";
};

export const BalanceBlock = ({ data }: TProps) => {
  const { totalDebt, debtServicesCount, totalOverpayment, overpayServicesCount, byProperty } = data;

  return (
    <DataCard className="overflow-hidden">
      {/* Top section — summary KV grid */}
      <div className="border-b px-6 pt-5 pb-4 dark:border-zinc-800">
        <div className="text-[12px] font-medium tracking-[0.2px] text-zinc-500 uppercase">
          Current balance
        </div>

        <div className="mt-3.5 grid grid-cols-2 gap-8">
          {/* Total debt */}
          <div>
            <div className="mb-1.5 text-[12.5px] text-zinc-500">Total debt</div>
            <div
              className="text-destructive text-2xl leading-none font-semibold tracking-[-0.8px] md:text-[30px]"
              style={{ fontVariantNumeric: "tabular-nums", fontFeatureSettings: '"tnum" 1' }}
            >
              {"−"}
              {totalDebt.toLocaleString("uk-UA")}{" "}
              <span className="text-[15px] font-medium tracking-[-0.2px]">UAH</span>
            </div>
            <div className="mt-1.5 text-[12.5px] text-zinc-500">
              across {debtServicesCount} services
            </div>
          </div>

          {/* Total overpayment */}
          <div>
            <div className="mb-1.5 text-[12.5px] text-zinc-500">Total overpayment</div>
            <div
              className="text-success text-2xl leading-none font-semibold tracking-[-0.8px] md:text-[30px]"
              style={{ fontVariantNumeric: "tabular-nums", fontFeatureSettings: '"tnum" 1' }}
            >
              {"+"}
              {totalOverpayment.toLocaleString("uk-UA")}{" "}
              <span className="text-[15px] font-medium tracking-[-0.2px]">UAH</span>
            </div>
            <div className="mt-1.5 text-[12.5px] text-zinc-500">
              across {overpayServicesCount} service
            </div>
          </div>
        </div>
      </div>

      {/* By property section */}
      <div>
        <div className="px-6 pt-3 pb-2 text-[11.5px] font-medium tracking-[0.2px] text-zinc-500 uppercase">
          By property
        </div>

        <div>
          {byProperty.map((property, i) => {
            const isLast = i === byProperty.length - 1;
            return (
              <Link
                key={property.id}
                href={`/properties/${property.id}`}
                className={cn(
                  "flex items-center gap-3 px-6 py-3 no-underline transition-colors duration-[120ms] hover:bg-zinc-50 dark:hover:bg-zinc-800",
                  !isLast && "border-b border-zinc-200 dark:border-zinc-800",
                )}
              >
                <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[6px] bg-zinc-100 dark:bg-zinc-800">
                  <PropertyIcon type={property.type} />
                </div>

                <div className="min-w-0 flex-1 text-[13.5px] font-medium text-zinc-950 dark:text-zinc-50">
                  {property.name}
                </div>

                <div
                  className="text-sm font-semibold"
                  style={{
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
    </DataCard>
  );
};
