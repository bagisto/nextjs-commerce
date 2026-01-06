export default function AddressSkeleton() {
  return (
    <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse space-y-3 rounded-2xl border border-neutral-300 bg-neutral-200 p-4 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className="flex items-center justify-between">
            <div className="h-6 w-6 rounded-full bg-neutral-300 dark:bg-neutral-800" />
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 rounded-full bg-neutral-300 dark:bg-neutral-800" />
              <div className="h-4 w-4 rounded bg-neutral-300 dark:bg-neutral-800" />
            </div>
          </div>

          <div className="h-4 w-2/3 rounded bg-neutral-300 dark:bg-neutral-800" />

          <div className="h-3 w-full rounded bg-neutral-300 dark:bg-neutral-800" />
          <div className="h-3 w-5/6 rounded bg-neutral-300 dark:bg-neutral-800" />
          <div className="h-3 w-1/2 rounded bg-neutral-300 dark:bg-neutral-800" />
        </div>
      ))}
    </div>
  );
}
