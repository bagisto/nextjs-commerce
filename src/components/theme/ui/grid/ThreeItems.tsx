export const revalidate = parseInt(process.env.REVALIDATION_DURATION as string);
import type { FilterDataTypes, InputData } from "@/types/types";
import { FC } from "react";

import { getCollectionHomeProducts } from "@/utils/bagisto";
import { isArray, isObject } from "@/utils/type-guards";
import ThreeItemGridItem from "./ThreeItemGrid";
import { isCleanFilter } from "@utils/helper";

export const ThreeItemGrid: FC<{
  name: string;
  data: {
    options: {
      filters: FilterDataTypes[];
    };
  }[];
}> = async ({ name, data }) => {
  if (!isObject(data[0])) {
    return null;
  }

  const { options } = data[0];
  // Get the filter to fetch Categories.
  const filters = isArray(options?.filters)
    ? (isCleanFilter(options?.filters || [], "filter") as InputData[])
    : [];
  // Collections that start with `hidden-*` are hidden from the search page.
  const homepageItems = await getCollectionHomeProducts({
    filters,
    tag: "ThreeItemGridItem",
  });

  if (!homepageItems[0] || !homepageItems[1] || !homepageItems[2]) return null;

  const [firstProduct, secondProduct, thirdProduct] = homepageItems;

  return (
    <section>
      <div className="md:max-w-4.5xl mx-auto mb-10 w-auto px-0 text-center md:px-36">
        <h1 className="mb-4 font-outfit text-4xl font-semibold text-black dark:text-white">
          {name}
        </h1>
        <p className="text-lg font-normal text-black/60 dark:text-neutral-300">
          Soft, stylish, and made to last. This classic tee is perfect for
          everyday wear—pair it with anything. Available in all sizes and
          colors.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-6 md:grid-rows-2 lg:max-h-[calc(100vh-200px)]">
        <ThreeItemGridItem item={firstProduct} priority={true} size="full" />
        <ThreeItemGridItem item={secondProduct} priority={true} size="half" />
        <ThreeItemGridItem item={thirdProduct} size="half" />
      </div>
    </section>
  );
};

export default ThreeItemGrid;
