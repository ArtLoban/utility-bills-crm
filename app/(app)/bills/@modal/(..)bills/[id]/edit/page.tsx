import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth/guards";
import type { BillId } from "@/lib/db/schema/bills";
import { BillModal } from "@/features/bills";
import { billByIdForUser } from "@/lib/db/access/bills";

type TProps = {
  params: Promise<{ id: string }>;
};

export default async function InterceptedEditBillPage({ params }: TProps) {
  const userId = await requireUser();
  const { id } = await params;

  const result = await billByIdForUser(userId, id as BillId);
  if (!result.ok) notFound();

  return <BillModal bill={result.value} />;
}
