"use client";

import { parseAsStringLiteral, useQueryState } from "nuqs";

import { PageContainer } from "@/components/page-container";

import { useAboutForm } from "./hooks/use-about-form";
import { useGlobalForm } from "./hooks/use-global-form";
import { useHomeForm } from "./hooks/use-home-form";
import { useProjectForm } from "./hooks/use-project-form";
import { CMS_TABS } from "./constants";
import type { TCmsTab } from "./types";
import { AboutTab } from "./components/about-tab";
import { CmsTabBar } from "./components/cms-tab-bar";
import { EditingBanner } from "./components/editing-banner";
import { GlobalTab } from "./components/global-tab";
import { HomeTab } from "./components/home-tab";
import { ProjectTab } from "./components/project-tab";

export const LandingCmsClient = () => {
  const [activeTab, setActiveTab] = useQueryState(
    "tab",
    parseAsStringLiteral(CMS_TABS).withDefault("home"),
  );

  const home = useHomeForm();
  const about = useAboutForm();
  const project = useProjectForm();
  const global = useGlobalForm();

  const dirtyTabs = (
    [
      home.isDirty && "home",
      about.isDirty && "about",
      project.isDirty && "project",
      global.isDirty && "global",
    ] as (TCmsTab | false)[]
  ).filter((t): t is TCmsTab => t !== false);

  return (
    <PageContainer
      title="Landing content"
      meta={
        <p className="text-muted-foreground mt-1.5 text-sm">
          Edit the public landing pages. Changes publish immediately.
        </p>
      }
      breadcrumbs={[{ label: "art-admin", href: "/art-admin" }, { label: "landing" }]}
    >
      <div>
        <div className="-mx-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6 md:mx-0 md:overflow-visible md:px-0">
          <CmsTabBar active={activeTab} onChange={setActiveTab} dirtyTabs={dirtyTabs} />
        </div>

        <div className="mt-5 max-w-[672px]">
          <EditingBanner activeTab={activeTab} />

          {activeTab === "home" && (
            <HomeTab
              form={home.form}
              isDirty={home.isDirty}
              set={home.set}
              setCard={home.setCard}
              onSave={home.save}
            />
          )}
          {activeTab === "about" && (
            <AboutTab
              form={about.form}
              isDirty={about.isDirty}
              set={about.set}
              onSave={about.save}
            />
          )}
          {activeTab === "project" && (
            <ProjectTab
              form={project.form}
              isDirty={project.isDirty}
              set={project.set}
              setCard={project.setCard}
              onSave={project.save}
            />
          )}
          {activeTab === "global" && (
            <GlobalTab
              form={global.form}
              isDirty={global.isDirty}
              set={global.set}
              onSave={global.save}
            />
          )}
        </div>
      </div>
    </PageContainer>
  );
};
