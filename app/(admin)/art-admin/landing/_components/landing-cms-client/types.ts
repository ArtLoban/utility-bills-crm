export type TCmsTab = "home" | "about" | "project" | "global";

export type TFeatureCard = {
  title: string;
  body: string;
};

export type THomeContent = {
  heroTitle: string;
  heroDesc: string;
  dashboardCaption: string;
  propertyCaption: string;
  featureCards: [TFeatureCard, TFeatureCard, TFeatureCard, TFeatureCard];
  techHighlights: string;
};

export type TAboutContent = {
  heroGreeting: string;
  heroDesc: string;
  worksWith: string;
};

export type TProjectContent = {
  heroTitle: string;
  heroDesc: string;
  archCards: [TFeatureCard, TFeatureCard, TFeatureCard, TFeatureCard, TFeatureCard, TFeatureCard];
  status: string;
};

export type TGlobalContent = {
  linkedinUrl: string;
  githubUrl: string;
  projectRepoUrl: string;
  liveDemoUrl: string;
  aboutNavVisible: boolean;
  aboutUrlAccessible: boolean;
  projectNavVisible: boolean;
  projectUrlAccessible: boolean;
};
