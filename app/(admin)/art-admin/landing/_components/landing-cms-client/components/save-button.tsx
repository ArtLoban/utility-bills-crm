import { Check, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TProps = {
  isDirty: boolean;
  onSave: () => void;
  isSaving?: boolean;
  fullWidth?: boolean;
};

export const SaveButton = ({ isDirty, onSave, isSaving = false, fullWidth = false }: TProps) => (
  <Button
    variant="strong"
    disabled={!isDirty || isSaving}
    onClick={onSave}
    className={cn("h-[38px] rounded-[6px] px-[18px] text-[13.5px]", fullWidth && "w-full")}
  >
    {isSaving ? (
      <Loader2 className="size-[14px] animate-spin" />
    ) : (
      <Check className="size-[14px]" />
    )}
    Save changes
  </Button>
);
