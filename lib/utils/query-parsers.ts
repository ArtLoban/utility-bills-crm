import { createParser, parseAsInteger, parseAsStringLiteral } from "nuqs/server";
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX } from "@/components/data-table/constants";
import { DATA_TABLE_PARAMS, SORT_ORDER } from "@/components/data-table/types";
import { DATE_PARAMS } from "@/lib/types/common";

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

export const parseAsYYYYMM = createParser<string>({
  parse: (v) => (/^\d{4}-\d{2}$/.test(v) ? v : null),
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
  [DATA_TABLE_PARAMS.PAGE]: parseAsInteger.withDefault(1),
  [DATA_TABLE_PARAMS.PAGE_SIZE]: parseAsPageSize,
  [DATA_TABLE_PARAMS.SORT_ORDER]: parseAsStringLiteral(Object.values(SORT_ORDER)).withDefault(
    SORT_ORDER.DESC,
  ),
};

export const dateRangeSearchParams = {
  [DATE_PARAMS.DATE_FROM]: parseAsYYYYMMDD,
  [DATE_PARAMS.DATE_TO]: parseAsYYYYMMDD,
};
