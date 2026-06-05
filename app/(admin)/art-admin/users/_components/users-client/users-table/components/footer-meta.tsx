"use client";

type TProps = {
  total: number;
};

export const FooterMeta = ({ total }: TProps) => {
  return (
    <span className="text-muted-foreground text-sm tabular-nums">
      {total === 1 ? "1 user" : `${total} users`}
    </span>
  );
};
