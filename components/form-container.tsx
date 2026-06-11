import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";

const SIZE_MAP = {
  sm: { maxWidth: "max-w-[440px]" },
  // sm: { maxWidth: "max-w-[598px]" },
  md: { maxWidth: "max-w-[758px]" },
} as const;

type TProps = {
  children: ReactNode;
  onSubmit: () => void;
  backHref: string;
  submitText?: string;
  cancelText?: string;
  savingText?: string;
  footerText?: string;
  canSave?: boolean;
  isSaving?: boolean;
  size?: keyof typeof SIZE_MAP;
  className?: string;
  noCard?: boolean;
};

export const FormContainer = (props: TProps) => {
  const {
    children,
    onSubmit,
    backHref,
    submitText = "Save",
    cancelText = "Cancel",
    savingText = "Saving…",
    footerText = "Changes are saved to your account and synced across devices.",
    canSave = true,
    isSaving = false,
    size = "sm",
    className,
    noCard = false,
  } = props;

  const { maxWidth } = SIZE_MAP[size];

  return (
    <div className={cn("mx-auto w-full", maxWidth, className)}>
      {noCard ? children : <div className="rounded-lg border p-6">{children}</div>}
      <div className="mt-5 flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link href={backHref}>
            <ChevronLeft size={16} />
            {cancelText}
          </Link>
        </Button>
        <Button type="button" onClick={onSubmit} disabled={isSaving || !canSave}>
          {isSaving ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              {savingText}
            </>
          ) : (
            submitText
          )}
        </Button>
      </div>
      <div className="mt-4 text-center text-xs text-zinc-500">{footerText}</div>
    </div>
  );
};
