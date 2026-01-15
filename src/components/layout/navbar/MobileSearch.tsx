"use client";
import clsx from "clsx";
import { Suspense, useState } from "react";
import Search from "./Search";
import OpenCart from "@/components/cart/OpenCart";
import { SearchSkeleton } from "@/components/common/skeleton/SearchSkeleton";

const MobileSearch = () => {
  const [search, setSearch] = useState<boolean>(false);
  return (
    <>
      <Suspense fallback={<OpenCart />}>
        <button
          onClick={() => setSearch(!search)}
          aria-label="Open cart"
          className="size-9 lg:size-11 flex cursor-pointer items-center justify-center rounded-sm border border-solid border-neutral-200 dark:border-neutral-700 md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </button>
      </Suspense>
      <div
        className={clsx(
          "absolute z-50 left-0 right-0 top-0 flex w-full justify-center bg-neutral-50 dark:bg-neutral-900 p-[15px] transition-all duration-300 md:hidden ",
          search ? "translate-y-0 opacity-100" : " -translate-y-full opacity-0"
        )}
      >
        <Suspense fallback={<SearchSkeleton />}>
          <Search search={search} setSearch={setSearch} />
        </Suspense>
      </div>
    </>
  );
};



export const MobileSearchBar = ({
  onClose,
}: {
  onClose?: () => void;
}) => {
  return (
    <>
      <div className="block w-full justify-center md:hidden px-4 mt-2 z-10">
        <Suspense fallback={<SearchSkeleton />}>
          <Search search={false} onClose={onClose} />
        </Suspense>
      </div>
    </>
  );
};

export default MobileSearch;
