import MobileNavHeader from "@/components/layout/navbar/MobileNavHeader";
import { HideMainNavOnMobile } from "@/components/common/HideMainNavOnMobile";

export default function WishlistLoading() {
  return (
    <div className="w-full xl:max-w-[1170px]">
      <HideMainNavOnMobile />
      <div className="sticky top-0 z-[60] block lg:hidden w-[calc(100%+32px)] -mx-4 -mt-[78px] bg-white dark:bg-black">
          <MobileNavHeader backUrl="/account" />
      </div>

      <div className="flex flex-col mt-5 lg:mt-6 mb-[23px]">
        <div className="hidden lg:flex flex-col gap-1 mb-2">
          <div className="h-4 w-28 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-48 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse" />
        </div>
      </div>

      <div className="flex flex-col border-t border-neutral-100 dark:border-neutral-800">
        {[...Array(3)].map((_, i) => (
          <div 
            key={i} 
            className="flex flex-col md:flex-row items-start md:items-center justify-between w-full h-auto 2xl:h-[178px] p-4 md:p-5 2xl:p-6 bg-white dark:bg-neutral-900 border-b border-border-muted dark:border-neutral-800 gap-6 md:gap-4 2xl:gap-0"
          >
            <div className="flex flex-row items-center gap-4 md:gap-5 2xl:gap-6 w-full 2xl:max-w-[759px]">
              <div className="relative w-20 md:w-[100px] 2xl:w-[130px] h-20 md:h-[100px] 2xl:h-[130px] rounded-md bg-neutral-100 dark:bg-neutral-800 shrink-0 animate-pulse" />

              <div className="flex flex-col gap-3 md:gap-4 2xl:gap-6 flex-1">
                <div className="h-6 w-3/4 md:w-2/3 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
                
                <div className="flex md:hidden items-center justify-between mt-1">
                  <div className="h-5 w-20 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" />
                </div>

                <div className="flex items-center gap-3 md:gap-4">
                  <div className="h-10 md:h-[45px] 2xl:h-[55px] w-[100px] md:w-[120px] 2xl:w-[145px] rounded-full border-[1.5px] md:border-2 border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 animate-pulse" />
                  <div className="h-10 md:h-[45px] 2xl:h-[55px] w-[110px] md:w-[120px] 2xl:w-[135px] rounded-lg bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
                </div>
              </div>
            </div>

            <div className="hidden md:flex flex-col items-end justify-center gap-3 w-[83px] 2xl:h-[62px]">
              <div className="h-7 w-20 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
              <div className="h-4 w-16 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      <div className="py-10 flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="h-5 w-48 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
        <div className="flex gap-2">
          <div className="h-10 w-10 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
          <div className="h-10 w-10 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
