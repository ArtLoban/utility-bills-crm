type TProps = {
  label: string;
  value: string;
};

export const NestedRow = ({ label, value }: TProps) => (
  <div className="flex items-start gap-2">
    <span className="text-foreground/80 min-w-28 text-xs">{label}</span>
    <span className="text-foreground text-xs break-all">{value}</span>
  </div>
);
