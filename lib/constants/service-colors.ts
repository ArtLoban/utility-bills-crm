// Hex mirror of --service-* CSS variables in globals.css.
// Keep in sync manually. Hex is required for SVG fill attributes (Recharts).
// CSS consumers (inline styles, backgrounds) use color-mix() with these values.
// Migration path: when charts no longer use SVG fill, switch values to var(--service-*).
export const SERVICE_COLORS = {
  electricity: "#f59e0b",
  gas: "#ef4444",
  coldWater: "#3b82f6",
  hotWater: "#ec4899",
  heating: "#8b5cf6",
  internet: "#14b8a6",
} as const;

export type TServiceKey = keyof typeof SERVICE_COLORS;

export const SERVICE_LABELS: Record<TServiceKey, string> = {
  electricity: "Electricity",
  gas: "Gas",
  coldWater: "Cold water",
  hotWater: "Hot water",
  heating: "Heating",
  internet: "Internet",
};

// Converts DB snake_case service type code to camelCase TServiceKey.
// "cold_water" → "coldWater", "electricity" → "electricity", etc.
const snakeToCamel = (code: string): string =>
  code.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());

// Maps a DB service type code to TServiceKey, or undefined if not in the design system.
export const dbCodeToServiceKey = (dbCode: string): TServiceKey | undefined => {
  const camel = snakeToCamel(dbCode) as TServiceKey;
  return camel in SERVICE_COLORS ? camel : undefined;
};

// Returns a human-readable label for a DB service type code.
export const getServiceLabel = (dbCode: string): string => {
  const key = dbCodeToServiceKey(dbCode);
  if (key) return SERVICE_LABELS[key];
  // Fallback: prettify the raw code ("gas_delivery" → "Gas delivery").
  return dbCode.replace(/_/g, " ").replace(/^[a-z]/, (c) => c.toUpperCase());
};
