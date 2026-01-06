import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export default function OpenCart({
  className,
  quantity,
}: {
  className?: string;
  quantity?: number | string;
}) {
  return (
    <div className="relative flex h-9 w-9 items-center justify-center rounded-md border border-solid border-neutral-200 text-black dark:border-neutral-700 dark:text-white md:h-9 md:w-9 lg:h-11 lg:w-11">
      <ShoppingCartIcon className={clsx("h-4.5 ", className)} />

      {quantity ? (
        <div className="absolute right-0 top-0 -mr-2 -mt-2 h-4 w-4 rounded bg-blue-600 text-[11px] font-medium text-white">
          {quantity}
        </div>
      ) : null}
    </div>
  );
}
