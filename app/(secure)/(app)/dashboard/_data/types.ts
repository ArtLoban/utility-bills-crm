import type { PropertyId } from "@/lib/db/schema/properties";
import type { TPropertyType } from "@/lib/db/schema/properties";

export type TPropertyBalance = {
  id: PropertyId;
  name: string;
  type: TPropertyType;
  balance: number;
};

export type TAttentionData = {
  totalDebt: number;
  debtServicesCount: number;
  missingReadingsCount: number;
  currentMonth: Date;
};

export type TBalanceData = {
  totalDebt: number;
  debtServicesCount: number;
  totalOverpayment: number;
  overpayServicesCount: number;
  byProperty: TPropertyBalance[];
};
