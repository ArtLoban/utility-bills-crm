import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

type TRow = { label: string; value: ReactNode };
type TPair = { first: TRow; second?: TRow };

type TProps = { rows: TRow[] };

const buildPairs = (rows: TRow[]): TPair[] => {
  const pairs: TPair[] = [];
  for (let i = 0; i < rows.length; i += 2) {
    const first = rows[i];
    if (!first) break;
    pairs.push({ first, second: rows[i + 1] });
  }
  return pairs;
};

export const InfoGrid = ({ rows }: TProps) => {
  const pairs = buildPairs(rows);

  return (
    <div>
      {pairs.map((pair, pi) => {
        const isLastPair = pi === pairs.length - 1;

        return (
          <div
            key={pi}
            className={cn(
              "grid grid-cols-1 md:grid-cols-2",
              !isLastPair && "md:border-border md:border-b",
            )}
          >
            <div
              className={cn(
                "py-3.5 md:pr-8",
                !(isLastPair && !pair.second) && "border-border border-b md:border-b-0",
              )}
            >
              <p className="text-muted-foreground mb-1 text-[11px] font-semibold tracking-[0.04em] uppercase">
                {pair.first.label}
              </p>
              <p className="text-foreground text-sm">{pair.first.value}</p>
            </div>

            {pair.second && (
              <div
                className={cn(
                  "md:border-border py-3.5 md:border-l md:pl-6",
                  !isLastPair && "border-border border-b md:border-b-0",
                )}
              >
                <p className="text-muted-foreground mb-1 text-[11px] font-semibold tracking-[0.04em] uppercase">
                  {pair.second.label}
                </p>
                <p className="text-foreground text-sm">{pair.second.value}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
