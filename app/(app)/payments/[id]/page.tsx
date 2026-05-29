import { redirect } from "next/navigation";

type TProps = {
  params: Promise<{ id: string }>;
};

// TODO
export default async function PaymentPage({ params }: TProps) {
  const { id } = await params;
  redirect(`/payments/${id}/edit`);
}
