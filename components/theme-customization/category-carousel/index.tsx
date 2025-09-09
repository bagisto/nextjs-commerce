import { FC } from "react";
import { getCollectionMenus } from "@/lib/bagisto";
import { FilterDataTypes } from "@/lib/bagisto/types";
import { isArray, isObject } from "@/lib/type-guards";
import { isCleanFilter } from "@/lib/utils";
import Category from "./category";

const CategoryCarousel: FC<{
  name: string;
  categoryData: {
    options?: {
      filters: FilterDataTypes[];
    };
  }[];
}> = async ({ name, categoryData }) => {
  if (!isObject(categoryData[0])) {
    return null;
  }

  const { options } = categoryData[0];

  // Get the filter to fetch Categories.
  const filters = isArray(options?.filters)
    ? isCleanFilter(options?.filters || [], "filter")
    : [];

  // Collections that start with `hidden-*` are hidden from the search page.
  const categories = await getCollectionMenus({
    inputs: filters,
    getCategoryTree: false,
    tag: "home-categories",
  });

  if (!isArray(categories)) return null;

  return <Category name={name} categories={categories} />;
};

export default CategoryCarousel;
