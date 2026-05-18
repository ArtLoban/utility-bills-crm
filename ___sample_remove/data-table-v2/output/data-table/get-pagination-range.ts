import { ELLIPSIS } from "./constants";

export type TPaginationItem = number | typeof ELLIPSIS;

const SIBLING_COUNT = 1;
const BOUNDARY_COUNT = 1;

const MIN_SLOTS_WITH_ELLIPSIS = BOUNDARY_COUNT * 2 + SIBLING_COUNT * 2 + 1 + 2;

export const getPaginationRange = (page: number, pageCount: number): TPaginationItem[] => {
  if (pageCount <= MIN_SLOTS_WITH_ELLIPSIS) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  const range: TPaginationItem[] = [1];

  const showStartEllipsis = page > BOUNDARY_COUNT + SIBLING_COUNT + 1;
  const showEndEllipsis = page < pageCount - BOUNDARY_COUNT - SIBLING_COUNT;

  if (showStartEllipsis) range.push(ELLIPSIS);

  const start = Math.max(BOUNDARY_COUNT + 1, page - SIBLING_COUNT);
  const end = Math.min(pageCount - BOUNDARY_COUNT, page + SIBLING_COUNT);

  for (let i = start; i <= end; i++) {
    range.push(i);
  }

  if (showEndEllipsis) range.push(ELLIPSIS);

  range.push(pageCount);

  return range;
};
