"use client";

import MobileNavHeader from "./MobileNavHeader";
import { HideMainNavOnMobile } from "@/components/common/HideMainNavOnMobile";

export default function CategoryHeaderClient() {
  return (
    <>
      <HideMainNavOnMobile />
      <div className="sticky top-0 z-[60] block lg:hidden w-full bg-white dark:bg-black">
        <MobileNavHeader backUrl="/categories" />
      </div>
    </>
  );
}
