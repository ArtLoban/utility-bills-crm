import { useServiceTypeMeta } from "@/features/services/hooks/use-service-type";
import type { TServiceTypeCode } from "@/features/services/service-type";

type TProps = { code: TServiceTypeCode };

export const ServiceChip = ({ code }: TProps) => {
  const { color, Icon, label } = useServiceTypeMeta(code);

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full py-0.5 pr-2 pl-[5px] text-xs font-medium"
      style={{
        background: `color-mix(in srgb, ${color} 10%, transparent)`,
        border: `1px solid color-mix(in srgb, ${color} 16%, transparent)`,
      }}
    >
      <Icon size={12} style={{ color }} strokeWidth={1.75} />
      {label}
    </span>
  );
};
