import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { signIn } from "@/lib/auth";
import { ROUTES } from "@/lib/routes";
import { Logo } from "@/components/logo";
import { AuthCard } from "@/app/(auth)/_components/auth-card";
import { GoogleIcon } from "./_components/google-icon";
import { RememberMe } from "./_components/remember-me";

const googleSignIn = async () => {
  "use server";
  await signIn("google", { redirectTo: ROUTES.dashboard });
};

export default async function LoginPage() {
  return (
    <AuthCard>
      <div className="mb-7 flex justify-center">
        <Logo href={ROUTES.home} />
      </div>

      <h1 className="mb-1.5 text-center text-2xl font-bold tracking-[-0.5px]">Sign in</h1>
      <p className="mb-7 text-center text-sm leading-[1.45] text-zinc-500">
        Track your utility bills across properties.
      </p>

      <form action={googleSignIn} className="mb-3.5">
        <button
          type="submit"
          className="flex h-10 w-full cursor-pointer items-center justify-center gap-2.5 rounded-md bg-violet-700 text-sm font-semibold text-white transition-colors hover:bg-violet-800 dark:border dark:border-[#dadce0] dark:bg-white dark:text-[#1f1f1f] dark:shadow-[0_1px_2px_rgba(0,0,0,0.12)] dark:hover:bg-zinc-50"
        >
          <GoogleIcon />
          Continue with Google
        </button>
      </form>

      <RememberMe label="Remember me for 30 days" />

      <div className="flex items-center gap-2.5">
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
        <span className="text-xs font-medium text-zinc-500">or</span>
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
      </div>

      <Link
        href="/auth/demo"
        className="mt-4 mb-2 flex h-[38px] w-full items-center justify-center gap-1.5 rounded-md border border-zinc-200 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
      >
        Try demo
        <ArrowRight className="size-[13px]" strokeWidth={2} />
      </Link>
      <p className="text-center text-xs text-zinc-500">
        View a sample workspace. No account needed.
      </p>

      <Link
        href={ROUTES.home}
        className="mt-6 flex items-center justify-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
      >
        <ArrowLeft className="size-3" strokeWidth={2} />
        Back to home
      </Link>
    </AuthCard>
  );
}
