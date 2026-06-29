import { type CacheLifeOption } from "@/lib/graphql-fetch";

export interface PageCacheConfig {
  tags: string[];
  life: CacheLifeOption;
}

export const PAGE_CACHE_CONFIG: Record<string, PageCacheConfig> = {
  home: {
    tags: ["home-page"],
    life: "hours",
  },

  product: {
    tags: ["all-products"],
    life: "hours",
  },

  category: {
    tags: ["categories"],
    life: "hours",
  },

  static: {
    tags: ["static-content"],
    life: "days",
  },

  search: {
    tags: ["search-results"],
    life: "hours",
  },
};

export function getPageCacheConfig(
  page: keyof typeof PAGE_CACHE_CONFIG,
): PageCacheConfig {
  return PAGE_CACHE_CONFIG[page];
}

export function getProductCacheConfig(productId: string): PageCacheConfig {
  return {
    tags: ["products", `product-${productId}`],
    life: "hours",
  };
}

export function getCategoryCacheConfig(categoryId: string): PageCacheConfig {
  return {
    tags: ["categories", `category-${categoryId}`],
    life: "hours",
  };
}

