import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

type TProps = {
  title: string;
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  description?: string;
  confirmLabel?: string;
  closeLabel?: string;
  onClose?: () => void;
};

export const SheetDialog = (props: TProps) => {
  const {
    title,
    children,
    open,
    onOpenChange,
    description,
    confirmLabel = "Apply",
    closeLabel = "Close",
    onClose,
  } = props;

  const handleClose = () => {
    onClose?.();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="gap-0 rounded-t-xl">
        <div className="flex justify-center pt-2.5">
          <div className="h-1 w-9 rounded-sm bg-zinc-200 dark:bg-zinc-700" />
        </div>
        <SheetHeader className="pt-0">
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <div className="px-4">{children}</div>
        <SheetFooter>
          <Button variant="outline" onClick={handleClose} className="flex-1" size="lg">
            {closeLabel}
          </Button>
          <Button onClick={() => onOpenChange(false)} className="flex-1" size="lg">
            {confirmLabel}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
