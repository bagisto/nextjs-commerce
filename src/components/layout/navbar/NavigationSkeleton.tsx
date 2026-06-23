export function NavigationSkeleton() {
  return (
    <>
      <div className="h-6 w-6 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700 lg:hidden" />
      
      <ul className="hidden gap-4 text-sm md:items-center lg:flex xl:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i}>
            <div className="h-4 w-16 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
          </li>
        ))}
      </ul>
    </>
  );
}