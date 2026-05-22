import { PaymentFormContent } from "@/features/payments";
import { PageContainer } from "@/components/page-container";
import { ROUTES } from "@/lib/routes";

export default function NewPaymentPage() {
  return (
    <PageContainer
      title="Record Payment"
      breadcrumbs={[{ label: "Payments", href: ROUTES.payments }, { label: "Record Payment" }]}
    >
      <div className="max-w-2xl">
        <PaymentFormContent />
      </div>
    </PageContainer>
  );
}
