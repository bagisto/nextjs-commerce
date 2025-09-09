"use client";
import { Select, SelectItem } from "@heroui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  getFilterAttributeTypes,
  SortFilterItemTypes,
} from "@/lib/bagisto/types";
import { PAGE, QUERY, SORT } from "@/lib/constants";
import { isArray } from "@/lib/type-guards";
import { createUrl } from "@/lib/utils";

export type ListItem = SortFilterItemTypes | PathFilterItem;
export type PathFilterItem = { title: string; path: string };
import React, { useMemo, useTransition } from "react";

function FilterItemList({
  list,
  title,
}: {
  list: getFilterAttributeTypes;
  title: string;
}) {
  const currentParams = useSearchParams();
  const sort = currentParams.get(SORT) || "name-asc";
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // Always re-calc selected filters when params change
  const selectedFilters = useMemo(
    () => new Set(currentParams.get(list.code)?.split(",") ?? []),
    [list.code, currentParams]
  );

  // Memoize options
  const memoizedOptions = useMemo(() => list.options, [list.options]);

  const handleFilterChange = (selectedIds: Set<string>) => {
    const code = list.code;
    const selected = Array.from(selectedIds);
    const newParams = new URLSearchParams(currentParams.toString());

    if (selected.length > 0) {
      newParams.set(code, selected.join(","));
    } else {
      newParams.delete(code);
    }

    if (sort) newParams.set(SORT, sort);

    const newUrl = createUrl(pathname, newParams);
    startTransition(() => {
      router.replace(newUrl, { scroll: false });
    });
  };

  return (
    <div className="min-w-48 w-full">
      <Select
        isMultiline
        items={memoizedOptions}
        radius="md"
        aria-label={title}
        aria-labelledby={`${title}-sort-label`}
        size="md"
        labelPlacement="inside"
        placeholder={`Select a ${title}`}
        renderValue={(items) => (
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-1">
            {items.map((item) => (
              <p className="text-nowrap" key={item.key}>
                {item.data?.adminName}
              </p>
            ))}
          </div>
        )}
        selectedKeys={selectedFilters} // <-- controlled by params
        selectionMode="multiple"
        variant="flat"
        onSelectionChange={(keys) => handleFilterChange(keys as Set<string>)}
        isLoading={isPending}
      >
        {(item) => (
          <SelectItem key={item.id} textValue={item.id}>
            <div className="flex items-center gap-2">
              <span className="text-small">{item.adminName}</span>
            </div>
          </SelectItem>
        )}
      </Select>
    </div>
  );
}

export default function FilterList({
  filterAttributes,
}: {
  filterAttributes: any;
}) {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const currentParams = useSearchParams();
  const currentPage = currentParams.get(PAGE) || "1";
  const sort = currentParams.get(SORT) || "name-asc";
  const query = currentParams.get(QUERY) || "";

  const handleClearAll = () => {
    const newUrl = createUrl(
      pathname,
      new URLSearchParams({
        ...(sort && { [SORT]: sort }),
        ...(Number(currentPage) > 1 && { [PAGE]: currentPage.toString() }),
        ...(query && { [QUERY]: query }),
      })
    );
    // Shallow routing, backgrounded with startTransition
    startTransition(() => {
      router.replace(newUrl, { scroll: false });
    });
  };

  return (
    <div className="grid grid-cols-1 gap-x-3 gap-y-2 md:grid-cols-2 min-[860px]:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {filterAttributes?.map((item: getFilterAttributeTypes) => {
        const hasOptions = isArray(item.options);

        return hasOptions ? (
          <FilterItemList key={item.id} list={item} title={item?.adminName} />
        ) : null;
      })}

      <button
        disabled={isPending}
        type="button"
        onClick={handleClearAll}
        className="text-nowrap relative top-0 my-2 inline-flex w-fit cursor-pointer items-center text-base underline max-md:ml-auto md:my-0"
      >
        Clear all filters{" "}
        {isPending && (
          <svg
            aria-hidden="true"
            className="ml-1 mt-0.5 h-5 w-5 animate-spin fill-black"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
