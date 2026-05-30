import { RECORD_STATUS } from "@/lib/types/record-status";
import { TAdminUser } from "../../../../_data/mock";

type TProps = {
  filteredData?: TAdminUser[];
};

export const FooterMeta = ({ filteredData }: TProps) => {
  if (!filteredData) return null;

  const activeCount = filteredData.filter((u) => u.status === RECORD_STATUS.ACTIVE).length;

  return (
    <span className="text-muted-foreground text-sm tabular-nums">
      {filteredData.length} users · {activeCount} active
    </span>
  );
};
