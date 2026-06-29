import { type Control, type FieldPath, type FieldValues } from "react-hook-form";

import { FormTextField } from "@/components/form/form-text-field";
import { FormTextareaField } from "@/components/form/form-textarea-field";

type TProps<T extends FieldValues> = {
  index: number;
  control: Control<T>;
  titleName: FieldPath<T>;
  bodyName: FieldPath<T>;
};

export const CardSubBlock = <T extends FieldValues>({
  index,
  control,
  titleName,
  bodyName,
}: TProps<T>) => (
  <div className="border-border bg-muted rounded-lg border p-[14px_16px_16px]">
    <div className="mb-3 flex items-center gap-2">
      <span className="border-border bg-background text-muted-foreground inline-flex h-[22px] w-[22px] items-center justify-center rounded-[6px] border text-[11.5px] font-semibold tabular-nums">
        {index}
      </span>
      <span className="text-muted-foreground text-[12px] font-semibold tracking-[0.06em] uppercase">
        Card {index}
      </span>
    </div>
    <FormTextField control={control} name={titleName} label="Title" className="mb-3.5" />
    <FormTextareaField
      control={control}
      name={bodyName}
      label="Body"
      rows={3}
      description="Supports **bold** and `code` markers."
    />
  </div>
);
