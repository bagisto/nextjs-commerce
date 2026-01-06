"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import {
  AdjustmentsHorizontalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import FilterList from "./FilterList";

export default function MobileFilter({
  filterAttributes,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filterAttributes: any;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button
          size="md"
          className="flex bg-neutral-100 capitalize dark:bg-neutral-800"
          onPress={() => onOpen()}
        >
          <AdjustmentsHorizontalIcon className="h-6 w-8 fill-white stroke-black dark:stroke-white" />{" "}
          <span className="font-outfit text-base tracking-wide">Filter</span>
        </Button>
      </div>
      <Drawer
        isOpen={isOpen}
        hideCloseButton={true}
        placement="left"
        onOpenChange={onOpenChange}
        size="full"
      >
        <DrawerContent className="w-full xss:max-w-[400px]">
          {(onClose) => (
            <>
              <DrawerHeader className="flex items-center justify-between gap-1">
                <p className="">Product Filters</p>

                <button
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white"
                  onClick={onClose}
                  aria-label="Close mobile menu"
                >
                  <XMarkIcon className="h-6" />
                </button>
              </DrawerHeader>
              <DrawerBody>
                <FilterList filterAttributes={filterAttributes} />
              </DrawerBody>
              <DrawerFooter></DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
