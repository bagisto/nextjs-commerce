import clsx from "clsx";

const SkeletonTile = ({ size }: { size: "full" | "half" }) => (
  <div
    className={clsx(
      "animate-pulse rounded-lg bg-gray-200 dark:bg-neutral-700",
      size === "full"
        ? "md:col-span-4 md:row-span-2"
        : "md:col-span-2 md:row-span-1",
      "aspect-square h-full w-full",
    )}
  />
);

export const ThreeItemGridSkeleton = () => {
  return (
    <section>
      <div className="mx-auto mb-10 w-auto px-0 text-center md:max-w-4.5xl md:px-36">
        <div className="mx-auto mb-4 h-10 w-2/3 animate-pulse rounded bg-gray-300 dark:bg-neutral-700" />
        <div className="mx-auto h-5 w-full max-w-xl animate-pulse rounded bg-gray-200 dark:bg-neutral-800" />
      </div>
      <div className="grid gap-4 md:grid-cols-6 md:grid-rows-2 lg:max-h-[calc(100vh-200px)]">
        <SkeletonTile size="full" />
        <SkeletonTile size="half" />
        <SkeletonTile size="half" />
      </div>
    </section>
  );
};
