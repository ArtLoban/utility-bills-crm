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
