// features/payments/view-payment-modal.tsx
"use client";

import { useRouter } from "next/navigation";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslations } from "next-intl";

type TProps = {
  /**
   * Modal content as children. This shape lets the Server Component
   * (the intercept page.tsx) fetch data and pass already-rendered
   * content to the client wrapper — no client-side fetching needed.
   */
  children: React.ReactNode;
};

/**
 * Modal shell for the intercepted "view payment" route.
 *
 * Closing the modal = router.back(). This works because navigating
 * from /payments to /payments/abc-123 via <Link> created a history
 * entry. Going back pops that entry, which un-matches the intercept
 * and removes the modal from the @modal slot.
 *
 * Side-effect: this is also why the browser back button "just works"
 * for closing modals on mobile — it's the same operation.
 */
export const ViewPaymentModal = ({ children }: TProps) => {
  const router = useRouter();
  const t = useTranslations("payments.view");

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) router.back();
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
