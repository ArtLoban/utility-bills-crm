import type { Metadata } from "next";
import { getPublicHome } from "@/features/landing-cms";
import { ROUTES } from "@/lib/routes";
import { CmsText } from "@/components/cms-text";
import { MOCKUP_HOST } from "./_components/home/constants";
import { HeroSection } from "./_components/home/hero-section";
import { MockupSection } from "./_components/home/mockup-section";
import { FeaturesSection } from "./_components/home/features-section";
import { TechSection } from "./_components/home/tech-section";
import { DashboardMockup } from "./_components/home/dashboard-mockup";
import { PropertyDetailMockup } from "./_components/home/property-detail-mockup";

export const generateMetadata = async (): Promise<Metadata> => {
  const { homeHero } = await getPublicHome();
  const title = homeHero?.heroTitle ?? "Utility Bills CRM";
  const description = homeHero?.heroDesc ?? "Personal utility bills tracker";
  return {
    title: { absolute: title },
    description,
    openGraph: { type: "website", url: "/", title, description, siteName: "Utility Bills CRM" },
    twitter: { card: "summary_large_image", title, description },
  };
};

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
        url={`${MOCKUP_HOST}${ROUTES.dashboard}`}
        caption={<CmsText value={homeHero?.dashboardCaption ?? ""} />}
      >
        <DashboardMockup />
      </MockupSection>

      <FeaturesSection cards={featureCards} />

      <MockupSection
        url={`${MOCKUP_HOST}${ROUTES.properties}/1`}
        caption={<CmsText value={homeHero?.propertyCaption ?? ""} />}
      >
        <PropertyDetailMockup />
      </MockupSection>

      <TechSection techHighlights={homeHero?.techHighlights ?? ""} />
    </>
  );
}
