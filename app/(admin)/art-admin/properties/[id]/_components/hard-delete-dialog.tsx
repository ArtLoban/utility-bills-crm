"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Check } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type TProps = {
  propertyName: string;
  ownerName: string;
  servicesCount: number;
  readingsCount: number;
  billsCount: number;
  paymentsCount: number;
};

export const HardDeleteDialogContent = ({
  propertyName,
  ownerName,
  servicesCount,
  readingsCount,
  billsCount,
  paymentsCount,
}: TProps) => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const isConfirmed = inputValue === "DELETE";
  const dismiss = () => router.back();

  return (
    <Dialog open onOpenChange={dismiss}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader className="flex-row items-start gap-3">
          <AlertTriangle
            size={18}
            strokeWidth={1.75}
            className="text-destructive mt-0.5 shrink-0"
          />
          <DialogTitle>Delete this property permanently?</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground text-sm leading-relaxed">
            <strong className="text-foreground font-medium">{propertyName}</strong> and all its data
            will be permanently erased — {servicesCount}{" "}
            {servicesCount === 1 ? "service" : "services"}, {readingsCount}{" "}
            {readingsCount === 1 ? "reading" : "readings"}, {billsCount}{" "}
            {billsCount === 1 ? "bill" : "bills"}, {paymentsCount}{" "}
            {paymentsCount === 1 ? "payment" : "payments"}. The owner (
            <strong className="text-foreground font-medium">{ownerName}</strong>) will lose all
            history. This cannot be undone.
          </p>

          <div className="flex flex-col gap-1.5">
            <label className="text-foreground text-sm font-medium">
              To confirm, type <span className="font-mono font-semibold">DELETE</span> below
            </label>
            <div className="relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type DELETE to confirm"
                className={cn(
                  isConfirmed &&
                    "border-success focus-visible:border-success focus-visible:ring-success/20 pr-8",
                )}
                autoFocus
              />
              {isConfirmed && (
                <Check
                  size={14}
                  strokeWidth={2}
                  className="text-success pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2"
                />
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" disabled={!isConfirmed} onClick={dismiss}>
            Delete permanently
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
