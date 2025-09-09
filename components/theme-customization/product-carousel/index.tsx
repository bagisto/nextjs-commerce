import { FC } from "react";
import Theme from "./theme";
import { getCollectionHomeProducts } from "@/lib/bagisto";
import { FilterDataTypes } from "@/lib/bagisto/types";
import { isArray, isObject } from "@/lib/type-guards";
import { isCleanFilter } from "@/lib/utils";

interface ProductCarouselProps {
  name: string;
  data: {
    options: {
      filters: FilterDataTypes[];
    };
  }[];
  sortOrder: string;
}

const ProductCarousel: FC<ProductCarouselProps> = async ({
  name,
  data,
  sortOrder,
}) => {
  const options = isObject(data?.[0]) ? data[0].options : null;

  if (!options) {
    return null;
  }
  const filters = isArray(options.filters)
    ? isCleanFilter(options.filters)
    : [];

  const products = await getCollectionHomeProducts({
    filters,
    tag: `ProductCarousel${sortOrder}`,
  });

  if (!products?.length) return null;

  return (
    // <div className="flex flex-col items-center gap-y-6">
    <Theme name={name} products={products} />
    // {/* <Link
    //   className="border-blue-primary text-blue-primary font-poppins mx-auto mt-5 block w-max rounded-2xl border px-11 py-3 text-center text-base font-medium hover:bg-gray-50 max-lg:mt-0 max-lg:hidden max-lg:py-3.5 max-md:rounded-lg"
    //   aria-label="New Products"
    //   href={(options.filters, 'url')}
    // >
    //   View All
    // </Link> */}
    // </div>
  );
};

export default ProductCarousel;
