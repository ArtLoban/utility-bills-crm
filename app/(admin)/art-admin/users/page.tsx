import { Metadata } from "next";

import { UsersClient } from "./_components/users-client";

export const metadata: Metadata = { title: "Users — Admin" };

export default function AdminUsersPage() {
  return <UsersClient />;
}
