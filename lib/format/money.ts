const MONEY_CURRENCY = "UAH";

export type TFormatMoneyOptions = { symbol?: boolean };

// Intl.NumberFormat instances are expensive to build and reused heavily in tables,
// so they are cached per locale + render mode.
const formatterCache = new Map<string, Intl.NumberFormat>();

const getFormatter = (locale: string, symbol: boolean): Intl.NumberFormat => {
  const cacheKey = `${locale}:${symbol}`;
  const cached = formatterCache.get(cacheKey);
  if (cached) return cached;

  const formatter = new Intl.NumberFormat(
    locale,
    symbol
      ? { style: "currency", currency: MONEY_CURRENCY, currencyDisplay: "narrowSymbol" }
      : { style: "decimal", minimumFractionDigits: 2, maximumFractionDigits: 2 },
  );

  formatterCache.set(cacheKey, formatter);

  return formatter;
};

// symbol: true  → "₴1,234.50" (en), "1 234,50 ₴" (uk/ru)
// symbol: false → "1,234.50"  (en), "1 234,50"   (uk/ru) — for cells under a "…, ₴" column
export const formatMoney = (
  amount: string | number,
  locale: string,
  { symbol = true }: TFormatMoneyOptions = {},
): string => getFormatter(locale, symbol).format(Number(amount));
