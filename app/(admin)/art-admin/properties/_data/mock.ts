export type TPropertyType = "apartment" | "house" | "cottage";
export type TPropertyStatus = "active" | "deleted";
export type TSortColumn = "name" | "created";
export type TSortDir = "asc" | "desc";

export type TProperty = {
  id: string;
  name: string;
  owners: { name: string }[];
  type: TPropertyType;
  status: TPropertyStatus;
  servicesCount: number;
  createdSort: number;
  createdDisplay: string;
};

export type TFilterState = {
  owner: string;
  status: string;
  type: string;
};

export const PROPERTY_OWNERS: string[] = [
  "Art Loban",
  "Bohdan Kovalenko",
  "Iryna Petrenko",
  "Iryna Shevchenko",
  "Kateryna Lysenko",
  "Mykhailo Tkachenko",
  "Olena Loban",
  "Olena Petrenko",
  "Tetiana Tkachenko",
];

export const ALL_PROPERTIES: TProperty[] = [
  {
    id: "1",
    name: "Sea-view condo",
    owners: [{ name: "Olena Petrenko" }],
    type: "apartment",
    status: "active",
    servicesCount: 3,
    createdSort: 202509,
    createdDisplay: "Sep 2025",
  },
  {
    id: "2",
    name: "Bohdan's flat",
    owners: [{ name: "Bohdan Kovalenko" }],
    type: "apartment",
    status: "active",
    servicesCount: 3,
    createdSort: 202508,
    createdDisplay: "Aug 2025",
  },
  {
    id: "3",
    name: "Studio downtown",
    owners: [{ name: "Art Loban" }],
    type: "apartment",
    status: "active",
    servicesCount: 3,
    createdSort: 202508,
    createdDisplay: "Aug 2025",
  },
  {
    id: "4",
    name: "Forest cabin",
    owners: [{ name: "Mykhailo Tkachenko" }],
    type: "cottage",
    status: "active",
    servicesCount: 2,
    createdSort: 202410,
    createdDisplay: "Oct 2024",
  },
  {
    id: "5",
    name: "Shared family home",
    owners: [{ name: "Iryna Shevchenko" }, { name: "Tetiana Tkachenko" }],
    type: "house",
    status: "active",
    servicesCount: 5,
    createdSort: 202406,
    createdDisplay: "Jun 2024",
  },
  {
    id: "6",
    name: "Family home",
    owners: [{ name: "Art Loban" }, { name: "Olena Loban" }],
    type: "house",
    status: "active",
    servicesCount: 5,
    createdSort: 202406,
    createdDisplay: "Jun 2024",
  },
  {
    id: "7",
    name: "Summer cottage",
    owners: [{ name: "Olena Petrenko" }],
    type: "cottage",
    status: "active",
    servicesCount: 2,
    createdSort: 202404,
    createdDisplay: "Apr 2024",
  },
  {
    id: "8",
    name: "Iryna's apartment",
    owners: [{ name: "Iryna Petrenko" }],
    type: "apartment",
    status: "active",
    servicesCount: 3,
    createdSort: 202404,
    createdDisplay: "Apr 2024",
  },
  {
    id: "9",
    name: "Olena's nest",
    owners: [{ name: "Olena Loban" }],
    type: "apartment",
    status: "active",
    servicesCount: 2,
    createdSort: 202403,
    createdDisplay: "Mar 2024",
  },
  {
    id: "10",
    name: "Main apartment",
    owners: [{ name: "Art Loban" }],
    type: "apartment",
    status: "active",
    servicesCount: 4,
    createdSort: 202403,
    createdDisplay: "Mar 2024",
  },
  {
    id: "11",
    name: "Tetiana's place",
    owners: [{ name: "Tetiana Tkachenko" }],
    type: "apartment",
    status: "active",
    servicesCount: 2,
    createdSort: 202401,
    createdDisplay: "Jan 2024",
  },
  {
    id: "12",
    name: "Old apartment",
    owners: [{ name: "Mykhailo Tkachenko" }],
    type: "apartment",
    status: "deleted",
    servicesCount: 3,
    createdSort: 202401,
    createdDisplay: "Jan 2024",
  },
  {
    id: "13",
    name: "Vacation house",
    owners: [{ name: "Kateryna Lysenko" }],
    type: "house",
    status: "deleted",
    servicesCount: 4,
    createdSort: 202402,
    createdDisplay: "Feb 2024",
  },
];

export const ACTIVE_COUNT = ALL_PROPERTIES.filter((p) => p.status === "active").length;
export const DELETED_COUNT = ALL_PROPERTIES.filter((p) => p.status === "deleted").length;
