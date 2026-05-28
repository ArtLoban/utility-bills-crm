import { notFound } from "next/navigation";

import { auth } from "@/lib/auth";
import type { UserId } from "@/lib/db/schema/auth";
import type { BillId } from "@/lib/db/schema/bills";
import { BillModal, billByIdForUser } from "@/features/bills";

type TProps = {
  params: Promise<{ id: string }>;
};

export default async function InterceptedEditBillPage({ params }: TProps) {
  const { id } = await params;
  const session = await auth();
  const userId = session?.user?.id as UserId;

  const result = await billByIdForUser(userId, id as BillId);
  if (!result.ok) notFound();

  return <BillModal bill={result.value} />;
}
