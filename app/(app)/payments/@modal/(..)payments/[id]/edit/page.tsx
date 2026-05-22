import { notFound } from "next/navigation";

import { auth } from "@/lib/auth";
import { PaymentModal } from "@/features/payments";

type TProps = {
  params: Promise<{ id: string }>;
};

export default async function InterceptedEditPaymentPage({ params }: TProps) {
  const { id } = await params;
  const session = await auth();
  if (!session) notFound();

  // devnote: fetch payment by id and pass full TPaymentRecord when DB query is wired
  return <PaymentModal payment={{ id, serviceId: "", paidAt: "", amount: 0 }} />;
}
