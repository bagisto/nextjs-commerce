import { FC } from "react";
import { isObject } from "@/utils/type-guards";
import { FilterDataTypes } from "@/types/types";


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
  data,
}) => {
  const options = isObject(data?.[0]) ? data[0].options : null;

  if (!options) {
    return null;
  }


  return (
     <div className="flex flex-col items-center gap-y-6">
     </div>
  );
};

export default ProductCarousel;
