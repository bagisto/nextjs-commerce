import dynamicImport from "next/dynamic";
import Grid from "@/components/theme/ui/grid/Grid";
import SearchNoResult from "@/components/theme/search/SearchNoResult";
import { isArray } from "@/utils/type-guards";
import { GET_FILTER_PRODUCTS } from "@/graphql";
import { GET_PRODUCTS, GET_PRODUCTS_PAGINATION } from "@/graphql";
import { cachedGraphQLRequest } from "@/utils/hooks/useCache";
import {
  generateMetadataForPage,
  getFilterAttributes,
  buildProductFilters,
} from "@/utils/helper";
import SortOrder from "@/components/theme/filters/SortOrder";
import { SortByFields } from "@/utils/constants";
import MobileFilter from "@/components/theme/filters/MobileFilter";
import FilterList from "@/components/theme/filters/FilterList";
import { ProductsResponse } from "@/components/catalog/type";
import { MobileSearchBar } from "@components/layout/navbar/MobileSearch";
const Pagination = dynamicImport(
  () => import("@/components/catalog/Pagination"),
);
const ProductGridItems = dynamicImport(
  () => import("@/components/catalog/product/ProductGridItems"),
);

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const itemsPerPage = 12;
    const commonSearches = [""];
    const params = [];
    for (const query of commonSearches) {
      const data = await cachedGraphQLRequest<ProductsResponse>(
        "search",
        GET_PRODUCTS,
        {
          query: query,
          first: 1,
          sortKey: "CREATED_AT",
          reverse: true,
        },
      );

      const totalCount = data?.products?.totalCount || 0;
      const totalPages = Math.ceil(totalCount / itemsPerPage);
      let cursor: string | undefined;

      for (let i = 0; i < totalPages; i++) {
        const pageParams: { page: string; cursor?: string } = {
          page: String(i + 1),
        };
        if (i > 0 && cursor) {
          pageParams.cursor = cursor;
        }
        params.push(pageParams);
        if (i < totalPages - 1) {
          const pageData = await cachedGraphQLRequest<ProductsResponse>(
            "search",
            GET_PRODUCTS,
            {
              query: query,
              first: itemsPerPage,
              sortKey: "CREATED_AT",
              reverse: true,
              ...(cursor && { after: cursor }),
            },
          );
          cursor = pageData?.products?.pageInfo?.endCursor;
        }
      }
    }

    return params;
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const searchQuery = params?.q as string | undefined;

  return generateMetadataForPage("search", {
    title: searchQuery ? `Search: ${searchQuery}` : "Search Products",
    description: searchQuery
      ? `Search results for "${searchQuery}"`
      : "Search for products in our store",
    image: "/search-og.jpg",
  });
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const {
    q: searchValue,
    page,
    cursor,
    before,
  } = (params || {}) as {
    [key: string]: string;
  };

  const itemsPerPage = 12;
  const currentPage = page ? parseInt(page) - 1 : 0;
  const sortValue = params?.sort || "name-asc";
  const selectedSort =
    SortByFields.find((s) => s.key === sortValue) || SortByFields[0];
  const afterCursor: string | undefined = cursor;
  const beforeCursor: string | undefined = before;

  const { filterInput, isFilterApplied } = buildProductFilters(params || {});

  let dataPromise;
  if (isFilterApplied) {
    dataPromise = cachedGraphQLRequest<ProductsResponse>(
      "search",
      GET_FILTER_PRODUCTS,
      {
        query: searchValue,
        filter: filterInput,
        ...(beforeCursor
          ? { last: itemsPerPage, before: beforeCursor }
          : { first: itemsPerPage, after: afterCursor }),
        sortKey: selectedSort.sortKey,
        reverse: selectedSort.reverse,
      },
    );
  } else {
    dataPromise = (async () => {
      let currentAfterCursor = afterCursor;
      if (currentPage > 0 && !afterCursor) {
        const cursorData = await cachedGraphQLRequest<ProductsResponse>(
          "search",
          GET_PRODUCTS_PAGINATION,
          {
            query: searchValue,
            first: currentPage * itemsPerPage,
            sortKey: selectedSort.sortKey,
            reverse: selectedSort.reverse,
          },
        );
        currentAfterCursor = cursorData?.products?.pageInfo?.endCursor;
      }

      return cachedGraphQLRequest<ProductsResponse>("search", GET_PRODUCTS, {
        query: searchValue,
        ...(beforeCursor
          ? { last: itemsPerPage, before: beforeCursor }
          : { first: itemsPerPage, after: currentAfterCursor }),
        sortKey: selectedSort.sortKey,
        reverse: selectedSort.reverse,
      });
    })();
  }

  const [data, filterAttributes] = await Promise.all([
    dataPromise,
    getFilterAttributes(),
  ]);

  const products = data?.products?.edges?.map((e) => e.node) || [];
  const pageInfo = data?.products?.pageInfo;
  const totalCount = data?.products?.totalCount;
  const hasProducts = isArray(products) && products.length > 0;

  return (
    <>
      <MobileSearchBar />
      {hasProducts && (
        <h2 className="text-2xl sm:text-4xl font-semibold mx-auto mt-7.5 w-full max-w-screen-2xl my-3 mx-auto px-4 xss:px-7.5">
          All Top Products
        </h2>
      )}

      {hasProducts && (
        <div className="my-10 hidden gap-4 md:flex md:items-baseline md:justify-between w-full mx-auto max-w-screen-2xl px-4 xss:px-7.5">
          <FilterList filterAttributes={filterAttributes} />
          <SortOrder sortOrders={SortByFields} title="Sort by" />
        </div>
      )}
      {hasProducts && (
        <div className="flex items-center justify-between gap-4 py-8 md:hidden mx-auto w-full max-w-screen-2xl px-4 xss:px-7.5">
          <MobileFilter filterAttributes={filterAttributes} />
          <SortOrder sortOrders={SortByFields} title="Sort by" />
        </div>
      )}

      {!hasProducts && (
        <SearchNoResult searchQuery={searchValue} />
      )}
      {isArray(products) ? (
        <Grid className="grid grid-flow-row grid-cols-2 gap-5 lg:gap-11.5 w-full max-w-screen-2xl mx-auto md:grid-cols-3 lg:grid-cols-4 px-4 xss:px-7.5">
          <ProductGridItems products={products} />
        </Grid>
      ) : null}

      {hasProducts && !isFilterApplied && totalCount > itemsPerPage && (
        <nav
          aria-label="Collection pagination"
          className="my-10 block items-center sm:flex"
        >
          <Pagination
            itemsPerPage={itemsPerPage}
            itemsTotal={totalCount || 0}
            currentPage={currentPage}
            nextCursor={pageInfo?.endCursor}
            prevCursor={pageInfo?.startCursor}
          />
        </nav>
      )}

      {hasProducts && isFilterApplied && pageInfo?.hasNextPage && (
        <nav
          aria-label="Filtered pagination"
          className="my-10 block items-center sm:flex"
        >
          <Pagination
            itemsPerPage={itemsPerPage}
            itemsTotal={totalCount || 0}
            currentPage={currentPage}
            nextCursor={pageInfo?.endCursor}
            prevCursor={pageInfo?.startCursor}
          />
        </nav>
      )}
    </>
  );
}
