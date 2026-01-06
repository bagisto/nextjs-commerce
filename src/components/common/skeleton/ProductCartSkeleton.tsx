import clsx from "clsx";
import CheckoutSkeleton from "./CheckoutSkeleton";

export default function ProductCartSkeleton() {
  return (
    <div className="flex">
      <CheckoutSkeleton />
      <CartSkeleton className="w-1/2" />
    </div>
  );
}

export const CartSkeleton = ({ className }: { className: string }) => {
  return (
    <div
      className={clsx(
        "hidden h-full w-1/2 flex-col justify-between px-8 py-8 pt-4 text-black dark:text-white lg:flex lg:max-w-full",
        className,
      )}
    >
      <div>
        <div className="my-6 animate-pulse" role="status">
          <div className="h-12 w-1/2 rounded-md bg-gray-200 dark:bg-gray-700" />
          <span className="sr-only">Loading...</span>
        </div>

        {Array(2)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="mb-3 flex w-full max-w-full animate-pulse gap-4 rounded-lg bg-white px-4 py-4 dark:bg-neutral-900"
            >
              <div className="h-[194px] w-[194px] flex-shrink-0 rounded-md bg-gray-200 dark:bg-gray-700" />

              <div className="flex flex-1 flex-col justify-between space-y-2">
                <div className="flex items-start justify-between">
                  <div className="h-8 w-3/5 rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-8 w-16 rounded bg-gray-200 dark:bg-gray-700" />
                </div>

                <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />

                <div className="h-8 w-24 rounded bg-gray-200 dark:bg-gray-700" />

                <div className="space-y-1 pt-2">
                  <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-3 w-11/12 rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-3 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            </div>
          ))}
      </div>
      <CartTotalSkeleton />
    </div>
  );
};

export function CartTotalSkeleton() {
  return (
    <div className="w-full max-w-full animate-pulse space-y-4 rounded-md bg-white py-4 text-black dark:bg-neutral-900 dark:text-white">
      <div className="flex items-center justify-between px-4">
        <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
      </div>

      <div className="flex items-center justify-between px-4">
        <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
      </div>

      <div className="flex items-center justify-between px-4 pt-2">
        <div className="h-6 w-32 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-6 w-32 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
}
