import { type Control, type FieldPath, type FieldValues } from "react-hook-form";

import { FormSwitchField } from "@/components/form/form-switch-field";

type TProps<T extends FieldValues> = {
  pageName: string;
  pagePath: string;
  control: Control<T>;
  navVisibleName: FieldPath<T>;
  urlAccessibleName: FieldPath<T>;
};

export const VisibilityRow = <T extends FieldValues>({
  pageName,
  pagePath,
  control,
  navVisibleName,
  urlAccessibleName,
}: TProps<T>) => (
  <div className="border-border bg-muted rounded-lg border p-[14px_16px]">
    <div className="mb-3.5">
      <div className="text-foreground text-[13.5px] font-semibold">{pageName}</div>
      <div className="text-muted-foreground mt-0.5 font-mono text-[11.5px]">{pagePath}</div>
    </div>
    <div className="flex flex-col gap-2.5">
      <FormSwitchField
        control={control}
        name={navVisibleName}
        label="Visible in navigation"
        description="Shows the page link in the public header."
      />
      <FormSwitchField
        control={control}
        name={urlAccessibleName}
        label="URL accessible"
        description="The page can be opened directly by URL."
      />
    </div>
  </div>
);
