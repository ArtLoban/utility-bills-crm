import type { TSystemRole } from "@/lib/auth/constants";
import type { TPropertyRole, TPropertyType } from "@/lib/db/schema/properties";
import type { TRecordStatus } from "@/lib/types/record-status";

export type TAuthProvider = "google" | "email";

export type TUserPropertyAccess = {
  id: string;
  name: string;
  type: TPropertyType;
  servicesCount: number;
  role: TPropertyRole;
  status: TRecordStatus;
};

type TBaseAdminUserDetail = {
  id: string;
  email: string;
  name: string;
  systemRole: TSystemRole;
  createdDisplay: string;
  lastLoginDisplay: string;
  authProvider: TAuthProvider;
  avatarUrl: string | null;
  userId: string;
  properties: TUserPropertyAccess[];
};

type TActiveAdminUserDetail = TBaseAdminUserDetail & { status: "active" };
type TDeletedAdminUserDetail = TBaseAdminUserDetail & { status: "deleted"; deletedAt: string };

export type TAdminUserDetail = TActiveAdminUserDetail | TDeletedAdminUserDetail;

export const DETAIL_MOCK: Record<string, TAdminUserDetail> = {
  "1": {
    id: "1",
    email: "art.loban@example.com",
    name: "Art Loban",
    systemRole: "admin",
    status: "active",
    createdDisplay: "March 1, 2024",
    lastLoginDisplay: "2 minutes ago",
    authProvider: "google",
    avatarUrl: null,
    userId: "usr_1aRtL0bAnXzY9wQpKmN2",
    properties: [
      {
        id: "10",
        name: "Main apartment",
        type: "apartment",
        servicesCount: 4,
        role: "owner",
        status: "active",
      },
      {
        id: "20",
        name: "Summer cottage",
        type: "cottage",
        servicesCount: 2,
        role: "owner",
        status: "active",
      },
      {
        id: "30",
        name: "Parents' house",
        type: "house",
        servicesCount: 3,
        role: "owner",
        status: "active",
      },
    ],
  },
  "2": {
    id: "2",
    email: "olena.loban@example.com",
    name: "Olena Loban",
    systemRole: "user",
    status: "active",
    createdDisplay: "March 1, 2024",
    lastLoginDisplay: "12 minutes ago",
    authProvider: "google",
    avatarUrl: null,
    userId: "usr_2oLeNaL0bAnYxW8vPjH4",
    properties: [
      {
        id: "10",
        name: "Main apartment",
        type: "apartment",
        servicesCount: 4,
        role: "editor",
        status: "active",
      },
    ],
  },
  "3": {
    id: "3",
    email: "olena.petrenko@example.com",
    name: "Olena Petrenko",
    systemRole: "user",
    status: "active",
    createdDisplay: "April 12, 2024",
    lastLoginDisplay: "1 hour ago",
    authProvider: "google",
    avatarUrl: null,
    userId: "usr_8nQpL3kMtYx2vBcZdR5h",
    properties: [
      {
        id: "40",
        name: "Summer cottage",
        type: "cottage",
        servicesCount: 2,
        role: "owner",
        status: "active",
      },
      {
        id: "50",
        name: "Sea-view condo",
        type: "apartment",
        servicesCount: 3,
        role: "owner",
        status: "active",
      },
    ],
  },
  "4": {
    id: "4",
    email: "mykhailo.tkachenko@example.com",
    name: "Mykhailo Tkachenko",
    systemRole: "user",
    status: "active",
    createdDisplay: "January 8, 2024",
    lastLoginDisplay: "3 hours ago",
    authProvider: "email",
    avatarUrl: null,
    userId: "usr_4mYkHaIlT0kAcHeNkO7q",
    properties: [
      {
        id: "60",
        name: "Old apartment",
        type: "apartment",
        servicesCount: 3,
        role: "owner",
        status: "deleted",
      },
      {
        id: "70",
        name: "New house",
        type: "house",
        servicesCount: 5,
        role: "owner",
        status: "active",
      },
    ],
  },
  "5": {
    id: "5",
    email: "iryna.shevchenko@example.com",
    name: "Iryna Shevchenko",
    systemRole: "user",
    status: "active",
    createdDisplay: "June 1, 2024",
    lastLoginDisplay: "yesterday",
    authProvider: "google",
    avatarUrl: null,
    userId: "usr_5iRyNaShEvChEnKo3x6",
    properties: [
      {
        id: "80",
        name: "City apartment",
        type: "apartment",
        servicesCount: 2,
        role: "owner",
        status: "active",
      },
    ],
  },
  "6": {
    id: "6",
    email: "bohdan.kovalenko@example.com",
    name: "Bohdan Kovalenko",
    systemRole: "user",
    status: "active",
    createdDisplay: "August 1, 2025",
    lastLoginDisplay: "yesterday",
    authProvider: "google",
    avatarUrl: null,
    userId: "usr_6bOhDaNkOvAlEnKo9w1",
    properties: [
      {
        id: "90",
        name: "Studio flat",
        type: "apartment",
        servicesCount: 1,
        role: "owner",
        status: "active",
      },
    ],
  },
  "7": {
    id: "7",
    email: "iryna.petrenko@example.com",
    name: "Iryna Petrenko",
    systemRole: "user",
    status: "active",
    createdDisplay: "April 1, 2024",
    lastLoginDisplay: "2 days ago",
    authProvider: "email",
    avatarUrl: null,
    userId: "usr_7iPeTrEnKoYzX5uNmB8",
    properties: [
      {
        id: "100",
        name: "Family house",
        type: "house",
        servicesCount: 4,
        role: "owner",
        status: "active",
      },
    ],
  },
  "8": {
    id: "8",
    email: "tetiana.tkachenko@example.com",
    name: "Tetiana Tkachenko",
    systemRole: "user",
    status: "active",
    createdDisplay: "January 8, 2024",
    lastLoginDisplay: "1 week ago",
    authProvider: "google",
    avatarUrl: null,
    userId: "usr_8tEtIaNaTkAcHeNkO2d",
    properties: [
      {
        id: "60",
        name: "Old apartment",
        type: "apartment",
        servicesCount: 3,
        role: "editor",
        status: "deleted",
      },
    ],
  },
  "9": {
    id: "9",
    email: "kateryna.lysenko@example.com",
    name: "Kateryna Lysenko",
    systemRole: "user",
    status: "active",
    createdDisplay: "February 3, 2024",
    lastLoginDisplay: "4 days ago",
    authProvider: "google",
    avatarUrl: null,
    userId: "usr_2vTmK9pBxNwL4cYdQ7s",
    properties: [],
  },
  "10": {
    id: "10",
    email: "nataliia.boyko@example.com",
    name: "Nataliia Boyko",
    systemRole: "user",
    status: "active",
    createdDisplay: "November 1, 2025",
    lastLoginDisplay: "3 weeks ago",
    authProvider: "google",
    avatarUrl: null,
    userId: "usr_9nAtAlIiaBOyKo6v3e",
    properties: [],
  },
  "11": {
    id: "11",
    email: "dmytro.savchenko@example.com",
    name: "Dmytro Savchenko",
    systemRole: "user",
    status: "deleted",
    deletedAt: "April 3, 2026",
    createdDisplay: "September 1, 2025",
    lastLoginDisplay: "1 month ago",
    authProvider: "email",
    avatarUrl: null,
    userId: "usr_5kRnP7xCdWt2mBqLzV9j",
    properties: [],
  },
  "12": {
    id: "12",
    email: "alex.kovalenko@example.com",
    name: "Alex Kovalenko",
    systemRole: "user",
    status: "deleted",
    deletedAt: "May 10, 2026",
    createdDisplay: "May 21, 2026",
    lastLoginDisplay: "12 minutes ago",
    authProvider: "google",
    avatarUrl: null,
    userId: "usr_0aLeXkOvAlEnKo4r7t",
    properties: [],
  },
};
