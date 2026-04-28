import { SERVICE_COLORS, type TServiceKey } from "@/lib/constants/service-colors";

export { SERVICE_COLORS };

export type TProperty = {
  id: string;
  type: "apartment" | "house" | "cottage" | "other";
  name: string;
  address: string | null;
  serviceCount: number;
  balance: number;
  isShared: boolean;
  myRole: "owner" | "editor" | "viewer";
};

export type TPropertyDetail = {
  id: string;
  type: "apartment" | "house" | "cottage" | "other";
  name: string;
  address: string | null;
  serviceCount: number;
  createdAt: string;
  myRole: "owner" | "editor" | "viewer";
};

export type TServiceSummary = {
  id: string;
  serviceKey: TServiceKey;
  name: string;
  provider: string | null;
  isMetered: boolean;
  lastReadingDate: string | null;
  balance: number;
};

export const MOCK_HAS_PROPERTIES = true;

export const MOCK_PROPERTIES: TProperty[] = [
  {
    id: "1",
    type: "apartment",
    name: "Apartment on Main St",
    address: "Main St 15",
    serviceCount: 5,
    balance: -890,
    isShared: false,
    myRole: "owner",
  },
  {
    id: "2",
    type: "apartment",
    name: "Mom's apartment",
    address: "Shevchenka 28, apt. 12",
    serviceCount: 4,
    balance: -350,
    isShared: false,
    myRole: "owner",
  },
  {
    id: "3",
    type: "house",
    name: "Brother's house",
    address: "Village Hrebeni",
    serviceCount: 3,
    balance: 120,
    isShared: true,
    myRole: "editor",
  },
];

export const MOCK_PROPERTY_DETAIL: TPropertyDetail = {
  id: "1",
  type: "apartment",
  name: "Apartment on Main St",
  address: "Main St 15",
  serviceCount: 5,
  createdAt: "Jan 2024",
  myRole: "owner",
};

export const MOCK_SERVICES: TServiceSummary[] = [
  {
    id: "e",
    serviceKey: "electricity",
    name: "Electricity",
    provider: "DTEK Kyiv Regional Grids",
    isMetered: true,
    lastReadingDate: "Oct 15",
    balance: -400,
  },
  {
    id: "g",
    serviceKey: "gas",
    name: "Gas",
    provider: "Naftogaz of Ukraine",
    isMetered: true,
    lastReadingDate: "Oct 14",
    balance: 50,
  },
  {
    id: "cw",
    serviceKey: "coldWater",
    name: "Cold water",
    provider: "Kyivvodokanal",
    isMetered: true,
    lastReadingDate: "Oct 15",
    balance: -100,
  },
  {
    id: "hw",
    serviceKey: "hotWater",
    name: "Hot water",
    provider: "Kyivteploenergo",
    isMetered: true,
    lastReadingDate: "Oct 12",
    balance: -240,
  },
  {
    id: "i",
    serviceKey: "internet",
    name: "Internet",
    provider: "Kyivstar",
    isMetered: false,
    lastReadingDate: null,
    balance: 0,
  },
];
