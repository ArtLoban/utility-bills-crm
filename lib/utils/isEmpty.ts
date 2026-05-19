export const isEmptyValue = (value: unknown): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  return false;
};

export const hasOnlyEmptyValues = (obj: Record<string, unknown>): boolean => {
  return Object.values(obj).every(isEmptyValue);
};
