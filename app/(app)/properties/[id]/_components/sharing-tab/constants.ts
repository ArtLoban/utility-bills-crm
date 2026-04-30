import { TSharedUser } from "./types";

export const AVATAR_PALETTE = [
  { bg: "#ddd6fe", color: "#7c3aed" },
  { bg: "#bfdbfe", color: "#1d4ed8" },
  { bg: "#bbf7d0", color: "#15803d" },
  { bg: "#fde68a", color: "#b45309" },
] as const;

export const MOCK_SHARED_USERS: TSharedUser[] = [
  {
    id: "u1",
    name: "Olena Loban",
    email: "olena@example.com",
    role: "Owner",
    isYou: true,
    avatarIdx: 0,
    meta: "Joined March 1, 2024 · Property creator",
  },
  {
    id: "u2",
    name: "Artem Loban",
    email: "artem@example.com",
    role: "Editor",
    isYou: false,
    avatarIdx: 1,
    meta: "Added by Olena on April 12, 2024",
  },
  {
    id: "u3",
    name: "Maria Shevchenko",
    email: "maria.shevchenko@example.com",
    role: "Viewer",
    isYou: false,
    avatarIdx: 2,
    meta: "Added by Olena on June 8, 2024",
  },
];
