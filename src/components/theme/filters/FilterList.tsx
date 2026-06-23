"use client";
import { Select, SelectItem } from "@heroui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
export type ListItem = SortFilterItemTypes | PathFilterItem;
export type PathFilterItem = { title: string; path: string };
import { useMemo, useTransition } from "react";
import { getFilterAttributeTypes, SortFilterItemTypes } from "@/types/types";
import { isArray } from "@/utils/type-guards";
import { PAGE, QUERY, SORT } from "@/utils/constants";
import { createUrl } from "@/utils/helper";



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

  const selectedFilters = useMemo(
    () => new Set(currentParams.get(list.code)?.split(",") ?? []),
    [list.code, currentParams]
  );

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

  const formatLabel = (str?: string) =>
    str ? str.charAt(0) + str.slice(1).toLowerCase() : "";
  const placeHolder = `Select a ${formatLabel(list?.adminName)}`;

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
        placeholder={placeHolder}
        classNames={{
          value: "text-neutral-800 dark:text-neutral-200 font-outfit text-sm font-medium",
          trigger: "bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 min-h-10 h-10 rounded-xl",
          popoverContent: "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl",
        }}
        renderValue={(items) => {
          if (items.length === 0) return null;
          if (items.length === 1) {
            return (
              <p className="text-nowrap text-neutral-800 dark:text-neutral-200 font-outfit text-sm font-medium">
                {items[0].data?.adminName}
              </p>
            );
          }
          return (
            <div className="flex items-center gap-1.5 py-0.5">
              <p className="text-nowrap text-neutral-800 dark:text-neutral-200 font-outfit text-sm font-medium">
                {items[0].data?.adminName}
              </p>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-neutral-800 dark:text-neutral-200 font-outfit">
                +{items.length - 1}
              </span>
            </div>
          );
        }}
        selectedKeys={selectedFilters}
        selectionMode="multiple"
        variant="flat"
        onSelectionChange={(keys) => handleFilterChange(keys as Set<string>)}
        isLoading={isPending}
      >
        {(item) => (
            <SelectItem
              key={item.id}
              textValue={item.id}
              className="text-neutral-800 dark:text-neutral-200"
            >
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

  const hasActiveFilters = useMemo(() => {
    return Array.from(currentParams.keys()).some(
      (key) => ![PAGE, SORT, QUERY].includes(key)
    );
  }, [currentParams]);

  const handleClearAll = () => {
    const newUrl = createUrl(
      pathname,
      new URLSearchParams({
        ...(sort && { [SORT]: sort }),
        ...(Number(currentPage) > 1 && { [PAGE]: currentPage.toString() }),
        ...(query && { [QUERY]: query }),
      })
    );
    startTransition(() => {
      router.replace(newUrl, { scroll: false });
    });
  };

  return (
    <div className="grid grid-cols-1 gap-x-3 gap-y-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
      {filterAttributes?.map((item: getFilterAttributeTypes) => {
        const hasOptions = isArray(item.options);

        return hasOptions ? (
          <FilterItemList key={item.id} list={item} title={item?.adminName} />
        ) : null;
      })}

      {hasActiveFilters ? (
        <button
          disabled={isPending}
          type="button"
          onClick={handleClearAll}
          className="text-nowrap relative top-0 my-2 inline-flex w-fit cursor-pointer items-center text-base underline ml-0 max-md:ml-auto  md:my-0"
        >
          Clear all filters
        </button>
      ) : null}
    </div>
  );
}
