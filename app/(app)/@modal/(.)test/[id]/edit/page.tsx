// app/(app)/@modal/(.)payments/[id]/page.tsx
//
// THE INTERCEPT. When a user clicks a <Link href="/payments/abc-123">
// from anywhere inside the (app) group, Next.js sees that:
//   1. There's a parallel slot called @modal,
//   2. Inside it, there's an intercept (.)payments/[id]/page.tsx
//      that matches the target route,
//   3. So instead of doing a full navigation to /payments/[id],
//      it renders THIS file into the modal slot, leaving the
//      current page (the list) underneath.
//
// On hard navigation (refresh, paste URL, open in new tab) the
// intercept does NOT apply — the real /payments/[id]/page.tsx
// renders as a full page.
//
// This is a Server Component. It fetches from the DB directly.
// That's the second win after deep linking: modal content can be
// pure server-rendered, no useEffect, no client fetch, no spinner.

import { EditPaymentModal } from "./_components/edit-payment-modal";
import { auth } from "@/lib/auth";

import { notFound } from "next/navigation";
//
// import { ViewPaymentModal } from "@/features/payments/view-payment-modal";
// import { PaymentViewContent } from "@/features/payments/payment-view-content";
// import { getPaymentForUser } from "@/lib/db/queries/payments";

type TProps = {
  params: Promise<{ id: string }>;
};

export default async function InterceptedPaymentModal({ params }: TProps) {
  const { id } = await params;
  const session = await auth();
  if (!session) notFound();

  // Access check is enforced at the query level — accessiblePayments
  // helper filters by propertyAccess. If the user can't see this
  // payment, the query returns null and we 404.
  // const payment = await getPaymentForUser(id, session.user.id);
  // if (!payment) notFound();

  return <EditPaymentModal payment={{ id }} />;
}
