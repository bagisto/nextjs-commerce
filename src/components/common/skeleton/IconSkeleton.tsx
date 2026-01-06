
type IconSkeletonProps = {
  className?: string;
};

export function IconSkeleton({ className }: IconSkeletonProps) {
  return (
    <div
      className={`relative flex h-9 w-9 items-center justify-center rounded-md border border-solid border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 md:h-9 md:w-9 lg:h-11 lg:w-11 ${className ?? ""}`}
    >
      <div className="h-4 w-4 rounded-full bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
    </div>
  );
}