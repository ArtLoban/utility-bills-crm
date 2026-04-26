import Link from "next/link";
import { signIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";

const googleSignIn = async () => {
  "use server";
  await signIn("google", { redirectTo: "/dashboard" });
};

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Utility Bills CRM</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Sign in to continue</p>
      </div>
      <form action={googleSignIn}>
        <Button type="submit">Sign in with Google</Button>
      </form>
      <Link
        href="/"
        className="text-sm text-zinc-500 underline-offset-4 hover:underline dark:text-zinc-400"
      >
        Back to home
      </Link>
    </div>
  );
}
