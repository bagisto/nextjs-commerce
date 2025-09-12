import { UserIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export default function OpenAuth({ className }: { className?: string }) {
  return (
    <div className="relative flex h-9 w-9 items-center justify-center rounded-md border border-solid border-neutral-200 text-black dark:border-neutral-700 dark:text-white md:h-9 md:w-9 lg:h-11 lg:w-11">
      <UserIcon className={clsx("h-5 w-20  ", className)} />
    </div>
  );
}
