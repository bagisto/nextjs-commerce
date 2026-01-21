import { UserIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export default function OpenAuth({ className }: { className?: string }) {
  return (
    <>
      <div className="relative flex items-center justify-center rounded-md border-0 lg:border border-solid border-neutral-200 dark:border-neutral-700 lg:h-11 lg:w-11">
        <UserIcon className={clsx("h-5 w-5  ", className)} />
      </div>
    </>

  );
}

