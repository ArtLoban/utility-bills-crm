import type { TSystemRole } from "@/lib/auth/constants";

export type TNavUser = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  systemRole: TSystemRole;
};

export type TLink = {
  href: string;
  label: string;
  active: boolean;
};
