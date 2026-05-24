"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DrawerHeader } from "./components/drawer-header";
import { DrawerNav } from "./components/drawer-nav";
import { DrawerPrefs } from "./components/drawer-prefs";
import { DrawerAccount } from "./components/drawer-account";
import { DrawerLangPanel } from "./components/drawer-lang-panel";
import type { TLink, TNavUser } from "../../types";

type TView = "main" | "lang";

type TProps = {
  links: TLink[];
  user: TNavUser;
};

export const AppNavMobileMenu = ({ links, user }: TProps) => {
  const [view, setView] = useState<TView>("main");

  return (
    <Sheet onOpenChange={(open) => !open && setView("main")}>
      <SheetTrigger
        aria-label="Open menu"
        className="hover:bg-accent hover:text-accent-foreground inline-flex size-9 items-center justify-center rounded-md md:hidden"
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="gap-0 p-0 data-[side=right]:w-80 data-[side=right]:sm:max-w-80"
      >
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <DrawerHeader user={user} />

        {view === "main" ? (
          <>
            <div className="flex-1 overflow-y-auto">
              <DrawerNav links={links} />
              <div className="bg-border mx-4 h-px" />
              <DrawerPrefs onLangOpen={() => setView("lang")} />
            </div>
            <div className="border-t">
              <DrawerAccount user={user} />
            </div>
          </>
        ) : (
          <DrawerLangPanel onBack={() => setView("main")} />
        )}
      </SheetContent>
    </Sheet>
  );
};
