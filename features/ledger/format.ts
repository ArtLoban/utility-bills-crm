import { formatMoney } from "@/lib/format/money";

export const formatBalance = (balance: number, locale: string): string => {
  if (balance === 0) return formatMoney(0, locale);

  const sign = balance > 0 ? "−" : "+";

  return `${sign}${formatMoney(Math.abs(balance), locale)}`;
};
