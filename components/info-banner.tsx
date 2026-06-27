import { Info } from "lucide-react";

type TProps = { text: string };

export const InfoBanner = ({ text }: TProps) => (
  <div className="border-border bg-muted flex flex-row gap-2.5 rounded-lg border px-4 py-3">
    <Info size={15} className="text-muted-foreground mt-px shrink-0" />
    <p className="text-muted-foreground m-0 text-sm leading-normal">{text}</p>
  </div>
);
