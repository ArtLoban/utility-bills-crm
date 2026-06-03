import { createParser, parseAsInteger, parseAsStringLiteral } from "nuqs/server";
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX } from "@/components/data-table/constants";
import { SORT_ORDER } from "@/components/data-table/types";

export const parseAsPageSize = createParser({
  parse: (v) => {
    const n = parseInt(v, 10);
    return Number.isFinite(n) && n >= 1 ? Math.min(n, PAGE_SIZE_MAX) : null;
  },
  serialize: String,
}).withDefault(PAGE_SIZE_DEFAULT);

export const parseAsYYYYMMDD = createParser<string>({
  parse: (v) => (/^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null),
  serialize: String,
});

export const parseAsSemicolonArray = createParser<string[]>({
  parse: (v) => {
    const parts = v.split(";").filter(Boolean);
    return parts.length > 0 ? parts : null;
  },
  serialize: (v) => v.join(";"),
});

export const baseListSearchParams = {
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsPageSize,
  sortOrder: parseAsStringLiteral(Object.values(SORT_ORDER)).withDefault(SORT_ORDER.DESC),
  dateFrom: parseAsYYYYMMDD,
  dateTo: parseAsYYYYMMDD,
};
