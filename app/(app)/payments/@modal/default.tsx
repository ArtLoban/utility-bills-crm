// app/(app)/@modal/default.tsx
//
// This file is what Next.js renders into the `modal` slot when no
// route matches. Without it, on hard refresh Next.js doesn't know
// what to put in the unmatched slot and renders a 404.
//
// Returning null = "render nothing", which is exactly what we want
// when no modal is open.

export default function ModalDefault() {
  return null;
}
