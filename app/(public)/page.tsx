import { getPublicHome } from "@/features/landing-cms";
import { HeroSection } from "./_components/home/hero-section";
import { MockupSection } from "./_components/home/mockup-section";
import { FeaturesSection } from "./_components/home/features-section";
import { TechSection } from "./_components/home/tech-section";
import { DashboardMockup } from "./_components/home/dashboard-mockup";
import { PropertyDetailMockup } from "./_components/home/property-detail-mockup";

export default async function LandingPage() {
  const { homeHero, features } = await getPublicHome();

  const featureCards: [
    { title: string; body: string },
    { title: string; body: string },
    { title: string; body: string },
    { title: string; body: string },
  ] = [
    {
      title: features?.feature1Title ?? "",
      body: features?.feature1Body ?? "",
    },
    {
      title: features?.feature2Title ?? "",
      body: features?.feature2Body ?? "",
    },
    {
      title: features?.feature3Title ?? "",
      body: features?.feature3Body ?? "",
    },
    {
      title: features?.feature4Title ?? "",
      body: features?.feature4Body ?? "",
    },
  ];

  return (
    <>
      <HeroSection heroTitle={homeHero?.heroTitle ?? ""} heroDesc={homeHero?.heroDesc ?? ""} />

      <MockupSection
        url="app.utilitybills.dev/dashboard"
        caption={homeHero?.dashboardCaption ?? ""}
      >
        <DashboardMockup />
      </MockupSection>

      <FeaturesSection cards={featureCards} />

      <MockupSection
        url="app.utilitybills.dev/properties/1"
        caption={homeHero?.propertyCaption ?? ""}
      >
        <PropertyDetailMockup />
      </MockupSection>

      <TechSection techHighlights={homeHero?.techHighlights ?? ""} />
    </>
  );
}
