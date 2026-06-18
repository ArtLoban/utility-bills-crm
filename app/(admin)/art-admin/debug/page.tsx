import type { Metadata } from "next";

import { requireAdmin } from "@/lib/auth/guards";
import { unwrapOrThrow } from "@/lib/unwrap-or-throw";
import { PageContainer } from "@/components/page-container";

import { DebugClient } from "./_components/debug-client";

export const metadata: Metadata = { title: "Debug & support — Admin" };

export default async function AdminDebugPage() {
  await unwrapOrThrow(await requireAdmin());

  return (
    <PageContainer
      title="Debug & support"
      meta={
        <p className="text-muted-foreground mt-1.5 text-sm">
          Trigger errors to verify Sentry capture, the correlation-id bridge, and PII scrubbing.
          Events are only sent when a Sentry DSN is configured.
        </p>
      }
    >
      <DebugClient />
    </PageContainer>
  );
}
