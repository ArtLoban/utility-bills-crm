import type { Metadata } from "next";

import { LandingCmsClient } from "./_components/landing-cms-client";

export const metadata: Metadata = {
  title: "Landing content — Admin",
  description: "Edit the public landing pages.",
};

export default function AdminLandingPage() {
  return <LandingCmsClient />;
}
