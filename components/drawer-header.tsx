import Image from "next/image";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { SheetClose } from "@/components/ui/sheet";
import { getAvatarColor } from "@/lib/utils/avatar-color";
import { getInitials } from "@/lib/utils/get-initials";
import type { TNavUser } from "@/lib/types/nav";

type TProps = {
  user: TNavUser;
};

export const DrawerHeader = ({ user }: TProps) => {
  const { id, name, email, image } = user;
  const t = useTranslations("common.a11y");
  const color = getAvatarColor(id);
  const initials = getInitials(name, email);

  return (
    <div className="flex items-start gap-3 border-b px-4 pt-5 pb-4">
      {image ? (
        <Image
          src={image}
          alt={name ?? t("avatar")}
          width={40}
          height={40}
          className="size-10 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full border text-sm font-semibold select-none",
            color.bg,
            color.text,
            color.border,
          )}
        >
          {initials}
        </div>
      )}
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="truncate text-[15px] leading-tight font-semibold">{name ?? email}</p>
        {name && email && (
          <p className="text-muted-foreground mt-0.5 truncate text-[13px] leading-tight">{email}</p>
        )}
      </div>
      <SheetClose asChild>
        <button
          aria-label={t("closeMenu")}
          className="hover:bg-accent -mr-1 flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors"
        >
          <X className="size-5" />
        </button>
      </SheetClose>
    </div>
  );
};
