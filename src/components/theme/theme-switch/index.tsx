"use client";

import dynamic from "next/dynamic";
import { IconSkeleton } from "@/components/common/skeleton/IconSkeleton";

const ThemeSwitcher = dynamic(() => import("./ThemeSwitch"), {
  ssr: false,
  loading: () => <IconSkeleton />,
});

export default function ThemeSwitcherWrapper() {
  return <ThemeSwitcher />;
}