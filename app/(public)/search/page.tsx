import dynamic from "next/dynamic";
import { Suspense } from "react";
import Grid from "@/components/grid";
import FilterListSkeleton, {
  SortOrderSkeleton,
} from "@/components/layout/search/filter/filter-skeleton";
import NotFound from "@/components/layout/search/not-found";
import { getFilterAttributes, getProducts } from "@/lib/bagisto";
import MobileFilter from "@/components/layout/search/filter/modile-filter";
import { isArray } from "@/lib/type-guards";
import Pagination from "@/components/elements/pagination";
import CategoryDetail from "@/components/layout/search/category-detail.tsx";
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

export const metadata = {
  title: "Search",
  description: "Search for products in the store.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const {
    sort: sortKey = "name-desc",
    q: searchValue,
    ...rest
  } = (await searchParams) as { [key: string]: string };

  const filters = Object.entries(rest).map(([key, value]) => ({
    key,
    value,
  }));

  const data = await getProducts({
    sortKey,
    query: searchValue,
    filters,
    tag: "search",
  });

  const productAttributes = await getFilterAttributes({ categorySlug: "" });
  const sortOrders = productAttributes?.sortOrders;
  const filterAttributes = productAttributes?.filterAttributes;
  const products = data?.products || [];
  const paginatorInfo = data?.paginatorInfo;
  const { total, currentPage } = paginatorInfo;

  return (
    <>
      <CategoryDetail
        categoryItem={{
          description: `<h1>All Top Products</h1> <p>${searchValue ? searchValue : ""}</p>`,
        }}
      />

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

      {!isArray(products) && (
        <NotFound
          msg={`${
            searchValue
              ? `There are no products that match Showing : ${searchValue}`
              : "There are no products that match Showing"
          } `}
        />
      )}
      {isArray(products) ? (
        <Grid className="mb-4 grid-cols-1 400:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <ProductGridItems products={products} />
        </Grid>
      ) : null}

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
    </>
  );
}
