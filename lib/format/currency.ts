const UAH_FORMATTER = new Intl.NumberFormat("uk-UA", {
  style: "currency",
  currency: "UAH",
});

export const formatUAH = (amount: number): string => UAH_FORMATTER.format(amount);
