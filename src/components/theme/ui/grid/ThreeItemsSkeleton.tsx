
export const ThreeItemGridSkeleton = () => {
  return (
    <section className="pt-6 sm:pt-12 lg:pt-20">
      <div className="md:max-w-4.5xl mx-auto mb-10 w-auto px-0 text-center md:px-36">
        <div className="mb-4 h-10 w-2/3 mx-auto animate-pulse rounded bg-gray-200 dark:bg-neutral-800 md:h-12" />
        <div className="h-5 w-full max-w-xl mx-auto animate-pulse rounded bg-gray-200 dark:bg-neutral-800" />
      </div>

      <div className="hidden md:grid gap-4 md:grid-cols-6 md:grid-rows-2 lg:max-h-[calc(100vh-200px)]">
        <div className="md:col-span-4 md:row-span-2 animate-pulse rounded-lg bg-gray-200 dark:bg-neutral-800" style={{ aspectRatio: '1018 / 800' }} />
        <div className="md:col-span-2 md:row-span-1 animate-pulse rounded-lg bg-gray-200 dark:bg-neutral-800" style={{ aspectRatio: '502 / 393' }} />
        <div className="md:col-span-2 md:row-span-1 animate-pulse rounded-lg bg-gray-200 dark:bg-neutral-800" style={{ aspectRatio: '502 / 393' }} />
      </div>

      <div className="grid md:hidden gap-4 grid-cols-1 xxs:grid-cols-2 lg:max-h-[calc(100vh-200px)]">
        <div className="col-span-1 animate-pulse rounded-lg bg-gray-200 dark:bg-neutral-800 aspect-[380/280] xxs:aspect-[182/280]" />
        <div className="col-span-1 animate-pulse rounded-lg bg-gray-200 dark:bg-neutral-800 aspect-[380/280] xxs:aspect-[182/280]" />
        <div className="col-span-1 xxs:col-span-2 animate-pulse rounded-lg bg-gray-200 dark:bg-neutral-800 aspect-[380/280]" />
      </div>
    </section>
  );
};
