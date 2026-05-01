import { ArchSection } from "./_components/arch-section";
import { HeroSection } from "./_components/hero-section";
import { LinksSection } from "./_components/links-section";
import { SchemaSection } from "./_components/schema-section";
import { StackSection } from "./_components/stack-section";
import { StatusSection } from "./_components/status-section";

export default function ProjectPage() {
  return (
    <>
      <HeroSection />
      <StackSection />
      <ArchSection />
      <SchemaSection />
      <StatusSection />
      <LinksSection />
    </>
  );
}
