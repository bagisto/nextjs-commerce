import MobileNavHeader from "@/components/layout/navbar/MobileNavHeader";
import { HideMainNavOnMobile } from "@/components/common/HideMainNavOnMobile";

export default function DownloadableProductsLoading() {
  return (
    <div className="w-full max-w-full">
      <HideMainNavOnMobile />
      <div className="sticky top-0 z-[60] block lg:hidden w-[calc(100%+32px)] -mx-4 -mt-[78px] bg-white dark:bg-black">
          <MobileNavHeader backUrl="/account"  />
      </div>

      <div className="hidden lg:flex flex-col gap-1 mb-2">
        <div className="h-4 w-28 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
      </div>

      <div className="flex items-center mt-5 lg:mt-6 mb-6 lg:mb-7_5 pb-2.5 lg:border-none lg:pb-0">
        <div className="h-8 lg:h-11 w-48 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse" />
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-8">
        <div className="flex items-center gap-6 w-full lg:max-w-xl">
          <div className="w-full lg:max-w-[300px]">
            <div className="h-12 w-full bg-neutral-100 dark:bg-neutral-800 rounded-xl animate-pulse" />
          </div>
          <div className="h-5 w-20 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
        </div>

        <div className="flex items-center gap-8 w-full lg:w-auto justify-end">
          <div className="flex items-center gap-4">
            <div className="h-12 w-24 bg-neutral-100 dark:bg-neutral-800 rounded-xl animate-pulse" />
          </div>
          <div className="h-12 w-28 bg-neutral-100 dark:bg-neutral-800 rounded-xl animate-pulse" />
        </div>
      </div>

      <div className="w-full xl:max-w-[1030px] bg-white dark:bg-neutral-900 lg:border lg:border-border-muted dark:lg:border-neutral-800 lg:rounded-md overflow-hidden shadow-sm">
        <div className="overflow-x-auto w-full">
          <table className="w-full border-collapse min-w-[750px]">
            <thead>
              <tr className="h-[70px] bg-overlay-subtle dark:bg-neutral-800 border-b border-border-muted dark:border-neutral-700">
                <th className="px-6 text-left"><div className="h-4 w-16 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" /></th>
                <th className="px-6 text-left"><div className="h-4 w-28 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" /></th>
                <th className="px-6 text-left"><div className="h-4 w-16 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" /></th>
                <th className="px-6 text-left"><div className="h-4 w-16 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" /></th>
                <th className="px-6 text-left"><div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" /></th>
                <th className="px-6 text-left"><div className="h-4 w-16 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800">
              {[...Array(5)].map((_, idx) => (
                <tr key={idx} className="h-18">
                  <td className="px-6 py-4"><div className="h-4 w-20 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-48 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" /></td>
                  <td className="px-6 py-4"><div className="h-6 w-24 rounded-xl bg-neutral-200 dark:bg-neutral-800 animate-pulse" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-8 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" /></td>
                  <td className="px-6 py-4"><div className="h-6 w-20 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-8 py-6 flex-col sm:flex-row justify-between items-center gap-6 hidden lg:flex border-t border-border-muted dark:border-neutral-800">
          <div className="h-5 w-48 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
          <div className="flex gap-2">
            <div className="h-10 w-10 bg-neutral-100 dark:bg-neutral-800 rounded-full animate-pulse" />
            <div className="h-10 w-10 bg-neutral-100 dark:bg-neutral-800 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
