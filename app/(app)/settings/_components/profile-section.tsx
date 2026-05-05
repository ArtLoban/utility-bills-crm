"use client";

import { useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  FieldHint,
  FieldLabel,
  SettingsCard,
  SettingsCardBody,
  SettingsCardFooter,
  SettingsCardHeader,
} from "./settings-card";

type TProps = {
  name: string | null;
  email: string | null;
  image: string | null;
};

const ProfileSection = ({ name, email, image }: TProps) => {
  const initialName = name ?? "";
  const [currentName, setCurrentName] = useState(initialName);
  const [savedName, setSavedName] = useState(initialName);
  const dirty = currentName !== savedName;

  const initials = (name ?? "?").charAt(0).toUpperCase();

  const handleSave = () => setSavedName(currentName);

  return (
    <SettingsCard>
      <SettingsCardHeader title="Profile" description="Your basic information." />
      <SettingsCardBody>
        {/* Avatar row */}
        <div className="flex items-center gap-4">
          {image ? (
            <Image
              src={image}
              alt={name ?? "Avatar"}
              width={64}
              height={64}
              className="size-16 shrink-0 rounded-full border-2 border-violet-200 dark:border-violet-800"
            />
          ) : (
            <div className="flex size-16 shrink-0 items-center justify-center rounded-full border-2 border-violet-200 bg-violet-100 text-2xl font-semibold text-violet-600 dark:border-violet-800 dark:bg-violet-900/30 dark:text-violet-400">
              {initials}
            </div>
          )}
          <p className="max-w-[340px] text-sm leading-[1.6] text-zinc-500 dark:text-zinc-400">
            Your avatar comes from Google. Sign in with a different Google account to change it.
          </p>
        </div>

        {/* Name */}
        <div>
          <FieldLabel>Name</FieldLabel>
          <Input
            value={currentName}
            onChange={(e) => setCurrentName(e.target.value)}
            className="h-9"
          />
        </div>

        {/* Email */}
        <div>
          <FieldLabel>Email</FieldLabel>
          <Input value={email ?? ""} disabled className="h-9" />
          <FieldHint>Managed by Google. Sign in with a different account to change.</FieldHint>
        </div>
      </SettingsCardBody>
      <SettingsCardFooter>
        <Button disabled={!dirty} onClick={handleSave} style={{ height: 36 }}>
          Save changes
        </Button>
      </SettingsCardFooter>
    </SettingsCard>
  );
};

export { ProfileSection };
