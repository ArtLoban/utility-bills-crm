import { Activity, Blocks, Sparkles } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import type { TFeatureCard, TProjectContent } from "../types";
import { CardSubBlock } from "./card-sub-block";
import { CmsSection } from "./cms-section";
import { FieldLabel } from "./field-label";
import { SaveRow } from "./save-row";

type TProps = {
  form: TProjectContent;
  isDirty: boolean;
  set: <K extends keyof TProjectContent>(field: K, value: TProjectContent[K]) => void;
  setCard: (index: number, field: keyof TFeatureCard, value: string) => void;
  onSave: () => void;
};

export const ProjectTab = ({ form, isDirty, set, setCard, onSave }: TProps) => (
  <div>
    <CmsSection
      icon={<Sparkles className="size-[14px]" />}
      title="Hero"
      description="Top of the project page — intro to the deep-dive."
    >
      <div className="mb-4">
        <FieldLabel hint={`${form.heroTitle.length} chars`} htmlFor="project-hero-title">
          Hero title
        </FieldLabel>
        <Input
          id="project-hero-title"
          value={form.heroTitle}
          onChange={(e) => set("heroTitle", e.target.value)}
          className="h-9 text-[13.5px]"
        />
      </div>
      <div>
        <FieldLabel hint={`${form.heroDesc.length} chars`} htmlFor="project-hero-desc">
          Hero description
        </FieldLabel>
        <Textarea
          id="project-hero-desc"
          value={form.heroDesc}
          onChange={(e) => set("heroDesc", e.target.value)}
          rows={4}
          className="text-[13.5px] leading-[1.55]"
        />
      </div>
    </CmsSection>

    <CmsSection
      icon={<Blocks className="size-[14px]" />}
      title="Architecture highlights"
      description="Six cards explaining the key technical decisions."
    >
      <div className="grid grid-cols-1 gap-3.5">
        {form.archCards.map((card, i) => (
          <CardSubBlock
            key={i}
            index={i + 1}
            title={card.title}
            body={card.body}
            onTitle={(v) => setCard(i, "title", v)}
            onBody={(v) => setCard(i, "body", v)}
          />
        ))}
      </div>
    </CmsSection>

    <CmsSection
      icon={<Activity className="size-[14px]" />}
      title="Current status"
      description="Where the project stands right now."
    >
      <FieldLabel hint={`${form.status.length} chars`} htmlFor="project-status">
        Status
      </FieldLabel>
      <Textarea
        id="project-status"
        value={form.status}
        onChange={(e) => set("status", e.target.value)}
        rows={5}
        className="text-[13.5px] leading-[1.55]"
      />
    </CmsSection>

    <SaveRow isDirty={isDirty} onSave={onSave} />
  </div>
);
