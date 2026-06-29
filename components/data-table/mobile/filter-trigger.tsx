"use client";

import { useState, type ReactNode } from "react";

import { SheetDialog } from "@/components/sheet-dialog";
import { Button } from "@/components/ui/button";

type TProps = {
  label: string;
  title: string;
  clearLabel: string;
  activeCount: number;
  onClear: () => void;
  children: ReactNode;
};

export const FilterTrigger = ({
  label,
  title,
  clearLabel,
  activeCount,
  onClear,
  children,
}: TProps) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    onClear();
    setOpen(false);
  };

  return (
    <>
      <Button variant={activeCount > 0 ? "active" : "outline"} onClick={() => setOpen(true)}>
        {label}
        {activeCount > 0 && (
          <span className="bg-brand inline-flex min-w-4 items-center justify-center rounded-full px-1 text-[10.5px] font-bold text-white">
            {activeCount}
          </span>
        )}
      </Button>
      <SheetDialog
        title={title}
        open={open}
        onOpenChange={setOpen}
        onClose={handleClose}
        closeLabel={clearLabel}
      >
        {children}
      </SheetDialog>
    </>
  );
};
