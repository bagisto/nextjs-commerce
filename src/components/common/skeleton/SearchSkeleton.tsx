import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export const SearchSkeleton = () => {
  return (
    <div className="max-w-[550px] relative w-full md:min-w-[386px] xl:min-w-[516px]">
      <input
        className="input w-full rounded-lg border border-neutral-200 bg-white py-2 pl-3 pr-10 text-sm text-black outline-none placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400 md:pl-4"
        placeholder="Search for products..."
      />
      <div className="absolute bottom-0 right-1 top-0 flex w-9 items-center justify-center border-l border-neutral-200 dark:border-neutral-700 md:border-0">
        <MagnifyingGlassIcon className="size-5 stroke-neutral-500" />
      </div>
    </div>
  );
}
