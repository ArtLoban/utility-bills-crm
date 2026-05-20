import { redirect } from "next/navigation";

type TProps = {
  params: Promise<{ id: string }>;
};

export default async function HardDeletePage({ params }: TProps) {
  const { id } = await params;
  redirect(`/art-admin/properties/${id}`);
}
