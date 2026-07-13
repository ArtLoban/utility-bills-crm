"use client";

import { FatalError } from "@/components/fatal-error";

type TProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function SecureError(props: TProps) {
  return <FatalError {...props} />;
}
