"use client";

import { useState } from "react";
import BottomNavbar from "./BottomNavbar";

export default function MobileMenu({
  menu: _menu,
}: {
  menu?: { id: string; name: string; slug: string }[];
}) {
  const [activeTab, setActiveTab] = useState<
    "home" | "category" | "cart" | "account" | null
  >("home");

  return (
    <BottomNavbar
      onMenuOpen={() => {}}
      setActiveTab={setActiveTab}
      activeTab={activeTab}
    />
  );
}
