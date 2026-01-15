"use client";

import { SORT, SortOrderTypes } from "@/utils/constants";
import { createUrl } from "@/utils/helper";
import { Select, SelectItem } from "@heroui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FC, useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Button,
  useDisclosure,
} from "@heroui/react";
import { SortIcon } from "@components/common/icons/SortIcon";



const SortOrder: FC<{
  sortOrders: SortOrderTypes[];
  title: string;
}> = ({ sortOrders, title }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const sort = searchParams.get(SORT) || "name-asc";

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [tempSort, setTempSort] = useState(sort);

  useEffect(() => {
    setTempSort(sort);
  }, [sort]);

  const handleSortChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (value) newParams.set(SORT, value);
    const newUrl = createUrl(pathname, newParams);

    router.replace(newUrl);
  };

  const applySort = () => {
    handleSortChange(tempSort);
    onOpenChange();
  };

  const clearFilters = () => {
    const q = searchParams.get("q");
    const newParams = new URLSearchParams();
    if (q) newParams.set("q", q);
    router.replace(createUrl(pathname, newParams));
    onOpenChange();
  };

  return (
    <>
      {/* Desktop View */}
      <section className="hidden md:flex w-64 items-center gap-x-2.5">
        <p
          id="sort-label"
          className="leading-0 text-nowrap min-[1300]:block hidden"
        >
          {title}
        </p>
        <Select
          defaultOpen={false}
          aria-label={title}
          aria-labelledby="sort-label"
          selectedKeys={[sort]}
          isMultiline={false}
          items={sortOrders}
          placeholder="Select a Sort Order"
          classNames={{
            value: "text-neutral-800 dark:text-neutral-200",
          }}
          renderValue={(items) => (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-1">
              {items.map((item) => (
                <p key={item.key} className="text-neutral-800 dark:text-neutral-200">{item.data?.title}</p>
              ))}
            </div>
          )}
          size="md"
          variant="flat"
          onSelectionChange={(e) => handleSortChange(e.currentKey as string)}
        >
          {(order) => (
            <SelectItem
              key={order.value}
              textValue={order.value}
              className="text-neutral-800 dark:text-neutral-200"
            >
              {order.title}
            </SelectItem>
          )}
        </Select>
      </section>

      {/* Mobile View Toggle */}
      <div className="md:hidden flex flex-wrap gap-3">
        <Button
          size="md"
          variant="flat"
          className="bg-neutral-100 dark:bg-neutral-800"
          onPress={onOpen}
        >
          <SortIcon />
          <span className="font-outfit text-base tracking-wide"> Sort</span>
        </Button>
      </div>

      {/* Mobile Bottom Sheet */}
      <Drawer
        isOpen={isOpen}
        placement="bottom"
        onOpenChange={onOpenChange}
        hideCloseButton
      >
        <DrawerContent className="rounded-t-[32px] dark:bg-neutral-900">
          {(_onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1 pb-4 pt-2">
                <div className="mx-auto h-1 w-10 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                <div className="flex items-center justify-between mt-2 px-2">
                  <h2 className="text-2xl font-bold tracking-tight">Sort</h2>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={clearFilters}
                      className="text-sm font-medium underline underline-offset-4 text-neutral-600 dark:text-neutral-400"
                    >
                      Clear all filters
                    </button>
                    <Button
                      color="primary"
                      radius="full"
                      size="md"
                      className="px-6 font-semibold"
                      onPress={applySort}
                    >
                      Apply Filter
                    </Button>
                  </div>
                </div>
              </DrawerHeader>
              <DrawerBody className="px-6 pb-12 pt-2">
                <div className="flex flex-col gap-4">
                  <p className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                    Sort By
                  </p>
                  <Select
                    aria-label="Sort options"
                    selectedKeys={[tempSort]}
                    className="w-full"
                    variant="flat"
                    size="lg"
                    classNames={{
                      value: "text-neutral-800 dark:text-neutral-200",
                      trigger: "dark:bg-neutral-800",
                    }}
                    onSelectionChange={(e) =>
                      setTempSort(e.currentKey as string)
                    }
                  >
                    {sortOrders.map((order) => (
                      <SelectItem
                        key={order.value}
                        textValue={order.title}
                        className="text-neutral-800 dark:text-neutral-200"
                      >
                        {order.title}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SortOrder;
