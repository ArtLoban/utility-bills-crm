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
import { Loader2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type TSize = "sm" | "md" | "lg";

const SIZE_CLASS: Record<TSize, string> = {
  sm: "sm:max-w-[400px]",
  md: "sm:max-w-[480px]",
  lg: "sm:max-w-[520px]",
};

export type TProps = {
  title: string;
  description?: string;
  children?: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmIcon?: LucideIcon;
  canSave?: boolean;
  isSaving?: boolean;
  size?: TSize;
  variant?: "default" | "warning" | "destructive" | "destructiveStrong";
};

export const Modal = (props: TProps) => {
  const {
    title,
    description,
    children,
    open,
    onOpenChange,
    onConfirm,
    confirmLabel = "Save",
    cancelLabel = "Cancel",
    confirmIcon: ConfirmIcon,
    canSave = true,
    isSaving = false,
    size = "md",
    variant = "default",
  } = props;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          SIZE_CLASS[size],
          "max-h-[calc(100dvh-2rem)] grid-rows-[auto_minmax(0,1fr)_auto]",
        )}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children && <div className="overflow-y-auto">{children}</div>}
        <DialogFooter>
          <Button variant="outline" asChild>
            <DialogClose>{cancelLabel}</DialogClose>
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isSaving || !canSave}
            variant={variant}
          >
            {isSaving ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              ConfirmIcon && <ConfirmIcon />
            )}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
