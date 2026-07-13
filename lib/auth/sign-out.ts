"use client";

import { ROUTES } from "@/lib/routes";
import { signOutAction } from "@/lib/auth/actions";

export const signOutAndGoHome = async (): Promise<void> => {
  await signOutAction();
  window.location.assign(ROUTES.home);
};
