import { formatPropertyCount } from "../../../utils/format-property-count";

type TProps = { total: number };

export const FooterMeta = ({ total }: TProps) => (
  <span className="text-muted-foreground text-sm tabular-nums">{formatPropertyCount(total)}</span>
);
