import { Info, X } from "lucide-react";

type TProps = {
  text: string;
  onDismiss?: () => void;
  dismissLabel?: string;
};

export const InfoBanner = ({ text, onDismiss, dismissLabel }: TProps) => (
  <div className="border-border bg-muted flex flex-row items-start gap-2.5 rounded-lg border px-4 py-3">
    <Info size={15} className="text-muted-foreground mt-px shrink-0" />
    <p className="text-muted-foreground m-0 flex-1 text-sm leading-normal">{text}</p>
    {onDismiss ? (
      <button
        type="button"
        onClick={onDismiss}
        aria-label={dismissLabel}
        className="text-muted-foreground hover:text-foreground -mr-1 shrink-0 cursor-pointer transition-colors"
      >
        <X size={15} />
      </button>
    ) : null}
  </div>
);
