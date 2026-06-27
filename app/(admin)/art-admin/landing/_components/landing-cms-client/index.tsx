"use client";

import { useEffect } from "react";
import { parseAsStringLiteral, useQueryState } from "nuqs";

import { PageContainer } from "@/components/page-container";
import { ROUTES } from "@/lib/routes";

import { useAboutForm } from "./hooks/use-about-form";
import { useGlobalForm } from "./hooks/use-global-form";
import { useHomeForm } from "./hooks/use-home-form";
import { useProjectForm } from "./hooks/use-project-form";
import { TAB_PARAM } from "@/components/tab-nav/constants";
import { CMS_TABS, CMS_TAB_VALUES, type TCmsTab } from "./constants";
import type { TCmsInitialData } from "./types";
import { AboutTab } from "./components/about-tab";
import { CmsTabBar } from "./components/cms-tab-bar";
import { EditingBanner } from "./components/editing-banner";
import { GlobalTab } from "./components/global-tab";
import { HomeTab } from "./components/home-tab";
import { ProjectTab } from "./components/project-tab";

type TProps = {
  initialData: TCmsInitialData;
};

export const LandingCmsClient = ({ initialData }: TProps) => {
  const [activeTab, setActiveTab] = useQueryState(
    TAB_PARAM,
    parseAsStringLiteral(CMS_TAB_VALUES).withDefault(CMS_TABS.HOME),
  );

  const home = useHomeForm(initialData.home);
  const about = useAboutForm(initialData.about);
  const project = useProjectForm(initialData.project);
  const global = useGlobalForm(initialData.global);

  const anyDirty = home.isDirty || about.isDirty || project.isDirty || global.isDirty;

  useEffect(() => {
    if (!anyDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [anyDirty]);

  const dirtyTabs = (
    [
      home.isDirty && "home",
      about.isDirty && "about",
      project.isDirty && "project",
      global.isDirty && "global",
    ] as (TCmsTab | false)[]
  ).filter((tab): tab is TCmsTab => tab !== false);

  const handleTabChange = (newTab: TCmsTab) => {
    const isDirtyMap: Record<TCmsTab, boolean> = {
      home: home.isDirty,
      about: about.isDirty,
      project: project.isDirty,
      global: global.isDirty,
    };
    if (
      isDirtyMap[activeTab] &&
      !window.confirm("You have unsaved changes on this tab. Switch anyway?")
    ) {
      return;
    }
    void setActiveTab(newTab);
  };

  return (
    <PageContainer
      title="Landing content"
      meta={
        <p className="text-muted-foreground mt-1.5 text-sm">
          Edit the public landing pages. Changes publish immediately.
        </p>
      }
      breadcrumbs={[{ label: "art-admin", href: ROUTES.admin.root }, { label: "landing" }]}
    >
      <div>
        <div className="-mx-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6 md:mx-0 md:overflow-visible md:px-0">
          <CmsTabBar active={activeTab} onChange={handleTabChange} dirtyTabs={dirtyTabs} />
        </div>

        <div className="mt-5 max-w-[672px]">
          <EditingBanner activeTab={activeTab} />

          {activeTab === "home" && <HomeTab form={home.form} onSave={home.handleSave} />}
          {activeTab === "about" && <AboutTab form={about.form} onSave={about.handleSave} />}
          {activeTab === "project" && (
            <ProjectTab form={project.form} onSave={project.handleSave} />
          )}
          {activeTab === "global" && <GlobalTab form={global.form} onSave={global.handleSave} />}
        </div>
      </div>
    </PageContainer>
  );
};
