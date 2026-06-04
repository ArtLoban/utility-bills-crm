import { notFound } from "next/navigation";
import { getPublicAbout, getPublicLinks } from "@/features/landing-cms";
import { HeroSection } from "./_components/hero-section";
import { LinksSection } from "./_components/links-section";
import { ProseSection } from "./_components/prose-section";

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
