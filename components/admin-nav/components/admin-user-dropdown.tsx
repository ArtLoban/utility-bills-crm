"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut, Settings, Zap } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { signOutAction } from "@/lib/auth/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAvatarColor } from "@/lib/utils/avatar-color";
import { getInitials } from "@/lib/utils/get-initials";
import type { TNavUser } from "@/lib/types/nav";

type TProps = {
  user: TNavUser;
};

export const AdminUserDropdown = ({ user }: TProps) => {
  const { id, name, email, image } = user;
  const router = useRouter();
  const color = getAvatarColor(id);
  const initials = getInitials(name, email);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="User menu"
        className="hover:bg-accent flex cursor-pointer items-center gap-2 rounded-full py-1 pr-1 pl-2 outline-none"
      >
        <span className="hidden max-w-[9rem] truncate text-sm font-medium sm:block">
          {name ?? email}
        </span>
        {image ? (
          <Image
            src={image}
            alt={name ?? "Avatar"}
            width={28}
            height={28}
            className="size-7 rounded-full object-cover"
          />
        ) : (
          <div
            className={`flex size-7 items-center justify-center rounded-full border text-xs font-semibold select-none ${color.bg} ${color.text} ${color.border}`}
          >
            {initials}
          </div>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-2">
          <p className="truncate text-sm leading-none font-medium">{name ?? email}</p>
          {name && email && (
            <p className="text-muted-foreground mt-1 truncate text-xs leading-none">{email}</p>
          )}
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(ROUTES.settings)}>
          <Settings className="size-4" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(ROUTES.dashboard)}>
          <Zap className="size-4" />
          Go to App
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer" onClick={() => signOutAction()}>
          <LogOut className="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
