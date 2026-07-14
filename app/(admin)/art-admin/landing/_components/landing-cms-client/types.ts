import type {
  TAboutPayload,
  TGlobalPayload,
  THomePayload,
  TProjectPayload,
} from "@/features/landing-cms";

export type TCmsInitialData = {
  home: THomePayload;
  about: TAboutPayload;
  project: TProjectPayload;
  global: TGlobalPayload;
};
