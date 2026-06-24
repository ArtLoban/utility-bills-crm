import { cn } from "@/lib/utils";

import { InfoCell } from "./components/info-cell";
import { buildPairs } from "./utils/build-pairs";
import type { TInfoRow } from "./types";

const MOBILE_ROW_BORDER = "border-border border-b md:border-b-0";

type TProps = {
  rows: TInfoRow[];
};

export const InfoGrid = ({ rows }: TProps) => {
  const pairs = buildPairs(rows);

  return (
    <div>
      {pairs.map((pair, index) => {
        const isLastPair = index === pairs.length - 1;

        return (
          <div
            key={pair.first.label}
            className={cn(
              "grid grid-cols-1 md:grid-cols-2",
              !isLastPair && "md:border-border md:border-b",
            )}
          >
            <InfoCell
              {...pair.first}
              className={cn("md:pr-8", !(isLastPair && !pair.second) && MOBILE_ROW_BORDER)}
            />
            {pair.second && (
              <InfoCell
                {...pair.second}
                className={cn(
                  "md:border-border md:border-l md:pl-6",
                  !isLastPair && MOBILE_ROW_BORDER,
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
