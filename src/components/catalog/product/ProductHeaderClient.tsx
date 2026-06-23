"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import MobileNavHeader from "@/components/layout/navbar/MobileNavHeader";
import { HideMainNavOnMobile } from "@/components/common/HideMainNavOnMobile";
import { MobileSearchBar } from "@/components/layout/navbar/MobileSearch";

function ProductHeaderContent() {
  const searchParams = useSearchParams();
  const backUrl = searchParams.get("backUrl");

  if (backUrl) {
    return (
      <>
        <HideMainNavOnMobile />
        <div className="sticky top-0 z-[60] block lg:hidden w-full bg-white dark:bg-black">
          <MobileNavHeader backUrl={backUrl} />
        </div>
        <MobileSearchBar />
      </>
    );
  }

  return <MobileSearchBar />;
}

export default function ProductHeaderClient() {
  return (
    <Suspense fallback={<MobileSearchBar />}>
      <ProductHeaderContent />
    </Suspense>
  );
}
