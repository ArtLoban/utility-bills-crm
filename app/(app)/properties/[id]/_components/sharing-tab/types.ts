export type TUserRole = "Owner" | "Editor" | "Viewer";

export type TSharedUser = {
  id: string;
  name: string;
  email: string;
  role: TUserRole;
  isYou: boolean;
  avatarIdx: number;
  meta: string;
};
