"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { LogOut, Settings, Shield } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { signOutAndGoHome } from "@/lib/auth/sign-out";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TNavUser } from "@/lib/types/nav";
import { getAvatarColor } from "@/lib/utils/avatar-color";
import { getInitials } from "@/lib/utils/get-initials";

type TProps = {
  user: TNavUser;
};

export const UserDropdown = ({ user }: TProps) => {
  const { id, name, email, image, systemRole } = user;
  const router = useRouter();
  const t = useTranslations();
  const color = getAvatarColor(id);
  const initials = getInitials(name, email);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("common.a11y.userMenu")}
        className="hover:bg-accent flex cursor-pointer items-center gap-2 rounded-full py-1 pr-1 pl-2 outline-none"
      >
        <span className="hidden max-w-[9rem] truncate text-sm font-medium lg:block">
          {name ?? email}
        </span>
        {image ? (
          <Image
            src={image}
            alt={name ?? t("common.a11y.avatar")}
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
          {t("nav.account.settings")}
        </DropdownMenuItem>

        {systemRole === "admin" && (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => router.push(ROUTES.admin.root)}
          >
            <Shield className="size-4" />
            {t("nav.account.adminPanel")}
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer" onClick={() => signOutAndGoHome()}>
          <LogOut className="size-4" />
          {t("nav.account.signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
