"use client";

import { type UseFormReturn } from "react-hook-form";

import { Briefcase, Eye, Folder, GitBranch, Link } from "lucide-react";

import { Form } from "@/components/ui/form";
import type { TGlobalPayload } from "@/features/landing-cms";
import { ROUTES } from "@/lib/routes";

import { CmsSection } from "./cms-section";
import { SaveRow } from "./save-row";
import { UrlField } from "./url-field";
import { VisibilityRow } from "./visibility-row";

type TProps = {
  form: UseFormReturn<TGlobalPayload>;
  onSave: () => void;
};

export const GlobalTab = ({ form, onSave }: TProps) => {
  const { isDirty, isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <CmsSection
        icon={<Link className="size-3.5" />}
        title="External links"
        description="URLs used across the landing — header, footer, project page."
      >
        <div className="flex flex-col gap-4.5">
          <UrlField
            control={form.control}
            name="linkedinUrl"
            icon={<Briefcase className="size-3.5" />}
            label="LinkedIn URL"
            hint="Header & about page"
          />
          <UrlField
            control={form.control}
            name="githubUrl"
            icon={<GitBranch className="size-3.5" />}
            label="GitHub profile URL"
            hint="Header & about page"
          />
          <UrlField
            control={form.control}
            name="projectRepoUrl"
            icon={<Folder className="size-3.5" />}
            label="Project repository URL"
            hint="Project page"
          />
        </div>
      </CmsSection>

      <CmsSection
        icon={<Eye className="size-3.5" />}
        title="Page visibility"
        description="Each page has two independent switches — nav visibility and URL access."
      >
        <div className="flex flex-col gap-3">
          <VisibilityRow
            pageName="About page"
            pagePath={ROUTES.about}
            control={form.control}
            navVisibleName="aboutNavVisible"
            urlAccessibleName="aboutUrlAccessible"
          />
          <VisibilityRow
            pageName="Project page"
            pagePath={ROUTES.project}
            control={form.control}
            navVisibleName="projectNavVisible"
            urlAccessibleName="projectUrlAccessible"
          />
        </div>
        <p className="text-muted-foreground mt-3.5 text-xs leading-[1.55]">
          <strong className="text-foreground font-medium">
            &ldquo;Visible in navigation&rdquo;
          </strong>{" "}
          shows the page link in the public header.{" "}
          <strong className="text-foreground font-medium">&ldquo;URL accessible&rdquo;</strong>{" "}
          controls whether the page can be opened directly. A page can be reachable by URL while
          hidden from the nav.
        </p>
      </CmsSection>

      <SaveRow isDirty={isDirty} isSaving={isSubmitting} onSave={onSave} />
    </Form>
  );
};
