import { XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export default function CloseCart({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "relative flex h-11 w-11 items-center justify-center rounded-md text-black transition-colors duration-300 hover:bg-neutral-200 dark:text-white dark:hover:bg-neutral-700",
        className,
      )}
    >
      <XMarkIcon className="h-6 transition-all ease-in-out hover:scale-110" />
    </div>
  );
}
