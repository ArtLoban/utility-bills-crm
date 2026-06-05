import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicAbout, getPublicLinks } from "@/features/landing-cms";
import { HeroSection } from "./_components/hero-section";
import { LinksSection } from "./_components/links-section";
import { ProseSection } from "./_components/prose-section";

export const generateMetadata = async (): Promise<Metadata> => {
  const aboutHero = await getPublicAbout();
  const title = aboutHero?.heroGreeting ?? "About";
  const description = aboutHero?.heroDesc ?? "";
  return {
    title,
    description,
    openGraph: {
      type: "website",
      url: "/about",
      title,
      description,
      siteName: "Utility Bills CRM",
    },
    twitter: { card: "summary_large_image", title, description },
  };
};

export default async function AboutPage() {
  const [aboutHero, links] = await Promise.all([getPublicAbout(), getPublicLinks()]);

  if (links?.aboutUrlAccessible === false) notFound();

  return (
    <>
      <HeroSection greeting={aboutHero?.heroGreeting ?? ""} desc={aboutHero?.heroDesc ?? ""} />
      <ProseSection worksWith={aboutHero?.worksWith ?? ""} />
      <LinksSection linkedinUrl={links?.linkedinUrl ?? ""} githubUrl={links?.githubUrl ?? ""} />
    </>
  );
}
