import { NuqsAdapter } from "nuqs/adapters/next/app";

type TProps = { children: React.ReactNode };

export default function PaymentsNewLayout({ children }: TProps) {
  return <NuqsAdapter>{children}</NuqsAdapter>;
}
