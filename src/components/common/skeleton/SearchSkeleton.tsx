import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export const SearchSkeleton = () => {
  return (
    <form className="w-max-[550px] relative w-full lg:w-80 xl:w-full">
      <input
        className="w-full rounded-lg border bg-white px-4 py-2 text-sm text-black placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
        placeholder="Search for products..."
      />
      <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
        <MagnifyingGlassIcon className="h-4" />
      </div>
    </form>
  );
}
