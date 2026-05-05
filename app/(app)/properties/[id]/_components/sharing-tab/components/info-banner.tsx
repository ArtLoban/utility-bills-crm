import { Info } from "lucide-react";

type TProps = { text: string };

export const InfoBanner = ({ text }: TProps) => (
  <div className="flex flex-row gap-[10px] rounded-lg border border-zinc-200 bg-zinc-100 px-4 py-3">
    <Info size={15} color="#71717a" className="mt-[1px] shrink-0" />
    <p className="m-0 text-sm leading-[1.5] text-zinc-500">{text}</p>
  </div>
);
