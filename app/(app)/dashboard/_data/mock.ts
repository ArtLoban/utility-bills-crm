export const SERVICE_COLORS = {
  electricity: "#f59e0b",
  gas: "#ef4444",
  coldWater: "#3b82f6",
  hotWater: "#ec4899",
  heating: "#8b5cf6",
  internet: "#14b8a6",
} as const;

export const SERVICE_LABELS: Record<keyof typeof SERVICE_COLORS, string> = {
  electricity: "Electricity",
  gas: "Gas",
  coldWater: "Cold water",
  hotWater: "Hot water",
  heating: "Heating",
  internet: "Internet",
};

type TPropertyBalance = {
  id: string;
  name: string;
  type: "apartment" | "house" | "cottage" | "other";
  balance: number;
};

type TServiceMonthlyExpense = {
  serviceKey: keyof typeof SERVICE_COLORS;
  label: string;
  monthlyAmounts: number[];
};

export type TDashboardData = {
  user: { name: string | null };
  attention: {
    totalDebt: number;
    debtServicesCount: number;
    readingsDueCount: number;
    readingsDueDate: string;
  } | null;
  balance: {
    totalDebt: number;
    debtServicesCount: number;
    totalOverpayment: number;
    overpayServicesCount: number;
    byProperty: TPropertyBalance[];
  };
  charts: {
    months: string[];
    periodLabel: string;
    services: TServiceMonthlyExpense[];
  };
};

export const MOCK_DASHBOARD_DATA: TDashboardData = {
  user: { name: null },
  attention: {
    totalDebt: 1240,
    debtServicesCount: 2,
    readingsDueCount: 3,
    readingsDueDate: "Oct 25",
  },
  balance: {
    totalDebt: 1240,
    debtServicesCount: 2,
    totalOverpayment: 350,
    overpayServicesCount: 1,
    byProperty: [
      { id: "1", name: "Apartment on Main St", type: "apartment", balance: -890 },
      { id: "2", name: "Mom's apartment", type: "apartment", balance: -350 },
      { id: "3", name: "Summer house", type: "house", balance: 350 },
    ],
  },
  charts: {
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
  },
};
