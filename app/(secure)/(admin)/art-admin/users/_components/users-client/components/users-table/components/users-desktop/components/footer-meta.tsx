import { formatUserCount } from "../../../utils/format-user-count";

type TProps = { total: number };

export const FooterMeta = ({ total }: TProps) => (
  <span className="text-muted-foreground text-sm tabular-nums">{formatUserCount(total)}</span>
);
