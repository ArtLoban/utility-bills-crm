import type { ReactNode } from "react";

type TProps = {
  children: ReactNode;
  modal: ReactNode;
};

export default function ProvidersLayout({ children, modal }: TProps) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
