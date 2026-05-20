import { DataCard } from "@/components/data-card";
import { type TUser } from "../../../_data/mock";
import { SharingRow } from "./sharing-row";

type TProps = {
  sharing: TUser[];
  isDeleted: boolean;
};

export const SharingCard = ({ sharing, isDeleted }: TProps) => (
  <DataCard className="overflow-hidden">
    <div className="border-border border-b px-6 py-4">
      <h3 className="text-sm font-semibold">Sharing snapshot</h3>
    </div>
    <div className="px-6">
      {sharing.map((user, i) => (
        <SharingRow key={user.name} {...user} isLast={i === sharing.length - 1} />
      ))}
    </div>
    <p className="border-border bg-muted/50 text-muted-foreground mx-6 mt-1 mb-5 rounded-md border px-3.5 py-2.5 text-xs leading-[1.55]">
      {isDeleted
        ? "These users no longer see this property. Restoring it brings access back."
        : "Sharing changes are made by the owner, not by admin."}
    </p>
  </DataCard>
);
