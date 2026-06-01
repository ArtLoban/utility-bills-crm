import type {
  TAboutPayload,
  TGlobalPayload,
  THomePayload,
  TProjectPayload,
} from "@/features/landing-cms";

export type TCmsTab = "home" | "about" | "project" | "global";

export type TCmsInitialData = {
  home: THomePayload;
  about: TAboutPayload;
  project: TProjectPayload;
  global: TGlobalPayload;
};
