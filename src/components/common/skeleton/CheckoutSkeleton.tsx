export default function CheckoutSkeleton() {
  return (
    <div className="mx-auto w-full flex-1 animate-pulse space-y-6 rounded-md px-0 py-10 text-white">
      {/* Logo */}
      <div className="flex items-center gap-x-2">
        <div className="h-10 w-12 rounded-sm bg-gray-300 text-center text-sm text-black dark:bg-gray-600 dark:text-white" />
        <div className="h-6 w-24 rounded-sm bg-gray-300 text-center text-sm text-black dark:bg-gray-600 dark:text-white" />
      </div>

      <div className="flex items-center gap-3">
        <div className="h-6 w-6 rounded-full bg-gray-300 text-center text-sm text-black dark:bg-gray-600 dark:text-white">
          1
        </div>
        <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
      </div>

      <div className="h-12 w-full rounded bg-gray-200 dark:bg-gray-800" />

      <div className="h-4 w-40 rounded bg-gray-200 dark:bg-gray-700" />

      <div className="flex justify-end">
        <div className="h-12 w-24 rounded-full bg-gray-300 dark:bg-gray-700" />
      </div>

      {[2, 3, 4, 5].map((step) => (
        <div key={step} className="flex items-center gap-3">
          <div className="h-6 w-6 rounded-full bg-gray-300 text-center text-sm text-black dark:bg-gray-700 dark:text-white">
            {step}
          </div>
          <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      ))}
    </div>
  );
}

export const CartCheckoutPageSkeleton = () => {
  return (
    <section className="w-full animate-pulse py-6 text-black dark:text-white">
      <div className="flex w-full flex-col">
        {[1, 2].map((_, index) => (
          <div
            key={index}
            className="mb-4 flex w-full gap-4 rounded-lg bg-white px-4 py-4 dark:bg-neutral-900"
          >
            <div className="h-6 w-6 flex-shrink-0 rounded-full bg-gray-200 dark:bg-gray-700" />

            <div className="flex flex-1 flex-col justify-between space-y-2">
              <div className="flex items-start justify-between">
                <div className="h-6 w-3/5 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-6 w-16 rounded bg-gray-200 dark:bg-gray-700" />
              </div>

              <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
