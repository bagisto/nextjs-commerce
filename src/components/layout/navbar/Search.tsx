"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createUrl } from "@/utils/helper";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function Search({
  search = false,
  setSearch,
}: {
  search: boolean;
  setSearch?: (value: boolean) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const inputRef = useRef<HTMLInputElement>(null);

  const [searchValue, setSearchValue] = useState(
    searchParams?.get("q") || ""
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      const newParams = new URLSearchParams(searchParams.toString());
      if (searchValue.trim() === "") {
          newParams.delete("q");
      } else {
        newParams.set("q", searchValue);
      }
      if(searchValue){
      router.push(createUrl("/search", newParams));
      }
    }, 400); 

    return () => clearTimeout(handler);
  }, [searchValue ]);

  useEffect(() => {
    if (search && inputRef.current) {
      const input = inputRef.current;
      input.focus();
      const len = input.value.length;
      input.setSelectionRange(len, len);
    }
  }, [search]);

  return (
    <div className="w-max-[550px] relative w-full md:min-w-[386px] xl:min-w-[516px] outline-none hover:outline-none ">
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
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        autoComplete="off"
        className="input w-full rounded-lg border border-neutral-200 bg-white py-2 pl-12 pr-4 text-sm text-black outline-none placeholder:text-neutral-500 focus:ring-2 focus:ring-neutral-300 dark:border-neutral-800 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400 md:pl-4"
        name="search"
        placeholder="Search for products..."
        type="text"
      />

      <div className="absolute bottom-0 right-1 top-0 flex w-9 cursor-pointer items-center justify-center border-l border-neutral-200 dark:border-neutral-700 md:border-0">
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
      </div>
    </div>
  );
}
