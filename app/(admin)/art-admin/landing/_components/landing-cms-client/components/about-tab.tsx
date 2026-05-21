import { Briefcase, User } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import type { TAboutContent } from "../types";
import { CmsSection } from "./cms-section";
import { FieldLabel } from "./field-label";
import { SaveRow } from "./save-row";

type TProps = {
  form: TAboutContent;
  isDirty: boolean;
  set: <K extends keyof TAboutContent>(field: K, value: TAboutContent[K]) => void;
  onSave: () => void;
};

export const AboutTab = ({ form, isDirty, set, onSave }: TProps) => {
  const paragraphCount = form.worksWith.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;

  return (
    <div>
      <CmsSection
        icon={<User className="size-[14px]" />}
        title="Hero"
        description="Top of the about page — personal intro."
      >
        <div className="mb-4">
          <FieldLabel hint={`${form.heroGreeting.length} chars`} htmlFor="about-greeting">
            Hero greeting
          </FieldLabel>
          <Input
            id="about-greeting"
            value={form.heroGreeting}
            onChange={(e) => set("heroGreeting", e.target.value)}
            className="h-9 text-[13.5px]"
          />
        </div>
        <div>
          <FieldLabel hint={`${form.heroDesc.length} chars`} htmlFor="about-hero-desc">
            Hero description
          </FieldLabel>
          <Textarea
            id="about-hero-desc"
            value={form.heroDesc}
            onChange={(e) => set("heroDesc", e.target.value)}
            rows={2}
            className="text-[13.5px] leading-[1.55]"
          />
        </div>
      </CmsSection>

      <CmsSection
        icon={<Briefcase className="size-[14px]" />}
        title="What I work with"
        description="Three paragraphs separated by blank lines. Plain text only."
      >
        <div>
          <FieldLabel
            hint={`${form.worksWith.length} chars · ${paragraphCount} paragraphs`}
            htmlFor="about-works-with"
          >
            Content
          </FieldLabel>
          <Textarea
            id="about-works-with"
            value={form.worksWith}
            onChange={(e) => set("worksWith", e.target.value)}
            rows={11}
            className="min-h-[264px] text-[13.5px] leading-[1.55]"
          />
          <p className="text-muted-foreground mt-2.5 text-xs leading-[1.55]">
            Separate paragraphs with a blank line. No rich-text formatting — line breaks render as
            written.
          </p>
        </div>
      </CmsSection>

      <SaveRow isDirty={isDirty} onSave={onSave} />
    </div>
  );
};
