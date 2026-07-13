import type { TAdminPropertyDetail } from "@/features/admin-properties";

import { SharingRow } from "./sharing-row";
import { Surface } from "@/components/surface";

type TProps = {
  owners: TAdminPropertyDetail["owners"];
  isDeleted: boolean;
};

export const SharingCard = ({ owners, isDeleted }: TProps) => {
  return (
    <Surface>
      <div className="border-border border-b px-6 py-4">
        <h3 className="text-sm font-semibold">Sharing & access</h3>
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
        {isDeleted
          ? "This property has been deleted. Access is read-only."
          : "Users listed above have access to this property. Manage sharing from within the app."}
      </p>
    </Surface>
  );
};
