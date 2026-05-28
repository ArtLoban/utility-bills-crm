import { PaymentFormContent } from "@/features/payments";
import { PageContainer } from "@/components/page-container";
import { ROUTES } from "@/lib/routes";

export default function NewPaymentPage() {
  return (
    <PageContainer
      title="Record Payment"
      breadcrumbs={[{ label: "Payments", href: ROUTES.payments }, { label: "Record Payment" }]}
      meta={<span className="text-sm text-zinc-500">Create new Payment</span>}
    >
      <PaymentFormContent />
    </PageContainer>
  );
}
