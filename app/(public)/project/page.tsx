import { ArchSection } from "../_components/project/arch-section";
import { HeroSection } from "../_components/project/hero-section";
import { LinksSection } from "../_components/project/links-section";
import { SchemaSection } from "../_components/project/schema-section";
import { StackSection } from "../_components/project/stack-section";
import { StatusSection } from "../_components/project/status-section";

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
