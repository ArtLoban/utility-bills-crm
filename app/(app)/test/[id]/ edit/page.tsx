// app/(app)/payments/[id]/page.tsx

import { redirect } from "next/navigation";

type TProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPaymentPage({ params }: TProps) {
  const { id } = await params;
  redirect(`/test/${id}`);
}
