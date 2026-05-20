import { TAdminUser } from "../../../_data/mock";
import { UserCard } from "./user-card";

type TProps = {
  users: TAdminUser[];
};

export const UsersMobile = ({ users }: TProps) => (
  <div className="flex flex-col gap-2 px-3.5 pt-3 pb-8">
    {users.map((user) => (
      <UserCard key={user.id} user={user} />
    ))}
  </div>
);
