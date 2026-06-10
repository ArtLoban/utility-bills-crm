import { SERVICE_COLORS, SERVICE_LABELS, type TServiceKey } from "@/lib/constants/service-colors";

export { SERVICE_COLORS, SERVICE_LABELS };
export type { TServiceKey };

// Chart mock data — used until Stage 2 wires real aggregation queries.

export type TServiceMonthlyExpense = {
  serviceKey: TServiceKey;
  label: string;
  monthlyAmounts: number[];
};

export type TChartData = {
  months: string[];
  periodLabel: string;
  services: TServiceMonthlyExpense[];
};

export const MOCK_CHART_DATA: TChartData = {
  months: ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"],
  periodLabel: "May 2025 – Apr 2026",
  services: [
    {
      serviceKey: "electricity",
      label: SERVICE_LABELS.electricity,
      monthlyAmounts: [640, 620, 680, 720, 700, 660, 720, 780, 820, 760, 700, 700],
    },
    {
      serviceKey: "gas",
      label: SERVICE_LABELS.gas,
      monthlyAmounts: [120, 110, 100, 90, 180, 300, 520, 640, 680, 620, 480, 380],
    },
    {
      serviceKey: "heating",
      label: SERVICE_LABELS.heating,
      monthlyAmounts: [0, 0, 0, 0, 180, 520, 820, 980, 1060, 920, 620, 220],
    },
    {
      serviceKey: "coldWater",
      label: SERVICE_LABELS.coldWater,
      monthlyAmounts: [140, 150, 160, 160, 160, 150, 150, 150, 160, 150, 150, 150],
    },
    {
      serviceKey: "hotWater",
      label: SERVICE_LABELS.hotWater,
      monthlyAmounts: [210, 210, 220, 220, 230, 230, 240, 240, 250, 240, 230, 220],
    },
    {
      serviceKey: "internet",
      label: SERVICE_LABELS.internet,
      monthlyAmounts: [250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250],
    },
  ],
};
