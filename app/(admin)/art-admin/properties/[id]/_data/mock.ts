import type { TPropertyType } from "../../_data/mock";

export type TServiceType = "electricity" | "cold-water" | "gas" | "internet";

export type TService = {
  type: TServiceType;
  name: string;
  provider: string;
  lastReading: string | null;
  balance: number;
};

export type TUser = {
  initials: string;
  name: string;
  role: "Owner" | "Editor" | "Viewer";
};

type TBasePropertyDetail = {
  id: string;
  name: string;
  type: TPropertyType;
  address: string;
  servicesCount: number;
  owners: TUser[];
  sharing: TUser[];
  createdDisplay: string;
  lastActivity: string;
  propertyId: string;
};

type TActivePropertyDetail = TBasePropertyDetail & {
  status: "active";
  services: TService[];
  createdBy: string;
};

type TDeletedPropertyDetail = TBasePropertyDetail & {
  status: "deleted";
  serviceNames: string[];
  deletedAt: string;
  deletedBy: string;
  readingsCount: number;
  billsCount: number;
  paymentsCount: number;
};

export type TPropertyDetail = TActivePropertyDetail | TDeletedPropertyDetail;

export const DETAIL_MOCK: Record<string, TPropertyDetail> = {
  "10": {
    id: "10",
    name: "Main apartment",
    type: "apartment",
    address: "Kyiv, Velyka Vasylkivska 142, apt 7",
    status: "active",
    servicesCount: 4,
    owners: [{ initials: "AL", name: "Art Loban", role: "Owner" }],
    sharing: [
      { initials: "AL", name: "Art Loban", role: "Owner" },
      { initials: "OL", name: "Olena Loban", role: "Editor" },
    ],
    createdDisplay: "March 8, 2024",
    createdBy: "Art Loban",
    lastActivity: "April 18, 2026",
    propertyId: "prop_4kP2nQ8tBxYwM5vZdR",
    services: [
      {
        type: "electricity",
        name: "Electricity",
        provider: "DTEK Kyiv Electric Networks",
        lastReading: "Apr 15",
        balance: 1210,
      },
      {
        type: "cold-water",
        name: "Cold water",
        provider: "Kyivvodokanal",
        lastReading: "Apr 15",
        balance: 0,
      },
      { type: "gas", name: "Gas", provider: "Kyivgaz", lastReading: "Apr 15", balance: 974 },
      { type: "internet", name: "Internet", provider: "Kyivstar", lastReading: null, balance: 0 },
    ],
  },
  "12": {
    id: "12",
    name: "Old apartment",
    type: "apartment",
    address: "Kyiv, Velyka Vasylkivska 142, apt 7",
    status: "deleted",
    servicesCount: 3,
    owners: [{ initials: "MT", name: "Mykhailo Tkachenko", role: "Owner" }],
    sharing: [
      { initials: "MT", name: "Mykhailo Tkachenko", role: "Owner" },
      { initials: "TT", name: "Tetiana Tkachenko", role: "Editor" },
    ],
    createdDisplay: "January 8, 2024",
    lastActivity: "February 28, 2026",
    propertyId: "prop_2hX9kL3mNqRtY7vBcZ",
    serviceNames: ["Electricity", "Cold water", "Internet"],
    deletedAt: "March 12, 2026",
    deletedBy: "Mykhailo Tkachenko",
    readingsCount: 47,
    billsCount: 18,
    paymentsCount: 14,
  },
};
