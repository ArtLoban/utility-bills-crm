import type { z } from "zod";

import type { aboutSchema, globalSchema, homeSchema, projectSchema } from "./schema";

export type THomePayload = z.infer<typeof homeSchema>;
export type TAboutPayload = z.infer<typeof aboutSchema>;
export type TProjectPayload = z.infer<typeof projectSchema>;
export type TGlobalPayload = z.infer<typeof globalSchema>;
