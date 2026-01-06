"use client";

import { SORT, SortOrderTypes } from "@/utils/constants";
import { createUrl } from "@/utils/helper";
import { Select, SelectItem } from "@heroui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FC } from "react";



const SortOrder: FC<{
  sortOrders: SortOrderTypes[];
  title: string;
}> = ({ sortOrders, title }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const sort = searchParams.get(SORT) || "name-asc";

  const handleSortChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (value) newParams.set(SORT, value);
    const newUrl = createUrl(pathname, newParams);

    router.replace(newUrl);
  };

  return (
    <section className="flex w-64 items-center gap-x-2.5">
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
        defaultSelectedKeys={[sort]}
        isMultiline={false}
        items={sortOrders}
        placeholder="Select a Sort Order"
        renderValue={(items) => (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-1">
            {items.map((item) => (
              <p key={item.key}>{item.data?.title}</p>
            ))}
          </div>
        )}
        size="md"
        variant="flat"
        onSelectionChange={(e) => handleSortChange(e.currentKey as string)}
      >
        {(order) => (
          <SelectItem key={order.value} textValue={order.value}>
            {order.title}
          </SelectItem>
        )}
      </Select>
    </section>
  );
};

export default SortOrder;
