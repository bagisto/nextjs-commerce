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
    <div className="relative flex  items-center justify-center rounded-md border-0 lg:border border-solid border-neutral-200 dark:border-neutral-700 lg:h-11 lg:w-11">
      <ShoppingCartIcon className={clsx("h-5 w-5", className)} />

      {quantity ? (
        <div 
        className="absolute -right-2 -top-1 flex h-4 min-w-[16px] max-w-[34px] items-center justify-center rounded-[100px] bg-[#5A8EFF] px-1 text-center font-outfit text-xs font-medium leading-[16px] text-white lg:left-[35px] lg:right-auto lg:top-[-7px] lg:h-[16px] lg:w-[16px] lg:rounded-[4px] lg:bg-primary lg:text-11"
        >
          {quantity}
        </div>
      ) : null}
    </div>
  );
}