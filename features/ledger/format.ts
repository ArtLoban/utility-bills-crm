import { formatUAH } from "@/lib/format/currency";

export const formatBalanceUAH = (balance: number): string => {
  if (balance === 0) return formatUAH(0);

  const sign = balance > 0 ? "−" : "+";

  return `${sign}${formatUAH(Math.abs(balance))}`;
};
