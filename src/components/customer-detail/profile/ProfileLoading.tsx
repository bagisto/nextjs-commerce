import MobileNavHeader from "@/components/layout/navbar/MobileNavHeader";
import { HideMainNavOnMobile } from "@/components/common/HideMainNavOnMobile";

export default function ProfileLoading() {
  return (
    <div className="flex flex-col w-full">
      <HideMainNavOnMobile />
      <div className="sticky top-0 z-[60] block lg:hidden w-[calc(100%+32px)] -mx-4 -mt-[78px] bg-white dark:bg-black">
          <MobileNavHeader backUrl="/account" />
      </div>

      <div className="hidden lg:flex flex-col gap-1 mb-2">
        <div className="h-4 w-16 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
      </div>

      <div className="flex items-center justify-between mt-5 lg:mt-6 mb-6 lg:mb-10">
        <div className="flex items-center gap-3">
          <div className="h-8 lg:h-10 w-24 lg:w-36 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
        </div>
        <div className="h-12 lg:h-14 w-28 lg:w-36 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
      </div>

      <div className="flex flex-col">
        {[...Array(5)].map((_, idx) => (
          <div 
            key={idx}
            className="flex flex-col sm:flex-row py-7 border-b border-neutral-100 dark:border-neutral-800 gap-3 sm:gap-0"
          >
            <div className="sm:w-[280px] flex items-center">
              <div className="h-5 w-32 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
            </div>
            <div className="flex-1 flex items-center">
              <div className="h-5 w-48 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <div className="h-16 w-48 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
      </div>
    </div>
  );
}
