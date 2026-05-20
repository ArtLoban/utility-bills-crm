import { notFound } from "next/navigation";
//
// import { ViewPaymentModal } from "@/features/payments/view-payment-modal";
// import { PaymentViewContent } from "@/features/payments/payment-view-content";
// import { getPaymentForUser } from "@/lib/db/queries/payments";
import { auth } from "@/lib/auth";

import { EditPaymentModal } from "@/app/(app)/test/_components/edit-payment-modal";
import { CreatePaymentModal } from "@/app/(app)/@modal/(.)test/new/_components/create-payment-modal";

type TProps = {
  params: Promise<{ id: string }>;
};

// TODO devnote: no new for id? It's Create action
export default async function InterceptedPaymentModal({ params }: TProps) {
  const { id } = await params;
  const session = await auth();
  if (!session) notFound();

  // Access check is enforced at the query level — accessiblePayments
  // helper filters by propertyAccess. If the user can't see this
  // payment, the query returns null and we 404.
  // const payment = await getPaymentForUser(id, session.user.id);
  // if (!payment) notFound();

  console.log("InterceptedPaymentModal", id);

  return <CreatePaymentModal />;
}
