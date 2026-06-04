import { notFound } from "next/navigation";
import { getPublicLinks, getPublicProject } from "@/features/landing-cms";
import { ArchSection } from "./_components/arch-section";
import { HeroSection } from "./_components/hero-section";
import { LinksSection } from "./_components/links-section";
import { SchemaSection } from "./_components/schema-section";
import { StackSection } from "./_components/stack-section";
import { StatusSection } from "./_components/status-section";

export default async function ProjectPage() {
  const [projectHero, links] = await Promise.all([getPublicProject(), getPublicLinks()]);

  if (links?.projectUrlAccessible === false) notFound();

  const archCards: [
    { title: string; body: string },
    { title: string; body: string },
    { title: string; body: string },
    { title: string; body: string },
    { title: string; body: string },
    { title: string; body: string },
  ] = [
    { title: projectHero?.arch1Title ?? "", body: projectHero?.arch1Body ?? "" },
    { title: projectHero?.arch2Title ?? "", body: projectHero?.arch2Body ?? "" },
    { title: projectHero?.arch3Title ?? "", body: projectHero?.arch3Body ?? "" },
    { title: projectHero?.arch4Title ?? "", body: projectHero?.arch4Body ?? "" },
    { title: projectHero?.arch5Title ?? "", body: projectHero?.arch5Body ?? "" },
    { title: projectHero?.arch6Title ?? "", body: projectHero?.arch6Body ?? "" },
  ];

  return (
    <>
      <HeroSection
        title={projectHero?.heroTitle ?? ""}
        desc={projectHero?.heroDesc ?? ""}
        githubUrl={links?.projectRepoUrl ?? ""}
      />
      <StackSection />
      <ArchSection cards={archCards} />
      <SchemaSection />
      <StatusSection status={projectHero?.status ?? ""} />
      <LinksSection projectRepoUrl={links?.projectRepoUrl ?? ""} liveDemoUrl={links?.liveDemoUrl} />
    </>
  );
}
