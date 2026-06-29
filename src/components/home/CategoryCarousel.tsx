import { FC } from "react";
import Link from "next/link";
import clsx from "clsx";
import { cachedGraphQLRequest } from "@/lib/cached-graphql";
import { GridTileImage } from "../theme/ui/grid/Tile";
import { NOT_IMAGE } from "@/utils/constants";
import { GET_HOME_CATEGORIES } from "@/graphql";
import { CategoriesResponse, CategoryEdge } from "@/types/category/type";

interface CategoryCarouselProps {
  options: {
    filters: Record<string, string | number | boolean | undefined>;
  };
}

interface MobileCategoryItemProps {
  category: CategoryEdge["node"];
  size: "full" | "half";
  priority?: boolean;
}

const MobileCategoryItem: FC<MobileCategoryItemProps> = ({
  category,
  size,
  priority,
}) => {
  return (
    <div
      className={
        size === 'full' ? 'col-span-1 xxs:col-span-2 order-2' : 'col-span-1'
      }
    >
      <Link
        aria-label={`Shop ${category.translation.name} category`}
        className={clsx(
          "relative block h-full w-full aspect-[380/280]",
          size === "half" && "xxs:aspect-[182/280]"
        )}
        href={`/search/${category.translation.slug}`}
      >
        <GridTileImage
          fill
          alt={`${category.translation.name} category image`}
          className="relative h-full w-full object-cover transition duration-300 ease-in-out group-hover:scale-105"
          label={{
            position: "center",
            title: category.translation.name || "",
            page: "category",
            amount: "0",
            currencyCode: "USD",
          }}
          priority={priority}
          sizes={
            size === "full"
              ? "100vw"
              : "(min-width: 480px) 50vw, 100vw"
          }
          src={category.logoUrl || NOT_IMAGE}
        />
      </Link>
    </div>
  );
};

interface CategoryCarouselProps {
  options: {
    filters: Record<string, string | number | boolean | undefined>;
  };
}

const CategoryCarousel: FC<CategoryCarouselProps> = async ({
  options: _options,
}) => {
  let topCategories: CategoriesResponse["categories"]["edges"][number]["node"][] = [];

  try {
    const data = await cachedGraphQLRequest<CategoriesResponse>(
      "home",
      GET_HOME_CATEGORIES,
      {}
    );

    const categories =
      data?.categories?.edges?.map((edge) => edge.node) || [];

    topCategories = categories
      .filter((category) => category.id !== "1")
      .sort((a, b) => (a.position || 0) - (b.position || 0))
      .slice(1, 4);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return null;
  }

  if (!topCategories.length) return null;

  return (
    <section className="pt-6 sm:pt-12 lg:pt-20">
        <div className="md:max-w-4.5xl mx-auto mb-5 sm:mb-10 w-auto text-center md:px-36">
          <h2 className="mb-2 text-xl md:text-4xl  font-semibold">
            Shop by Category
          </h2>
          <p className="text-sm md:text-lg font-normal text-selected-black dark:text-selected-white">
            Discover the latest trends! Fresh products just added—shop new
            styles, tech, and essentials before they&apos;re gone.
          </p>
        </div>
        <div className="w-full overflow-x-auto overflow-y-hidden">
          <div className="grid gap-4 grid-cols-1 xxs:grid-cols-2 lg:max-h-[calc(100vh-200px)] sm:hidden">
            {topCategories.length > 0 && (
              <MobileCategoryItem
                category={topCategories[0]}
                size="half"
                priority={true}
              />
            )}
            {topCategories.length > 1 && (
              <MobileCategoryItem
                category={topCategories[1]}
                size="full"
                priority={true}
              />
            )}
            {topCategories.length > 2 && (
              <MobileCategoryItem
                category={topCategories[2]}
                size="half"
              />
            )}
          </div>

          <ul className="m-0 hidden grid-cols-1 gap-5 lg:gap-7 p-0 xxs:grid-cols-2 sm:grid sm:grid-cols-3">
            {topCategories.map((category) => (
              <li
                key={category.id}
                className="relative aspect-498/665 h-full w-full max-w-[498px] flex-none overflow-hidden rounded-[18px]"
              >
                <Link
                  className="relative h-full w-full"
                  href={`/search/${category.translation.slug}`}
                  aria-label={`Shop ${category.translation.name} category`}
                >
                  <GridTileImage
                    fill
                    alt={`${category.translation.name} category image`}
                    className={
                      "relative rounded-[18px] overflow-hidden object-cover transition duration-300 ease-in-out group-hover:scale-105"
                    }
                    label={{
                      title: category.translation.name || "",
                      page: "category",
                      amount: "0",
                      currencyCode: "USD",
                    }}
                    src={category.logoUrl || NOT_IMAGE}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
  );
};

export default CategoryCarousel;
