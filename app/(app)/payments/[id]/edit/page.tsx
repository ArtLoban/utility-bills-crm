import { PaymentFormContent } from "@/features/payments";
import { PageContainer } from "@/components/page-container";
import { ROUTES } from "@/lib/routes";

type TProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPaymentPage({ params }: TProps) {
  const { id } = await params;

  // devnote: fetch payment by id and pass full TPaymentRecord when DB query is wired
  return (
    <PageContainer
      title="Edit Payment"
      breadcrumbs={[{ label: "Payments", href: ROUTES.payments }, { label: "Edit Payment" }]}
    >
      <div className="max-w-2xl">
        <PaymentFormContent payment={{ id, serviceId: "", paidAt: "", amount: 0 }} />
      </div>
    </PageContainer>
  );
}
