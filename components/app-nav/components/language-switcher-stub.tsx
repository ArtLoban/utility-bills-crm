import { Globe } from "lucide-react";

export const LanguageSwitcherStub = () => (
  <button
    className="hover:bg-accent hover:text-accent-foreground inline-flex size-9 items-center justify-center rounded-md"
    aria-label="Switch language"
  >
    <Globe className="size-4" />
  </button>
);
