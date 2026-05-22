// app/(app)/payments/[id]/page.tsx
type TProps = {
  params: Promise<{ id: string }>;
};

export default async function PaymentPage({ params }: TProps) {
  const { id } = await params;
  return <div>Full page for payment: {id}</div>;
}
