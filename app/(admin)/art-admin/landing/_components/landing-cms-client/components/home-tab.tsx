"use client";

import { useState } from "react";

import { Code2, ChevronDown, Image as ImageIcon, Layers, Sparkles } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import type { TFeatureCard, THomeContent } from "../types";
import { CardSubBlock } from "./card-sub-block";
import { CmsSection } from "./cms-section";
import { FieldLabel } from "./field-label";
import { SaveRow } from "./save-row";

type TProps = {
  form: THomeContent;
  isDirty: boolean;
  set: <K extends keyof THomeContent>(field: K, value: THomeContent[K]) => void;
  setCard: (index: number, field: keyof TFeatureCard, value: string) => void;
  onSave: () => void;
};

export const HomeTab = ({ form, isDirty, set, setCard, onSave }: TProps) => {
  const [cardsExpanded, setCardsExpanded] = useState(false);
  const [techExpanded, setTechExpanded] = useState(false);

  return (
    <div>
      <CmsSection
        icon={<Sparkles className="size-[14px]" />}
        title="Hero"
        description="Top of the home page — first thing visitors read."
      >
        <div className="mb-4">
          <FieldLabel hint={`${form.heroTitle.length} chars`} htmlFor="home-hero-title">
            Hero title
          </FieldLabel>
          <Input
            id="home-hero-title"
            value={form.heroTitle}
            onChange={(e) => set("heroTitle", e.target.value)}
            className="h-9 text-[13.5px]"
          />
        </div>
        <div>
          <FieldLabel hint={`${form.heroDesc.length} chars`} htmlFor="home-hero-desc">
            Hero description
          </FieldLabel>
          <Textarea
            id="home-hero-desc"
            value={form.heroDesc}
            onChange={(e) => set("heroDesc", e.target.value)}
            rows={4}
            className="text-[13.5px] leading-[1.55]"
          />
        </div>
      </CmsSection>

      <CmsSection
        icon={<ImageIcon className="size-[14px]" />}
        title="Screenshot captions"
        description="Text underneath each product screenshot."
      >
        <div className="mb-4">
          <FieldLabel hint="Under the dashboard mockup" htmlFor="home-cap-dash">
            Dashboard caption
          </FieldLabel>
          <Textarea
            id="home-cap-dash"
            value={form.dashboardCaption}
            onChange={(e) => set("dashboardCaption", e.target.value)}
            rows={2}
            className="text-[13.5px] leading-[1.55]"
          />
        </div>
        <div>
          <FieldLabel hint="Under the property detail mockup" htmlFor="home-cap-prop">
            Property detail caption
          </FieldLabel>
          <Textarea
            id="home-cap-prop"
            value={form.propertyCaption}
            onChange={(e) => set("propertyCaption", e.target.value)}
            rows={2}
            className="text-[13.5px] leading-[1.55]"
          />
        </div>
      </CmsSection>

      {/* Feature cards — collapsible on mobile */}
      <div className="border-border bg-card mb-5 overflow-hidden rounded-[10px] border">
        <button
          type="button"
          onClick={() => setCardsExpanded((v) => !v)}
          className="border-border flex w-full items-start gap-3 border-b px-6 pt-[18px] pb-4 md:cursor-default"
        >
          <div className="bg-muted text-muted-foreground mt-px flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg">
            <Layers className="size-[14px]" />
          </div>
          <div className="min-w-0 flex-1 text-left">
            <div className="text-foreground font-semibold tracking-tight text-[var(--font-size-md)]">
              Feature cards
            </div>
            <div className="text-muted-foreground mt-0.5 text-[12.5px]">
              Four cards highlighting what the product does.
            </div>
          </div>
          <ChevronDown
            className={`text-muted-foreground mt-px size-4 shrink-0 transition-transform md:hidden ${cardsExpanded ? "rotate-180" : ""}`}
          />
        </button>
        <div className={`p-[22px_24px] md:block ${cardsExpanded ? "block" : "hidden"}`}>
          <div className="grid grid-cols-1 gap-3.5">
            {form.featureCards.map((card, i) => (
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
        </div>
      </div>

      {/* Tech highlights — collapsible on mobile */}
      <div className="border-border bg-card mb-5 overflow-hidden rounded-[10px] border">
        <button
          type="button"
          onClick={() => setTechExpanded((v) => !v)}
          className="border-border flex w-full items-start gap-3 border-b px-6 pt-[18px] pb-4 md:cursor-default"
        >
          <div className="bg-muted text-muted-foreground mt-px flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg">
            <Code2 className="size-[14px]" />
          </div>
          <div className="min-w-0 flex-1 text-left">
            <div className="text-foreground font-semibold tracking-tight text-[var(--font-size-md)]">
              Tech highlights
            </div>
            <div className="text-muted-foreground mt-0.5 text-[12.5px]">
              Single line under the feature cards. Plain text.
            </div>
          </div>
          <ChevronDown
            className={`text-muted-foreground mt-px size-4 shrink-0 transition-transform md:hidden ${techExpanded ? "rotate-180" : ""}`}
          />
        </button>
        <div className={`p-[22px_24px] md:block ${techExpanded ? "block" : "hidden"}`}>
          <FieldLabel
            hint={`${form.techHighlights.length} chars · single line`}
            htmlFor="home-tech"
          >
            Tech highlights line
          </FieldLabel>
          <Input
            id="home-tech"
            value={form.techHighlights}
            onChange={(e) => set("techHighlights", e.target.value)}
            className="h-9 text-[13.5px]"
          />
        </div>
      </div>

      <SaveRow isDirty={isDirty} onSave={onSave} />
    </div>
  );
};
