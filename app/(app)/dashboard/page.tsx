import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { withCorrelationId } from "@/lib/logger";
import { getCorrelationId } from "@/lib/logger/get-correlation-id";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const correlationId = await getCorrelationId();
  const log = withCorrelationId(correlationId);
  log.info({ userId: session.user.id }, "dashboard rendered");

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Dashboard
      </h1>
      <p className="text-zinc-500 dark:text-zinc-400">Todo</p>
    </div>
  );
}
