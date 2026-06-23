import clsx from "clsx";

export default function ForgetSkeleton() {
  return (
    <div className="my-8 flex w-full items-center w-full max-w-screen-2xl mx-auto px-4 xss:px-7.5 justify-between gap-4 lg:my-16 xl:my-32 animate-pulse">
      <div className="flex w-full flex-col gap-y-4 lg:max-w-[583px] lg:gap-y-12">
        <div className="flex flex-col gap-y-2">
          <div className="h-10 w-64 rounded-lg bg-gray-200 dark:bg-neutral-800" />
          <div className="flex flex-col gap-y-2 mt-2">
            <div className="h-4 w-full max-w-[480px] rounded-lg bg-gray-200 dark:bg-neutral-800" />
            <div className="h-4 w-3/4 max-w-[360px] rounded-lg bg-gray-200 dark:bg-neutral-800" />
          </div>
        </div>

        <div className="flex flex-col gap-y-5 md:gap-y-10">
          <div className="flex flex-col gap-y-3">
            <div className="h-4 w-40 rounded-lg bg-gray-200 dark:bg-neutral-800" />
            <div className="h-14 w-full rounded-xl bg-gray-200 dark:bg-neutral-800" />
          </div>

          <div className="flex flex-col gap-y-3 md:gap-y-2">
            <div className="h-12 w-full rounded-full bg-gray-300 dark:bg-neutral-700" />
            <div className="h-4 w-48 mx-auto md:mx-0 rounded-lg bg-gray-200 dark:bg-neutral-800 mt-2" />
          </div>
        </div>
      </div>

      <div className="relative hidden aspect-[1] max-h-[692px] w-full max-w-[790px] sm:block md:aspect-[1.14] overflow-hidden rounded-xl bg-gray-100 dark:bg-neutral-800">
        <div
          className={clsx(
            "absolute inset-0",
            "bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent",
            "animate-[shimmer_2s_infinite]"
          )}
        />
      </div>
    </div>
  );
}
