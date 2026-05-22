import { notFound } from "next/navigation";

import { auth } from "@/lib/auth";
import { PaymentModal } from "@/features/payments";

export default async function InterceptedNewPaymentPage() {
  const session = await auth();
  if (!session) notFound();

  return <PaymentModal />;
}
