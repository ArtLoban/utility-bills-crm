import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { FieldValues, Path, UseFormReturn, useWatch, FieldPathValue } from "react-hook-form";
import { TSelectableEntity } from "./types";

type TProps<T extends FieldValues, E extends TSelectableEntity> = {
  form: UseFormReturn<T>;
  field: Path<T>;
  options: E[];
  label: string;
};

export const SelectInput = <T extends FieldValues, E extends TSelectableEntity>(
  props: TProps<T, E>,
) => {
  const { form, field, options = [], label } = props;
  const value = useWatch({
    control: form.control,
    name: field,
  });

  const isActive = Boolean(value);
  const optionLabel = options.find((p) => p.id === value)?.name;

  const handleChange = (value: FieldPathValue<FieldValues, string>) => {
    form.setValue(field, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  return (
    <Select value={value || null} onValueChange={handleChange}>
      <SelectTrigger
        className={cn(
          "min-w-[140px] rounded-sm",
          isActive && "border-brand text-brand bg-brand-bg [&_svg]:text-inherit",
        )}
      >
        <SelectValue placeholder={label}>{optionLabel}</SelectValue>
      </SelectTrigger>
      <SelectContent align="start">
        <SelectItem>All</SelectItem>
        {options.map(({ id, name }) => (
          <SelectItem key={id} value={id}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
