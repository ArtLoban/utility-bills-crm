// Renders into the @modal slot when no intercepting route is active.
// Required by Next.js — without this file, hard navigation throws on parallel route mismatch.
export default function ModalDefault() {
  return null;
}
