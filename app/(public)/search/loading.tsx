import Grid from "@/components/grid";

export default function Loading() {
  return (
    <div className="flex flex-col gap-y-2">
      <div className="w-full py-10">
        {/* Product Details Skeleton */}
        <div className="flex justify-between">
          <div className="flex w-full gap-x-2">
            {/* Title Skeleton */}
            <div className="h-10 w-48 animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-900" />

            {/* Price Skeleton */}
            <div className="h-10 w-48 animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-900" />
            <div className="h-10 w-48 animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-900" />
          </div>

          {/* Price Skeleton */}
          <div className="h-10 w-56 animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-900" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array(12)
          .fill(0)
          .map((_, index) => {
            return (
              <div
                key={index}
                className="h-[340px] max-h-[375px] w-auto max-w-[375px] animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-900 sm:h-[280px] sm:h-[315px] lg:h-[375px]"
              />
            );
          })}
      </div>
    </div>
  );
}
