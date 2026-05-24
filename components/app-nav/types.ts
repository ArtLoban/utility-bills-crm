export type TNavUser = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  systemRole: "user" | "admin";
};

export type TLink = {
  href: string;
  label: string;
  active: boolean;
};
