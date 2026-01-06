export const AuthPlaceHolder = () => (
  <div className="mx-auto animate-pulse pt-4 md:pt-8 lg:pt-12">
    <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
      <div className="flex px-4">
        <div className="w-full animate-pulse">
          <div className="h-12 w-1/3 rounded bg-gray-200"></div>
          <div className="mt-2 h-4 w-3/4 rounded bg-gray-200"></div>

          <div className="mt-12 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="h-12 rounded-lg bg-gray-200"></div>
              <div className="h-12 rounded-lg bg-gray-200"></div>
            </div>

            <div className="h-12 w-full rounded-lg bg-gray-200"></div>

            <div className="h-12 w-full rounded-lg bg-gray-200"></div>

            <div className="h-12 w-full rounded-lg bg-gray-200"></div>

            <div className="mt-12 h-12 w-full rounded-lg bg-gray-300"></div>
          </div>

          <div className="mt-4 h-6 w-1/2 rounded bg-gray-200"></div>
        </div>
      </div>

      <div className="hidden h-80 w-full rounded-xl bg-gray-200 dark:bg-gray-700 sm:h-[400px] md:hidden md:h-[600px] lg:inline" />
    </div>
  </div>
);
