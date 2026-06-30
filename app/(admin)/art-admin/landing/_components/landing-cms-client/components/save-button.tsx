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
    className={cn("h-9.5 rounded-sm px-4.5 text-sm", fullWidth && "w-full")}
  >
    {isSaving ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
    Save changes
  </Button>
);
