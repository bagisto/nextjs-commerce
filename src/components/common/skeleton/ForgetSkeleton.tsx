import clsx from "clsx";

export default function ForgetSkeleton() {
  return (
    <div className="my-8 flex w-full items-center justify-between gap-4 lg:my-16 xl:my-32 animate-pulse">
      <div className="flex w-full flex-col gap-y-6 lg:max-w-[583px]">
        <div className="h-10 w-56 rounded-lg bg-gray-200" />

        <div className="h-4 w-80 rounded-lg bg-gray-200" />
        <div className="h-4 w-64 rounded-lg bg-gray-200" />

        <div className="mt-6 h-14 w-full rounded-lg bg-gray-200" />

        <div className="h-12 w-40 rounded-lg bg-gray-300" />

        <div className="h-4 w-32 rounded-lg bg-gray-200" />
      </div>

      <div className="relative hidden aspect-[1] max-h-[692px] w-full max-w-[790px] sm:block md:aspect-[1.14] overflow-hidden rounded-xl">
        <div
          className={clsx(
            "absolute inset-0 rounded-xl",
            "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200",
            "animate-[shimmer_1.6s_infinite]"
          )}
        />
      </div>
    </div>
  );
}
