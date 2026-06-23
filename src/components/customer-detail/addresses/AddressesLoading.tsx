import MobileNavHeader from "@/components/layout/navbar/MobileNavHeader";
import { HideMainNavOnMobile } from "@/components/common/HideMainNavOnMobile";

export default function AddressesLoading() {
  return (
    <div className="w-full max-w-[1170px]">
      <HideMainNavOnMobile />
      <div className="sticky top-0 z-[60] block lg:hidden w-[calc(100%+32px)] -mx-4 -mt-[78px] bg-white dark:bg-black">
          <MobileNavHeader backUrl="/account" />
      </div>

      <div className="flex flex-row justify-between items-start md:items-center mt-5 lg:mt-6 mb-7_5 gap-6 md:gap-0">
        <div className="flex flex-col gap-1">
          <div className="hidden lg:block h-4 w-28 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse mb-2" />
          <div className="flex items-center gap-3">
            <div className="h-10 w-32 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse" />
          </div>
        </div>
        <div className="h-[55px] w-[222px] bg-neutral-200 dark:bg-neutral-800 rounded-full animate-pulse" />
      </div>

      <div className="flex flex-col w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-[1170px]">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i}
              className="bg-white dark:bg-neutral-900 border border-border dark:border-neutral-800 rounded-md p-6 w-full lg:max-w-[573px] lg:h-[137px] flex flex-col justify-center animate-pulse"
            >
              <div className="flex justify-between items-center w-full mb-6">
                <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-800 rounded" />
                
                <div className="flex items-center gap-3">
                  
                  <div className="h-6 w-6 bg-neutral-50 dark:bg-neutral-800 rounded-md" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="h-3.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded" />
                <div className="h-3.5 w-2/3 bg-neutral-100 dark:bg-neutral-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
