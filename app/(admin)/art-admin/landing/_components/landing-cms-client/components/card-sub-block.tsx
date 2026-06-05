import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { FieldLabel } from "./field-label";

type TProps = {
  index: number;
  title: string;
  body: string;
  onTitle: (v: string) => void;
  onBody: (v: string) => void;
  titleError?: string;
  bodyError?: string;
};

export const CardSubBlock = ({
  index,
  title,
  body,
  onTitle,
  onBody,
  titleError,
  bodyError,
}: TProps) => (
  <div className="border-border rounded-lg border bg-zinc-50 p-[14px_16px_16px] dark:bg-zinc-900">
    <div className="mb-3 flex items-center gap-2">
      <span className="border-border bg-background text-muted-foreground inline-flex h-[22px] w-[22px] items-center justify-center rounded-[6px] border text-[11.5px] font-semibold tabular-nums">
        {index}
      </span>
      <span className="text-muted-foreground text-[12px] font-semibold tracking-[0.06em] uppercase">
        Card {index}
      </span>
    </div>
    <div className="mb-3.5">
      <FieldLabel htmlFor={`card-${index}-title`}>Title</FieldLabel>
      <Input
        id={`card-${index}-title`}
        value={title}
        onChange={(e) => onTitle(e.target.value)}
        className="h-9 text-[13.5px]"
      />
      {titleError && <p className="text-destructive mt-1 text-xs">{titleError}</p>}
    </div>
    <div>
      <FieldLabel htmlFor={`card-${index}-body`}>Body</FieldLabel>
      <Textarea
        id={`card-${index}-body`}
        value={body}
        onChange={(e) => onBody(e.target.value)}
        rows={3}
        className="text-[13.5px] leading-[1.55]"
      />
      {bodyError && <p className="text-destructive mt-1 text-xs">{bodyError}</p>}
      <p className="text-muted-foreground mt-2.5 text-xs leading-[1.55]">
        Supports **bold** and `code` markers.
      </p>
    </div>
  </div>
);
