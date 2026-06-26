export const parseReadingValue = (value: string): number | undefined => {
  const n = parseFloat(value.replace(/,/g, ""));

  return Number.isNaN(n) ? undefined : n;
};
