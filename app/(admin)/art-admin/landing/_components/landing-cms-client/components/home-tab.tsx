"use client";

import { useState } from "react";
import { Controller, type Path, type UseFormReturn } from "react-hook-form";

import { ChevronDown, Code2, Image as ImageIcon, Layers, Sparkles } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { THomePayload } from "@/features/landing-cms";

import { CardSubBlock } from "./card-sub-block";
import { CmsSection } from "./cms-section";
import { FieldLabel } from "./field-label";
import { SaveRow } from "./save-row";

type TProps = {
  form: UseFormReturn<THomePayload>;
  onSave: () => void;
};

export const HomeTab = ({ form, onSave }: TProps) => {
  const [cardsExpanded, setCardsExpanded] = useState(false);
  const [techExpanded, setTechExpanded] = useState(false);

  const { isDirty, isSubmitting } = form.formState;

  const heroTitle = form.watch("heroTitle");
  const heroDesc = form.watch("heroDesc");
  const techHighlights = form.watch("techHighlights");
  const featureCards = form.watch("featureCards");
  const featureCardErrors = form.formState.errors.featureCards;

  return (
    <div>
      <CmsSection
        icon={<Sparkles className="size-[14px]" />}
        title="Hero"
        description="Top of the home page — first thing visitors read."
      >
        <div className="mb-4">
          <Controller
            control={form.control}
            name="heroTitle"
            render={({ field, fieldState }) => (
              <div>
                <FieldLabel hint={`${heroTitle.length} chars`} htmlFor="home-hero-title">
                  Hero title
                </FieldLabel>
                <Input
                  id="home-hero-title"
                  value={field.value}
                  onChange={field.onChange}
                  className="h-9 text-[13.5px]"
                />
                {fieldState.error && (
                  <p className="text-destructive mt-1 text-xs">{fieldState.error.message}</p>
                )}
              </div>
            )}
          />
        </div>
        <div>
          <Controller
            control={form.control}
            name="heroDesc"
            render={({ field, fieldState }) => (
              <div>
                <FieldLabel hint={`${heroDesc.length} chars`} htmlFor="home-hero-desc">
                  Hero description
                </FieldLabel>
                <Textarea
                  id="home-hero-desc"
                  value={field.value}
                  onChange={field.onChange}
                  rows={4}
                  className="text-[13.5px] leading-[1.55]"
                />
                {fieldState.error && (
                  <p className="text-destructive mt-1 text-xs">{fieldState.error.message}</p>
                )}
              </div>
            )}
          />
        </div>
      </CmsSection>

      <CmsSection
        icon={<ImageIcon className="size-[14px]" />}
        title="Screenshot captions"
        description="Text underneath each product screenshot."
      >
        <div className="mb-4">
          <Controller
            control={form.control}
            name="dashboardCaption"
            render={({ field, fieldState }) => (
              <div>
                <FieldLabel hint="Under the dashboard mockup" htmlFor="home-cap-dash">
                  Dashboard caption
                </FieldLabel>
                <Textarea
                  id="home-cap-dash"
                  value={field.value}
                  onChange={field.onChange}
                  rows={2}
                  className="text-[13.5px] leading-[1.55]"
                />
                {fieldState.error && (
                  <p className="text-destructive mt-1 text-xs">{fieldState.error.message}</p>
                )}
                <p className="text-muted-foreground mt-2.5 text-xs leading-[1.55]">
                  Supports **bold** and `code` markers.
                </p>
              </div>
            )}
          />
        </div>
        <div>
          <Controller
            control={form.control}
            name="propertyCaption"
            render={({ field, fieldState }) => (
              <div>
                <FieldLabel hint="Under the property detail mockup" htmlFor="home-cap-prop">
                  Property detail caption
                </FieldLabel>
                <Textarea
                  id="home-cap-prop"
                  value={field.value}
                  onChange={field.onChange}
                  rows={2}
                  className="text-[13.5px] leading-[1.55]"
                />
                {fieldState.error && (
                  <p className="text-destructive mt-1 text-xs">{fieldState.error.message}</p>
                )}
                <p className="text-muted-foreground mt-2.5 text-xs leading-[1.55]">
                  Supports **bold** and `code` markers.
                </p>
              </div>
            )}
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
            {featureCards.map((card, i) => (
              <CardSubBlock
                key={i}
                index={i + 1}
                title={card.title}
                body={card.body}
                onTitle={(v) =>
                  form.setValue(`featureCards.${i}.title` as Path<THomePayload>, v, {
                    shouldDirty: true,
                  })
                }
                onBody={(v) =>
                  form.setValue(`featureCards.${i}.body` as Path<THomePayload>, v, {
                    shouldDirty: true,
                  })
                }
                titleError={featureCardErrors?.[i]?.title?.message}
                bodyError={featureCardErrors?.[i]?.body?.message}
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
              Single line under the feature cards. Supports **bold** and `code` markers.
            </div>
          </div>
          <ChevronDown
            className={`text-muted-foreground mt-px size-4 shrink-0 transition-transform md:hidden ${techExpanded ? "rotate-180" : ""}`}
          />
        </button>
        <div className={`p-[22px_24px] md:block ${techExpanded ? "block" : "hidden"}`}>
          <Controller
            control={form.control}
            name="techHighlights"
            render={({ field, fieldState }) => (
              <div>
                <FieldLabel
                  hint={`${techHighlights.length} chars · single line`}
                  htmlFor="home-tech"
                >
                  Tech highlights line
                </FieldLabel>
                <Input
                  id="home-tech"
                  value={field.value}
                  onChange={field.onChange}
                  className="h-9 text-[13.5px]"
                />
                {fieldState.error && (
                  <p className="text-destructive mt-1 text-xs">{fieldState.error.message}</p>
                )}
              </div>
            )}
          />
        </div>
      </div>

      <SaveRow isDirty={isDirty} isSaving={isSubmitting} onSave={onSave} />
    </div>
  );
};
