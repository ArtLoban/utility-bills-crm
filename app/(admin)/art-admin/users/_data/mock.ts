import type { TSystemRole } from "@/lib/auth/constants";
import { RECORD_STATUS, type TRecordStatus } from "@/lib/types/record-status";

export type { TRecordStatus as TUserStatus };

export type TAdminUser = {
  id: string;
  email: string;
  name: string;
  systemRole: TSystemRole;
  propertiesCount: number;
  createdSort: number;
  createdDisplay: string;
  lastLoginSort: number;
  lastLoginDisplay: string;
  status: TRecordStatus;
};

const now = Date.now();
const min = 60_000;
const hr = 3_600_000;
const day = 86_400_000;
const week = 7 * day;
const month = 30 * day;

export const ALL_USERS: TAdminUser[] = [
  {
    id: "1",
    email: "art.loban@example.com",
    name: "Art Loban",
    systemRole: "admin",
    propertiesCount: 3,
    createdSort: Date.UTC(2024, 2, 1),
    createdDisplay: "Mar 2024",
    lastLoginSort: now - 2 * min,
    lastLoginDisplay: "2 minutes ago",
    status: "active",
  },
  {
    id: "2",
    email: "olena.loban@example.com",
    name: "Olena Loban",
    systemRole: "user",
    propertiesCount: 1,
    createdSort: Date.UTC(2024, 2, 1),
    createdDisplay: "Mar 2024",
    lastLoginSort: now - 12 * min,
    lastLoginDisplay: "12 minutes ago",
    status: "active",
  },
  {
    id: "3",
    email: "olena.petrenko@example.com",
    name: "Olena Petrenko",
    systemRole: "user",
    propertiesCount: 2,
    createdSort: Date.UTC(2024, 3, 1),
    createdDisplay: "Apr 2024",
    lastLoginSort: now - hr,
    lastLoginDisplay: "1 hour ago",
    status: "active",
  },
  {
    id: "4",
    email: "mykhailo.tkachenko@example.com",
    name: "Mykhailo Tkachenko",
    systemRole: "user",
    propertiesCount: 2,
    createdSort: Date.UTC(2024, 0, 1),
    createdDisplay: "Jan 2024",
    lastLoginSort: now - 3 * hr,
    lastLoginDisplay: "3 hours ago",
    status: "active",
  },
  {
    id: "5",
    email: "iryna.shevchenko@example.com",
    name: "Iryna Shevchenko",
    systemRole: "user",
    propertiesCount: 1,
    createdSort: Date.UTC(2024, 5, 1),
    createdDisplay: "Jun 2024",
    lastLoginSort: now - day,
    lastLoginDisplay: "yesterday",
    status: "active",
  },
  {
    id: "6",
    email: "bohdan.kovalenko@example.com",
    name: "Bohdan Kovalenko",
    systemRole: "user",
    propertiesCount: 1,
    createdSort: Date.UTC(2025, 7, 1),
    createdDisplay: "Aug 2025",
    lastLoginSort: now - day,
    lastLoginDisplay: "yesterday",
    status: "active",
  },
  {
    id: "7",
    email: "iryna.petrenko@example.com",
    name: "Iryna Petrenko",
    systemRole: "user",
    propertiesCount: 1,
    createdSort: Date.UTC(2024, 3, 1),
    createdDisplay: "Apr 2024",
    lastLoginSort: now - 2 * day,
    lastLoginDisplay: "2 days ago",
    status: "active",
  },
  {
    id: "8",
    email: "tetiana.tkachenko@example.com",
    name: "Tetiana Tkachenko",
    systemRole: "user",
    propertiesCount: 1,
    createdSort: Date.UTC(2024, 0, 1),
    createdDisplay: "Jan 2024",
    lastLoginSort: now - week,
    lastLoginDisplay: "1 week ago",
    status: "active",
  },
  {
    id: "9",
    email: "kateryna.lysenko@example.com",
    name: "Kateryna Lysenko",
    systemRole: "user",
    propertiesCount: 0,
    createdSort: Date.UTC(2024, 1, 1),
    createdDisplay: "Feb 2024",
    lastLoginSort: now - 4 * day,
    lastLoginDisplay: "4 days ago",
    status: "active",
  },
  {
    id: "10",
    email: "nataliia.boyko@example.com",
    name: "Nataliia Boyko",
    systemRole: "user",
    propertiesCount: 0,
    createdSort: Date.UTC(2025, 10, 1),
    createdDisplay: "Nov 2025",
    lastLoginSort: now - 3 * week,
    lastLoginDisplay: "3 weeks ago",
    status: "active",
  },
  {
    id: "11",
    email: "dmytro.savchenko@example.com",
    name: "Dmytro Savchenko",
    systemRole: "user",
    propertiesCount: 0,
    createdSort: Date.UTC(2025, 8, 1),
    createdDisplay: "Sep 2025",
    lastLoginSort: now - month,
    lastLoginDisplay: "1 month ago",
    status: "deleted",
  },
  {
    id: "12",
    email: "alex.kovalenko@example.com",
    name: "Alex Kovalenko",
    systemRole: "user",
    propertiesCount: 0,
    createdSort: now - 12 * min,
    createdDisplay: "12 minutes ago",
    lastLoginSort: now - 12 * min,
    lastLoginDisplay: "12 minutes ago",
    status: "deleted",
  },
];

export const ACTIVE_COUNT = ALL_USERS.filter((u) => u.status === RECORD_STATUS.ACTIVE).length;
export const ADMIN_COUNT = ALL_USERS.filter((u) => u.systemRole === "admin").length;
