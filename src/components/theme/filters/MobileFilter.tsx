"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Button,
  useDisclosure,
} from "@heroui/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Select, SelectItem } from "@heroui/select";
import { SORT, PAGE, QUERY } from "@/utils/constants";
import { createUrl } from "@/utils/helper";
import { FilterAttribute, FilterAttributeOption } from "@/components/catalog/type";

export default function MobileFilter({
  filterAttributes,
}: {
  filterAttributes: FilterAttribute[];
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [tempFilters, setTempFilters] = useState<Record<string, Set<string>>>(
    {}
  );

  useEffect(() => {
    if (isOpen) {
      const initialFilters: Record<string, Set<string>> = {};
      filterAttributes.forEach((attr: FilterAttribute) => {
        const values = searchParams.get(attr.code)?.split(",") || [];
        initialFilters[attr.code] = new Set(values.filter(Boolean));
      });
      //eslint-disable-next-line  
      setTempFilters(initialFilters);
    }
  }, [isOpen, filterAttributes, searchParams]);

  const handleFilterChange = (code: string, keys: Set<string>) => {
    setTempFilters((prev) => ({
      ...prev,
      [code]: keys,
    }));
  };

  const applyFilters = () => {
    const newParams = new URLSearchParams(searchParams.toString());

    Object.entries(tempFilters).forEach(([code, values]) => {
      if (values.size > 0) {
        newParams.set(code, Array.from(values).join(","));
      } else {
        newParams.delete(code);
      }
    });

    newParams.delete(PAGE);

    const newUrl = createUrl(pathname, newParams);
    router.replace(newUrl);
    onOpenChange();
  };

  const clearAllFilters = () => {
    const q = searchParams.get(QUERY);
    const sort = searchParams.get(SORT);
    const newParams = new URLSearchParams();

    if (q) newParams.set(QUERY, q);
    if (sort) newParams.set(SORT, sort);

    router.replace(createUrl(pathname, newParams));
    onOpenChange();
  };

  const formatLabel = (str?: string) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button
          size="md"
          className="flex bg-overlay-subtle border-1.5 border-white dark:bg-neutral-800 dark:border-neutral-700 w-[93px] h-[40px] px-[14px] py-[10px] gap-2 rounded-lg cursor-pointer"
          onPress={() => onOpen()}
        >
          <Image src="/icons/filter-icon.svg" alt="filter" width={20} height={20} className="dark:invert" />
          <span className="font-outfit text-base tracking-wide">Filter</span>
        </Button>
      </div>

      <Drawer
        isOpen={isOpen}
        placement="bottom"
        onOpenChange={onOpenChange}
        hideCloseButton
      >
        <DrawerContent className="rounded-t-4xl dark:bg-neutral-900">
          {(_onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1 pb-4 pt-2">
                <div className="mx-auto h-1 w-10 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                <div className="flex items-center justify-between mt-2 px-2">
                  <h2 className="text-2xl font-bold tracking-tight">Filters</h2>
                  <div className="flex items-center gap-4">
                    {Array.from(searchParams.keys()).some(
                      (key) => key !== QUERY && key !== SORT
                    ) && (
                        <button
                          onClick={clearAllFilters}
                          className="text-sm font-medium underline underline-offset-4 text-neutral-600 dark:text-selected-white"
                        >
                          Clear all filters
                        </button>
                      )}
                    <Button
                      color="primary"
                      radius="full"
                      size="md"
                      className="px-6 font-semibold"
                      onPress={applyFilters}
                    >
                      Apply Filter
                    </Button>
                  </div>
                </div>
              </DrawerHeader>
              <DrawerBody className="px-6 pb-12 pt-2">
                <div className="flex flex-col gap-6">
                  {filterAttributes?.map((attr: FilterAttribute) => (
                    <div key={attr.id} className="flex flex-col gap-2">
                      <p className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                        Select {formatLabel(attr.adminName)}
                      </p>
                      <Select
                        isMultiline
                        items={attr.options}
                        aria-label={`Select ${attr.adminName}`}
                        placeholder={`All ${formatLabel(attr.adminName)}s`}
                        selectedKeys={tempFilters[attr.code] || new Set()}
                        selectionMode="multiple"
                        variant="flat"
                        size="lg"
                        classNames={{
                          value: "text-neutral-800 dark:text-neutral-200 font-outfit text-sm font-medium",
                          trigger: "bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 min-h-12 h-12 rounded-xl",
                          popoverContent: "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl",
                        }}
                        onSelectionChange={(keys) =>
                          handleFilterChange(attr.code, keys as Set<string>)
                        }
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
                              <span className="text-xs font-semibold px-2 py-0.5 rounded-full  text-neutral-800 dark:text-neutral-200 font-outfit">
                                +{items.length - 1}
                              </span>
                            </div>
                          );
                        }}
                      >
                        {(option: FilterAttributeOption) => (
                          <SelectItem
                            key={option.id}
                            textValue={option.adminName}
                            className="text-neutral-800 dark:text-neutral-200"
                          >
                            {option.adminName}
                          </SelectItem>
                        )}
                      </Select>
                    </div>
                  ))}
                </div>
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
