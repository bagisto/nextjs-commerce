"use client";

import dynamic from "next/dynamic";

const ThemeSwitcher = dynamic(() => import("./ThemeSwitch"), {
  ssr: false,
});

export default function ThemeSwitcherWrapper() {
  return <ThemeSwitcher />;
}