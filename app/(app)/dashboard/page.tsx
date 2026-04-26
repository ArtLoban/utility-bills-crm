import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";

const handleSignOut = async () => {
  "use server";
  await signOut({ redirectTo: "/login" });
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session) redirect("/login");

  const t = await getTranslations();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        {t("dashboard.signedInAs")}{" "}
        <span className="font-medium text-zinc-900 dark:text-zinc-50">{session.user.email}</span>
      </p>
      <form action={handleSignOut}>
        <Button type="submit" variant="outline">
          {t("dashboard.signOut")}
        </Button>
      </form>
    </div>
  );
}
