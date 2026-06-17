import { ROUTES } from "@/lib/routes";
import { getPublicLinks } from "@/features/landing-cms";
import { FooterNav, type TFooterLink } from "./footer-nav";

export const PublicFooter = async () => {
  const links = await getPublicLinks();

  const showAbout = links?.aboutNavVisible ?? true;
  const showProject = links?.projectNavVisible ?? true;

  const footerLinks: TFooterLink[] = [
    ...(showAbout ? [{ href: ROUTES.about, label: "About the developer" }] : []),
    ...(showProject ? [{ href: ROUTES.project, label: "Architecture & code" }] : []),
    { href: ROUTES.terms, label: "Terms of Service" },
    { href: ROUTES.privacy, label: "Privacy Policy" },
  ];

  return (
    <footer style={{ background: "var(--lander-band-bg)" }}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex flex-col items-center gap-3 py-8 md:flex-row md:flex-wrap md:justify-center md:gap-x-5 md:gap-y-2.5 md:py-9">
          <FooterNav links={footerLinks} />
          <span aria-hidden className="hidden h-3.5 w-px bg-white/20 md:block" />
          <span className="text-sm text-zinc-400">
            © {new Date().getFullYear()} · Utility Bills CRM
          </span>
        </div>
      </div>
    </footer>
  );
};
