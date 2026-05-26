export const formatServiceCode = (code: string): string =>
  code.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export const formatInstalled = (date: Date | null): string => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
