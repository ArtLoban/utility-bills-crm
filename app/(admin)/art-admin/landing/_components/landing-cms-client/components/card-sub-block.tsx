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
  <div className="border-border bg-muted rounded-lg border px-4 pt-3.5 pb-4">
    <div className="mb-3 flex items-center gap-2">
      <span className="border-border bg-background text-muted-foreground inline-flex size-5.5 items-center justify-center rounded-sm border text-xs font-semibold tabular-nums">
        {index}
      </span>
      <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
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
