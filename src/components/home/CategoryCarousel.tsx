import { FC } from "react";
import Link from "next/link";
import { graphqlRequest } from "../../lib/graphql-fetch";
import { GET_HOME_CATEGORIES } from "@/graphql/catelog/queries/HomeCategories";
import { GridTileImage } from "../theme/ui/grid/Tile";
import { NOT_IMAGE } from "@/utils/constants";

interface CategoryCarouselProps {
  options: {
    filters: Record<string, any>;
  };
}

const CategoryCarousel: FC<CategoryCarouselProps> = async ({
  options: _options,
}) => {
  try {
    const data = await graphqlRequest<any>(
      GET_HOME_CATEGORIES,
      {},
      {
        tags: ["categories"],
        life: "days",
      }
    );

    const categories =
      data?.categories?.edges?.map((edge: any) => edge.node) || [];

    const topCategories = categories
      .filter((category: any) => category.id !== "1")
      .sort((a: any, b: any) => (a.position || 0) - (b.position || 0))
      .slice(1, 4);

    if (!topCategories.length) return null;

    return (
      <section className="pt-8 sm:pt-12 lg:pt-20">
        <div className="md:max-w-4.5xl mx-auto mb-10 w-auto text-center md:px-36">
          <h2 className="mb-2 text-2xl sm:text-4xl font-semibold">
            Shop by Category
          </h2>
          <p className="text-base font-normal text-black/60 dark:text-neutral-300">
            Discover the latest trends! Fresh products just added—shop new
            styles, tech, and essentials before they&apos;re gone.
          </p>
        </div>
        <div className="w-full overflow-x-auto overflow-y-hidden">
          <ul className="m-0 grid grid-cols-1 gap-7 p-0 xss:grid-cols-2 sm:grid-cols-3">
            {topCategories.map((category: any) => (
              <li
                key={category.id}
                className="relative aspect-498/665 h-full w-full max-w-[498px] flex-none overflow-hidden rounded-[18px]"
              >
                <Link
                  className="relative h-full w-full"
                  href={`/search/${category.translation.slug}`}
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
  } catch (error) {
    console.error("Error fetching categories:", error);
    return null;
  }
};

export default CategoryCarousel;
