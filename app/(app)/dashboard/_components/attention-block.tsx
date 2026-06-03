import Link from "next/link";
import { AlertTriangle, ChevronRight } from "lucide-react";
import type { TDashboardData } from "../_data/mock";
import { DataCard } from "@/components/data-card";

type TProps = {
  data: NonNullable<TDashboardData["attention"]>;
};

export const AttentionBlock = ({ data }: TProps) => {
  const { totalDebt, debtServicesCount, readingsDueCount, readingsDueDate } = data;

  return (
    <DataCard className="border-l-warning flex flex-col gap-3 border-l-4 px-6 py-5">
      <div className="flex items-center gap-2.5">
        <AlertTriangle size={18} className="text-warning" />
        <h3 className="m-0 text-[14.5px] font-semibold tracking-[-0.1px] text-zinc-950 dark:text-zinc-50">
          Attention required
        </h3>
      </div>

      <ul className="m-0 flex flex-col gap-2 p-0 [list-style:none]">
        {debtServicesCount > 0 && (
          <li className="flex items-baseline gap-2.5 text-[13.5px] text-zinc-950 dark:text-zinc-50">
            <span className="w-2 text-zinc-500">•</span>
            <span className="flex-1">
              {"Debt: "}
              <strong className="text-destructive font-semibold">
                {Math.abs(totalDebt).toLocaleString("uk-UA")} UAH
              </strong>
              <span className="text-zinc-500"> total ({debtServicesCount} services)</span>
            </span>
            <Link
              href="/bills"
              className="text-primary inline-flex shrink-0 items-center gap-0.5 text-[13px] font-medium no-underline"
            >
              View details
              <ChevronRight size={14} />
            </Link>
          </li>
        )}

        {readingsDueCount > 0 && (
          <li className="flex items-baseline gap-2.5 text-[13.5px] text-zinc-950 dark:text-zinc-50">
            <span className="w-2 text-zinc-500">•</span>
            <span className="flex-1">
              {"Submit readings by "}
              <strong className="font-semibold">{readingsDueDate}</strong>
              <span className="text-zinc-500"> ({readingsDueCount} meters)</span>
            </span>
            <Link
              href="/properties"
              className="text-primary inline-flex shrink-0 items-center gap-0.5 text-[13px] font-medium no-underline"
            >
              Go to meters
              <ChevronRight size={14} />
            </Link>
          </li>
        )}
      </ul>
    </DataCard>
  );
};
