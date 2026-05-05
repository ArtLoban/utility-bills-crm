import { TSharedUser } from "../types";
import { Avatar } from "./avatar";
import { RoleBadge } from "./role-badge";
import { RoleDropdown } from "./role-dropdown";
import { KebabMenu } from "./kebab-menu";

type TProps = {
  user: TSharedUser;
  isOwnerView: boolean;
  menuOpen: boolean;
  onMenuToggle: () => void;
  onRemove: (user: TSharedUser) => void;
  onLeave: () => void;
};

export const UserCard = ({
  user,
  isOwnerView,
  menuOpen,
  onMenuToggle,
  onRemove,
  onLeave,
}: TProps) => {
  const showInlineRole = user.isYou || (isOwnerView && user.role === "Owner");
  const showRoleDropdown = isOwnerView && !user.isYou && user.role !== "Owner";
  const showRightBadge = !isOwnerView && !user.isYou;
  const showKebab = isOwnerView && !user.isYou && user.role !== "Owner";
  const showLeave = user.isYou;

  // devnote: leave flow (with or without last-owner check) to be wired to Server Action when implemented
  return (
    <div className="flex flex-row gap-[14px] rounded-lg border border-zinc-200 bg-white px-5 py-4 shadow-[0_1px_2px_rgba(24,24,27,0.05)]">
      <Avatar size={40} idx={user.avatarIdx} name={user.name} />

      <div className="min-w-0 flex-1">
        <div className="flex flex-row flex-wrap items-center gap-[6px]">
          <span className="text-sm font-semibold tracking-[-0.1px]">{user.name}</span>
          {user.isYou && (
            <span className="rounded border border-zinc-200 bg-zinc-100 px-[6px] py-[1px] text-xs font-medium text-zinc-500">
              You
            </span>
          )}
          {showInlineRole && <RoleBadge role={user.role} />}
        </div>
        <div className="mt-[2px] text-xs text-zinc-500">{user.email}</div>
        <div className="mt-1 text-xs text-zinc-500">{user.meta}</div>
      </div>

      <div className="flex shrink-0 items-center gap-[6px]">
        {showRightBadge && <RoleBadge role={user.role} />}
        {showRoleDropdown && <RoleDropdown value={user.role} />}
        {showKebab && (
          <KebabMenu
            open={menuOpen}
            onToggle={onMenuToggle}
            items={[{ label: "Remove access", destructive: true, onClick: () => onRemove(user) }]}
          />
        )}
        {showLeave && (
          <button
            onClick={onLeave}
            className="h-[30px] cursor-pointer rounded-[6px] border border-zinc-200 bg-transparent px-3 text-sm font-medium text-[#dc2626]"
          >
            Leave property
          </button>
        )}
      </div>
    </div>
  );
};
