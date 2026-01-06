export function NavbarSkeletonLoader() {
  return (
    <div className="space-y-6">
      <div className="h-12 w-full animate-pulse rounded-md bg-gray-300" />
      <div className="h-8 w-3/4 animate-pulse rounded-md bg-gray-300" />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="space-y-4 rounded-md bg-white p-4 shadow-lg"
          >
            <div className="h-48 animate-pulse rounded-md bg-gray-300" />

            <div className="h-6 animate-pulse rounded-md bg-gray-300" />
            <div className="h-4 w-3/4 animate-pulse rounded-md bg-gray-300" />
          </div>
        ))}
      </div>
    </div>
  );
}
