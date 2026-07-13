import type { Metadata } from "next";

import { telegramLinkStatus } from "@/features/notifications";
import { requireAdmin } from "@/lib/auth/guards";
import { unwrapOrThrow } from "@/lib/unwrap-or-throw";
import { PageContainer } from "@/components/page-container";

import { DebugClient } from "./_components/debug-client";

export const metadata: Metadata = { title: "Debug & support — Admin" };

export default async function AdminDebugPage() {
  const adminId = await unwrapOrThrow(await requireAdmin());
  const telegramStatus = await telegramLinkStatus(adminId);

  return (
    <PageContainer
      title="Debug & support"
      meta={
        <p className="text-muted-foreground mt-1.5 text-sm">
          Verify Sentry capture (the correlation-id bridge and PII scrubbing), and send a sample
          Telegram digest to your own chat to exercise the notification path. Events are only sent
          when the corresponding service is configured.
        </p>
      }
    >
      <DebugClient telegramStatus={telegramStatus} />
    </PageContainer>
  );
}
