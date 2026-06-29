import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/routes";

type TProps = {
  params: Promise<{ id: string }>;
};

// No standalone payment detail page (provisional) — a direct link redirects to the edit page.
// Whether payments need a real detail view instead of this redirect is an open question
// deferred to a later iteration.
export default async function PaymentPage({ params }: TProps) {
  const { id } = await params;
  redirect(`${ROUTES.payments}/${id}/edit`);
}
