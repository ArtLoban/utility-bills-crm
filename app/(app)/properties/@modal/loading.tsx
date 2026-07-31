// The segment's loading.tsx boundary is applied to every slot, so on client
// navigation the page skeleton renders twice — once for children, once for @modal.
// This empty boundary keeps the modal slot silent while it resolves.
export default function ModalLoading() {
  return null;
}
