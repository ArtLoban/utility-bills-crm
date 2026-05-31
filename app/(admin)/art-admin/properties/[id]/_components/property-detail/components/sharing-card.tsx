import { useTranslations } from "next-intl";

import { DataCard } from "@/components/data-card";
import type { TAdminPropertyDetail } from "@/features/admin-properties";

import { SharingRow } from "./sharing-row";

type TProps = {
  owners: TAdminPropertyDetail["owners"];
  isDeleted: boolean;
};

export const SharingCard = ({ owners, isDeleted }: TProps) => {
  const t = useTranslations("adminProperties");

  return (
    <DataCard className="overflow-hidden">
      <div className="border-border border-b px-6 py-4">
        <h3 className="text-sm font-semibold">{t("detail.sharingCard.title")}</h3>
      </div>
      <div className="px-6">
        {owners.length === 0 ? (
          <p className="text-muted-foreground py-4 text-sm">—</p>
        ) : (
          owners.map((user, i) => (
            <SharingRow key={user.id} user={user} isLast={i === owners.length - 1} />
          ))
        )}
      </div>
      <p className="border-border bg-muted/50 text-muted-foreground mx-6 mt-1 mb-5 rounded-md border px-3.5 py-2.5 text-xs leading-[1.55]">
        {isDeleted ? t("detail.sharingCard.deletedNote") : t("detail.sharingCard.activeNote")}
      </p>
    </DataCard>
  );
};
