"use client";

import { useRouter } from "next/navigation";
import { LogOut, Settings, Shield } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { signOutAction } from "@/lib/auth/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TNavUser } from "../types";
import { getAvatarColor } from "../utils/avatar-color";
import { getInitials } from "../utils/get-initials";

type TProps = {
  user: TNavUser;
};

export const UserDropdown = ({ user }: TProps) => {
  const { id, name, email, systemRole } = user;
  const router = useRouter();
  const color = getAvatarColor(id);
  const initials = getInitials(name, email);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="User menu"
        className="hover:bg-accent flex cursor-pointer items-center gap-2 rounded-full py-1 pr-1 pl-2 outline-none"
      >
        <span className="hidden text-sm font-medium sm:block">{name ?? email}</span>
        <div
          className={`flex size-7 items-center justify-center rounded-full border text-[11px] font-semibold select-none ${color.bg} ${color.text} ${color.border}`}
        >
          {initials}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-2">
          <p className="text-sm leading-none font-medium">{name ?? email}</p>
          {name && email && (
            <p className="text-muted-foreground mt-1 text-xs leading-none">{email}</p>
          )}
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(ROUTES.settings)}>
          <Settings className="size-4" />
          Settings
        </DropdownMenuItem>

        {systemRole === "admin" && (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => router.push(ROUTES.admin.root)}
          >
            <Shield className="size-4" />
            Admin panel
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer" onClick={() => signOutAction()}>
          <LogOut className="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
