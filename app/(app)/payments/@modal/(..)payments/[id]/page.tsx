import { redirect } from "next/navigation";

type TProps = {
  params: Promise<{ id: string }>;
};

export default async function InterceptedPaymentModal({ params }: TProps) {
  const { id } = await params;
  redirect(`/payments/${id}/edit`);
}
