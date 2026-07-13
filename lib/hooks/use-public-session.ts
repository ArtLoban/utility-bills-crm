"use client";

import { useEffect, useState } from "react";
import type { TNavUser } from "@/lib/types/nav";

type TResult = {
  user: TNavUser | null;
};

type TSessionResponse = {
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    systemRole: TNavUser["systemRole"];
    ruLocaleEnabled: boolean;
  };
};

let cachedRequest: Promise<TNavUser | null> | null = null;

const fetchNavUser = async (): Promise<TNavUser | null> => {
  const res = await fetch("/api/auth/session", { credentials: "include" });
  if (!res.ok) return null;

  const data: TSessionResponse | null = await res.json();
  const user = data?.user;
  if (!user) return null;

  return {
    id: user.id,
    name: user.name ?? null,
    email: user.email ?? null,
    image: user.image ?? null,
    systemRole: user.systemRole,
    ruLocaleEnabled: user.ruLocaleEnabled,
  };
};

export const usePublicSession = (): TResult => {
  const [user, setUser] = useState<TNavUser | null>(null);

  useEffect(() => {
    let active = true;
    cachedRequest ??= fetchNavUser();

    cachedRequest
      .then((resolved) => {
        if (active) setUser(resolved);
      })
      .catch(() => {
        if (active) setUser(null);
      });

    return () => {
      active = false;
    };
  }, []);

  return { user };
};
