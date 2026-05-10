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
