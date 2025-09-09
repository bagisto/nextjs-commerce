"use client";

import {
  MagnifyingGlassIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";

import { createUrl } from "@/lib/utils";
import { useEffect, useRef } from "react";

export default function Search({
  search = false,
  setSearch,
}: {
  search: boolean;
  setSearch?: (value: boolean) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSearch && setSearch(false);

    const val = e.target as HTMLFormElement;
    const search = val.search as HTMLInputElement;
    const newParams = new URLSearchParams(searchParams.toString());

    if (search.value) {
      newParams.set("q", search.value);
    } else {
      newParams.delete("q");
    }

    router.push(createUrl("/search", newParams));
  }
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (search && inputRef.current) {
      const input = inputRef.current;
      input.focus();

      // Move cursor to the end of content
      const length = input.value.length;
      input.setSelectionRange(length, length);
    }
  }, [search]);

  return (
    <form
      className="w-max-[550px] relative w-full md:min-w-[386px] xl:min-w-[516px]"
      onSubmit={onSubmit}
    >
      {setSearch && (
        <button
          onClick={() => setSearch(!search)}
          type="button"
          className="absolute bottom-0 left-1 top-0 flex w-9 cursor-pointer items-center justify-center border-r border-neutral-200 dark:border-neutral-700 md:hidden"
        >
          <ArrowLeftIcon className="size-5 stroke-neutral-500" />
        </button>
      )}

      <input
        ref={inputRef}
        key={searchParams?.get("q")}
        autoComplete="off"
        className="input w-full rounded-lg border border-neutral-200 bg-white py-2 pl-12 pr-4 text-sm text-black outline-none placeholder:text-neutral-500 focus:ring-2 focus:ring-neutral-300 dark:border-neutral-800 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400 md:pl-4"
        defaultValue={searchParams?.get("q") || ""}
        name="search"
        placeholder="Search for products..."
        type="text"
      />
      <button
        aria-label="Open cart"
        type="submit"
        className="absolute bottom-0 right-1 top-0 flex w-9 cursor-pointer items-center justify-center border-l border-neutral-200 dark:border-neutral-700 md:border-0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          className="size-5 stroke-neutral-500 dark:stroke-white md:stroke-black"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          ></path>
        </svg>
      </button>
    </form>
  );
}

export function SearchSkeleton() {
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
