// app/(app)/payments/[id]/page.tsx
import { EditPaymentModal } from "@/app/(app)/test/_components/edit-payment-modal";

type TProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPaymentPage({ params }: TProps) {
  const { id } = await params;

  return <EditPaymentModal payment={{ id }} />;
}
