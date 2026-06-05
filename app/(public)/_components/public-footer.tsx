import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { getPublicLinks } from "@/features/landing-cms";

export const PublicFooter = async () => {
  const links = await getPublicLinks();

  const showAbout = links?.aboutNavVisible ?? true;
  const showProject = links?.projectNavVisible ?? true;

  return (
    <footer style={{ background: "var(--lander-band-bg)" }}>
      <div className="mx-auto max-w-[1100px] px-4 md:px-6">
        <div className="flex flex-col items-center gap-4 py-8 md:flex-row md:justify-center md:gap-7 md:py-9">
          {showAbout && (
            <Link
              href={ROUTES.about}
              className="text-sm text-zinc-200 transition-colors hover:text-white"
            >
              About the developer
            </Link>
          )}
          {showAbout && showProject && <div className="hidden h-3.5 w-px bg-white/20 md:block" />}
          {showProject && (
            <Link
              href={ROUTES.project}
              className="text-sm text-zinc-200 transition-colors hover:text-white"
            >
              Architecture &amp; code
            </Link>
          )}
          {(showAbout || showProject) && <div className="hidden h-3.5 w-px bg-white/20 md:block" />}
          <span className="text-sm text-zinc-400">
            © {new Date().getFullYear()} · Utility Bills CRM
          </span>
        </div>
      </div>
    </footer>
  );
};
