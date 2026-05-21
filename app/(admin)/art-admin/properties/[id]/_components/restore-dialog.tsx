"use client";

import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type TProps = {
  propertyName: string;
  sharingNames: string[];
};

export const RestoreDialogContent = ({ propertyName, sharingNames }: TProps) => {
  const router = useRouter();
  const dismiss = () => router.back();

  return (
    <Dialog open onOpenChange={dismiss}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Restore this property?</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm leading-relaxed">
          <strong className="text-foreground font-medium">{propertyName}</strong> will become active
          again. {sharingNames.join(" and ")} will see it and have access restored.
        </p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={dismiss}>Restore</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
