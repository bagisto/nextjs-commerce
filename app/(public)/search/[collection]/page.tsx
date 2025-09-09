import { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import Grid from "@/components/grid";
import FilterListSkeleton, {
  SortOrderSkeleton,
} from "@/components/layout/search/filter/filter-skeleton";
import NotFound from "@/components/layout/search/not-found";
import { getFilterAttributes, getMenu, getProducts } from "@/lib/bagisto";
import { isArray, isObject } from "@/lib/type-guards";
import MobileFilter from "@/components/layout/search/filter/modile-filter";
import CategoryDetail from "@/components/layout/search/category-detail.tsx";
import Pagination from "@/components/elements/pagination";
const ProductGridItems = dynamic(
  () => import("@/components/layout/product-grid-items"),
  {
    ssr: true,
  }
);
const FilterList = dynamic(() => import("@/components/layout/search/filter"), {
  ssr: true,
});
const SortOrder = dynamic(
  () => import("@/components/layout/search/filter/sort-order"),
  {
    ssr: true,
  }
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const { collection: categorySlug } = await params;
  const collections = await getMenu("catalog");
  const categoryItem = collections.find(
    (item) => item.path == `/search/${categorySlug}`
  );

  if (!isObject(categoryItem)) return notFound();

  return {
    title: categoryItem?.metaTitle || categoryItem?.title,
    description:
      categoryItem?.metaDescription ||
      categoryItem?.description ||
      `${categoryItem?.title} products`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ collection: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { collection: categorySlug } = await params;
  const collections = await getMenu("catalog");

  const categoryItem = collections.find(
    (item) => item.path == `/search/${categorySlug}`
  );
  const categoryId = categoryItem?.id || "";

  const { sort: sortKey = "name-desc", ...rest } = (await searchParams) as {
    [key: string]: string;
  };
  const filters = Object.entries(rest).map(([key, value]) => ({
    key,
    value,
  }));

  const data = await getProducts({
    categoryId,
    sortKey,
    filters,
    tag: categorySlug,
  });

  const productAttributes = await getFilterAttributes({
    categorySlug: categorySlug,
  });
  const sortOrders = productAttributes?.sortOrders;
  const filterAttributes = productAttributes?.filterAttributes;
  const products = data?.products;
  const paginatorInfo = data?.paginatorInfo;
  const { total, currentPage } = paginatorInfo;

  return (
    <section>
      <Suspense fallback={<FilterListSkeleton />}>
        <CategoryDetail
          categoryItem={{ description: categoryItem?.description ?? "" }}
        />
      </Suspense>

      <div className="my-10 hidden gap-4 md:flex md:items-baseline md:justify-between">
        <Suspense fallback={<FilterListSkeleton />}>
          <FilterList filterAttributes={filterAttributes} />
        </Suspense>

        <Suspense fallback={<SortOrderSkeleton />}>
          <SortOrder sortOrders={sortOrders} title="Sort by" />
        </Suspense>
      </div>
      <div className="flex items-center justify-between gap-4 py-8 md:hidden">
        <MobileFilter filterAttributes={filterAttributes} />

        <Suspense fallback={<SortOrderSkeleton />}>
          <SortOrder sortOrders={sortOrders} title="Sort by" />
        </Suspense>
      </div>
      {products.length === 0 ? (
        <NotFound
          msg={`There are no products that match Showing : ${categorySlug}`}
        />
      ) : (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <ProductGridItems products={products} />
        </Grid>
      )}

      {isArray(products) ? (
        <>
          {total > 12 ? (
            <nav
              aria-label="Collection pagination"
              className="mt-10 block items-center sm:flex"
            >
              <Pagination
                itemsPerPage={12}
                itemsTotal={total}
                currentPage={currentPage ? currentPage - 1 : 0}
              />
            </nav>
          ) : null}
        </>
      ) : null}
    </section>
  );
}
