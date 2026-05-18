// app/(app)/layout.tsx
//
// The `modal` prop is the parallel slot. Next.js passes whatever the
// @modal slot resolves to as a prop, alongside the normal `children`.
//
// We render both. When no modal is active, the slot resolves to
// `@modal/default.tsx` (which returns null), so nothing extra renders.
// When a modal route is active (intercepted or otherwise), it renders
// here, overlaying the page.

export default function AppLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {/*
        Your existing app shell — header, nav, etc. — goes here.
        Kept minimal for the prototype.
      */}
      {children}
      {modal}
    </>
  );
}
