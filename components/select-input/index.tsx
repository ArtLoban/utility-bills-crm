import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { FieldValues, Path, UseFormReturn, useWatch, FieldPathValue } from "react-hook-form";
import { SELECT_CLEAR_VALUE } from "@/lib/constants/select";
import { TSelectableEntity } from "./types";

type TProps<T extends FieldValues, E extends TSelectableEntity> = {
  form: UseFormReturn<T>;
  field: Path<T>;
  options: E[];
  label: string;
  size?: "default" | "sm";
  className?: string;
};

export const SelectInput = <T extends FieldValues, E extends TSelectableEntity>(
  props: TProps<T, E>,
) => {
  const { form, field, options = [], label, size = "default", className } = props;
  const value = useWatch({
    control: form.control,
    name: field,
  });

  const isActive = Boolean(value);

  const handleChange = (v: FieldPathValue<FieldValues, string>) => {
    form.setValue(field, v === SELECT_CLEAR_VALUE ? null : v, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  return (
    <Select value={value || ""} onValueChange={handleChange}>
      <SelectTrigger
        className={cn(
          "min-w-[140px] rounded-sm",
          isActive && "border-brand text-brand bg-brand-bg [&_svg]:text-inherit",
          className,
        )}
        size={size}
      >
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent align="start">
        <SelectItem value={SELECT_CLEAR_VALUE} className="text-muted-foreground">
          {label}
        </SelectItem>
        {options.map(({ id, name }) => (
          <SelectItem key={id} value={id}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
