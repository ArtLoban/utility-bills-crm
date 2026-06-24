import type { TInfoRow } from "../types";

type TPair = {
  first: TInfoRow;
  second?: TInfoRow;
};

export const buildPairs = (rows: TInfoRow[]): TPair[] => {
  const pairs: TPair[] = [];

  for (let i = 0; i < rows.length; i += 2) {
    const first = rows[i];
    if (!first) break;

    pairs.push({ first, second: rows[i + 1] });
  }

  return pairs;
};
