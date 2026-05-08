import { type ReactNode } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type TSize = "sm" | "md" | "lg";

const SIZE_CLASS: Record<TSize, string> = {
  sm: "sm:max-w-[400px]",
  md: "sm:max-w-[480px]",
  lg: "sm:max-w-[520px]",
};

export type TProps = {
  title: string;
  description?: string;
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: () => void;
  submitText?: string;
  canSave?: boolean;
  isSaving?: boolean;
  size?: TSize;
};

export const Modal = (props: TProps) => {
  const {
    title,
    description,
    children,
    open,
    onOpenChange,
    onSubmit,
    submitText = "Save",
    canSave = true,
    isSaving = false,
    size = "md",
  } = props;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={SIZE_CLASS[size]}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div>{children}</div>
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
          <Button type="button" onClick={onSubmit} disabled={isSaving || !canSave}>
            {isSaving ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Saving…
              </>
            ) : (
              submitText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
