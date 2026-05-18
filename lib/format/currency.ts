const NUMBER_FORMATTER = new Intl.NumberFormat("en-US");

export const formatUAH = (amount: number): string => NUMBER_FORMATTER.format(amount) + " UAH";
