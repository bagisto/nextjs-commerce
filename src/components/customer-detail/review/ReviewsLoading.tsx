import MobileNavHeader from "@/components/layout/navbar/MobileNavHeader";
import { HideMainNavOnMobile } from "@/components/common/HideMainNavOnMobile";

export default function ReviewsLoading() {
  return (
    <div className="w-full max-w-[1170px]">
      <HideMainNavOnMobile />
      <div className="sticky top-0 z-[60] block lg:hidden w-[calc(100%+32px)] -mx-4 -mt-[78px] bg-white dark:bg-black">
          <MobileNavHeader backUrl="/account" />
      </div>

      <div className="hidden lg:flex flex-col mb-2">
        <div className="h-4 w-28 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
      </div>

      <div className="flex items-center mt-5 lg:mt-6 mb-6 lg:mb-7_5 pb-2.5 lg:border-none lg:pb-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-40 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse" />
        </div>
      </div>

      <div className="flex flex-col w-full">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex flex-col lg:flex-row lg:justify-between gap-6 lg:gap-0 p-4 lg:p-6 border-b border-border-muted dark:border-neutral-800 w-full">
            <div className="flex gap-4 lg:gap-6 w-full lg:max-w-[759px]">
              <div className="relative w-[100px] h-[100px] lg:w-[130px] lg:h-[130px] rounded-md bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 animate-pulse" />

              <div className="flex flex-col gap-2 lg:gap-3 flex-1">
                <div className="h-6 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
                
                <div className="lg:hidden flex gap-1">
                  {[...Array(5)].map((_, s) => (
                    <div key={s} className="w-5 h-5 bg-neutral-100 dark:bg-neutral-800 rounded-full animate-pulse" />
                  ))}
                </div>

                <div className="flex flex-col gap-2">
                  <div className="h-4 w-full bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" />
                  <div className="h-4 w-11/12 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" />
                  <div className="h-4 w-4/5 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" />
                </div>
              </div>
            </div>

            <div className="hidden lg:flex flex-shrink-0 gap-1">
              {[...Array(5)].map((_, s) => (
                <div key={s} className="w-5 h-5 bg-neutral-100 dark:bg-neutral-800 rounded-full animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="py-6 flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-neutral-100 dark:border-neutral-800">
        <div className="h-5 w-48 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
        <div className="flex gap-2">
          <div className="h-10 w-10 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
          <div className="h-10 w-10 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
