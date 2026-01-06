import { NOT_IMAGE } from "@/utils/constants";
import Link from "next/link";
import { FC } from "react";
import { GridTileImage } from "../ui/grid/Tile";
import { BagistoCollectionMenus } from "@/types/types";

const Category: FC<{
  name: string;
  categories: BagistoCollectionMenus[];
}> = ({ name, categories }) => {
  return (
    <section>
      <div className="md:max-w-4.5xl mx-auto mb-10 w-auto px-0 text-center md:px-36">
        <h2 className="mb-2 text-[28px] font-semibold text-black dark:text-white xss:mb-4 xss:text-4xl">
          {name}
        </h2>
        <p className="text-base font-normal text-black/60 dark:text-neutral-300 xss:text-lg">
          Discover the latest trends! Fresh products just added—shop new styles,
          tech, and essentials before they&apos;re gone.
        </p>
      </div>
      <div className="w-full overflow-x-auto overflow-y-hidden">
        <ul className="m-0 grid grid-cols-1 gap-7 p-0 xss:grid-cols-2 sm:grid-cols-3">
          {categories.slice(0, 3).map((product) => (
            <li
              key={`${product?.id}`}
              className="relative aspect-[498/665] h-full w-full max-w-[498px] flex-none overflow-hidden rounded-[18px]"
            >
              <Link
                className="relative h-full w-full"
                href={`/search/${product.slug}`}
              >
                <GridTileImage
                  fill
                  alt={`${product?.name} ${product.id} product image`}
                  className={
                    "relative rounded-[18px] overflow-hidden object-cover transition duration-300 ease-in-out group-hover:scale-105"
                  }
                  label={{
                    title: product?.name || "",
                    page: "category",
                    amount: "0",
                    currencyCode: "USD",
                  }}
                  src={product?.logoUrl || NOT_IMAGE}
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Category;
