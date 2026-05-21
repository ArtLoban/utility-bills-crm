import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TProps = {
  isDirty: boolean;
  onSave: () => void;
  fullWidth?: boolean;
};

export const SaveButton = ({ isDirty, onSave, fullWidth = false }: TProps) => (
  <Button
    variant="strong"
    disabled={!isDirty}
    onClick={onSave}
    className={cn("h-[38px] rounded-[6px] px-[18px] text-[13.5px]", fullWidth && "w-full")}
  >
    <Check className="size-[14px]" />
    Save changes
  </Button>
);
