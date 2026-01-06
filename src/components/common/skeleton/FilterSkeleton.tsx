import { FC } from "react";

export default function FilterListSkeleton() {
  return (
    <div className="flex w-full flex-auto items-center gap-x-4 sm:max-w-md">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div key={idx} className="w-full md:min-w-48">
          <div className="animate-pulse space-y-2">
            <div className="h-4 w-1/2 rounded bg-gray-300 dark:bg-gray-700" />
            <div className="h-10 w-full rounded bg-gray-200 dark:bg-gray-800" />
            <div className="mt-2 flex flex-wrap gap-2">
              {Array.from({ length: 2 }).map((__, chipIdx) => (
                <div
                  key={chipIdx}
                  className="h-6 w-16 rounded-full bg-gray-300 dark:bg-gray-700"
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export const SortOrderSkeleton: FC = () => {
  return (
    <section className="flex w-full flex-1 items-center gap-x-2.5 sm:max-w-[15.625rem]">
      <div className="hidden h-4 w-24 animate-pulse rounded bg-gray-300 md:block dark:bg-gray-700" />
      <div className="h-10 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
    </section>
  );
};
export const ProductCardSkeleton: FC = () => {
  return (
    <div className="flex animate-pulse flex-col gap-y-2.5">
      <div className="group relative overflow-hidden rounded-lg">
        <div className="aspect-square w-full rounded-lg bg-gray-300 dark:bg-gray-700" />
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-x-4 rounded-full bg-white/50 px-4 py-1.5 text-xs font-semibold text-black opacity-0 backdrop-blur-md duration-300 group-hover:opacity-100 dark:text-white">
          <div className="h-6 w-6 rounded-full bg-gray-400 dark:bg-gray-600" />
        </div>
      </div>

      <div>
        <div className="mb-2.5 h-5 w-3/4 rounded bg-gray-300 dark:bg-gray-700" />
        <div className="h-4 w-1/3 rounded bg-gray-300 dark:bg-gray-700" />
      </div>
    </div>
  );
};

export const ServiceContentSkeleton: FC = () => {
  return (
    <div className="mx-auto my-12 w-full md:my-20 md:max-w-4xl">
      <div className="flex items-center justify-center gap-6 max-lg:flex-wrap max-md:grid max-md:grid-cols-2 max-md:gap-x-2.5 max-md:text-center md:gap-10 lg:gap-20">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex animate-pulse flex-col items-center justify-center gap-3 max-md:gap-2.5 max-sm:px-2"
          >
            <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700" />
            <div className="mt-2.5 h-4 w-36 rounded bg-gray-300 max-md:mt-0 max-md:w-32 max-sm:w-24 dark:bg-gray-700" />
          </div>
        ))}
      </div>
    </div>
  );
};
