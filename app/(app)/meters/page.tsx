import type { Metadata } from "next";

import { MetersClient } from "./_components/meters-client";

export const metadata: Metadata = {
  title: "Meters",
  description: "Monitor meter readings and consumption across your properties.",
};

export default function MetersPage() {
  return <MetersClient />;
}
