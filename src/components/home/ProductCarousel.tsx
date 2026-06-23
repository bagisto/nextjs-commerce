import { FC } from "react";
import { cachedGraphQLRequest } from "@/utils/hooks/useCache";
import { ThreeItemGrid } from "./ThreeItemGrid";
import Theme from "./ProductCarouselTheme";
import { GET_PRODUCTS } from "@/graphql";
import { ProductsResponse } from "@/components/catalog/type";

interface ProductCarouselProps {
  options: {
    title?: string;
    filters: Record<string, any>;
  };
  itemCount?: number;
  sortOrder?: number;
}

const ProductCarousel: FC<ProductCarouselProps> = async ({
  options,
  itemCount = 4,
  sortOrder,
}) => {
  const { filters, title } = options;
  let products: any[] = [];

  try {
    const { sort, limit, ...rest } = filters || {};
    const filterObject: Record<string, string> = {};
    Object.entries(rest).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        filterObject[key] = String(value);
      }
    });
    const filterInput =
      Object.keys(filterObject).length > 0
        ? JSON.stringify(filterObject)
        : undefined;

    let sortKey = "CREATED_AT";
    let reverse = true;

    if (sort === "created_at-desc") {
      sortKey = "CREATED_AT";
      reverse = true;
    } else if (sort === "price-desc") {
      sortKey = "PRICE";
      reverse = true;
    }

    const data = await cachedGraphQLRequest<ProductsResponse>(
      "home",
      GET_PRODUCTS,
      {
        sortKey,
        filter: filterInput,
        first: limit ? parseInt(limit, 10) : itemCount,
        reverse,
      }
    );

    products =
      data?.products?.edges?.slice(0, 8).map((edge) => edge.node) || [];
  } catch (error) {
    console.error("Error fetching products for carousel:", {
      title,
      filters,
      error: error instanceof Error ? error.message : error,
    });
    return null;
  }

  if (!products.length) {
    return null;
  }

  if (sortOrder === 2) {
    return (
      <ThreeItemGrid
        title={title || "Products"}
        description="Discover the latest trends! Fresh products just added—shop new styles, tech, and essentials before they're gone."
        products={products.slice(0, 3)}
      />
    );
  }

  return (
    <Theme
      title={title || "Products"}
      description="Discover the latest trends! Fresh products just added—shop new styles, tech, and essentials before they're gone."
      products={products}
    />
  );
};

export default ProductCarousel;
