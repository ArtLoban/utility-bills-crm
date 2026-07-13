import { PublicLogo } from "@/components/public-logo";
import { PublicMobileMenu } from "@/components/public-mobile-menu";
import { PublicHeaderActions } from "@/components/public-header-actions";
import { ROUTES } from "@/lib/routes";
import { PublicHeaderShell } from "@/components/public-header-shell";
import { PublicNav } from "@/components/public-nav";
import { getPublicLinks } from "@/features/landing-cms";

export const PublicHeader = async () => {
  const links = await getPublicLinks();

  const showAbout = links?.aboutNavVisible ?? true;
  const showProject = links?.projectNavVisible ?? true;

  const navLinks = [
    { href: ROUTES.home, label: "Home" },
    ...(showAbout ? [{ href: ROUTES.about, label: "About" }] : []),
    ...(showProject ? [{ href: ROUTES.project, label: "Project" }] : []),
  ];

  return (
    <PublicHeaderShell>
      <div className="mx-auto flex h-full max-w-6xl items-center gap-8 px-6">
        <PublicLogo />
        <PublicNav links={navLinks} />
        <PublicHeaderActions />
        <div className="ml-auto md:hidden">
          <PublicMobileMenu showAbout={showAbout} showProject={showProject} />
        </div>
      </div>
    </PublicHeaderShell>
  );
};
