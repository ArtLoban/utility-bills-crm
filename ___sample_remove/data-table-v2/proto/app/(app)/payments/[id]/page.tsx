// app/(app)/payments/[id]/page.tsx
//
// THE FULL PAGE. Reached by:
//   - hard refresh on /payments/abc-123 (intercept doesn't apply)
//   - opening a shared link in a new tab/window
//   - if JS is disabled
//   - direct paste into address bar
//
// This is the SAME content as the intercepted modal — we share it
// via <PaymentViewContent /> — but rendered as a normal page with
// a back link instead of an overlay.

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

// import { PaymentViewContent } from "@/features/payments/payment-view-content";
import { getPaymentForUser } from "@/lib/db/queries/payments";
import { auth } from "@/lib/auth";
import { PaymentViewContent } from "@/___sample_remove/data-table-v2/proto/features/payments/payment-view-content";

type TProps = {
  params: Promise<{ id: string }>;
};

export default async function PaymentFullPage({ params }: TProps) {
  const { id } = await params;
  const session = await auth();
  if (!session) notFound();

  const payment = await getPaymentForUser(id, session.user.id);
  if (!payment) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/payments"
        className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-2 text-sm"
      >
        <ArrowLeft size={16} />
        Back to payments
      </Link>

      <PaymentViewContent payment={payment} />
    </div>
  );
}
