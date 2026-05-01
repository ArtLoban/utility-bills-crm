import { getTranslations } from "next-intl/server";
import { HeroSection } from "./_components/home/hero-section";
import { MockupSection } from "./_components/home/mockup-section";
import { FeaturesSection } from "./_components/home/features-section";
import { TechSection } from "./_components/home/tech-section";
import { DashboardMockup } from "./_components/home/dashboard-mockup";
import { PropertyDetailMockup } from "./_components/home/property-detail-mockup";

export default async function LandingPage() {
  const t = await getTranslations("landing");

  return (
    <>
      <HeroSection />

      <MockupSection
        url="app.utilitybills.dev/dashboard"
        caption={t.rich("dashboardSection.caption", {
          strong: (chunks) => (
            <strong className="text-zinc-900 dark:text-zinc-200">{chunks}</strong>
          ),
        })}
      >
        <DashboardMockup />
      </MockupSection>

      <FeaturesSection />

      <MockupSection
        url="app.utilitybills.dev/properties/1"
        caption={t.rich("propertySection.caption", {
          strong: (chunks) => (
            <strong className="text-zinc-900 dark:text-zinc-200">{chunks}</strong>
          ),
        })}
      >
        <PropertyDetailMockup />
      </MockupSection>

      <TechSection />
    </>
  );
}
