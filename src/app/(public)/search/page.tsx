import dynamicImport from "next/dynamic";
import Grid from "@/components/theme/ui/grid/Grid";
import NotFound from "@/components/theme/search/not-found";
import { isArray } from "@/utils/type-guards";
import {
  GET_FILTER_OPTIONS,
  GET_FILTER_PRODUCTS,
  graphqlRequest,
} from "@/graphql";
import { GET_PRODUCTS, GET_PRODUCTS_PAGINATION } from "@/graphql";
import { generateMetadataForPage } from "@/utils/helper";
import SortOrder from "@/components/theme/filters/SortOrder";
import { SortByFields } from "@/utils/constants";
import MobileFilter from "@/components/theme/filters/MobileFilter";
import FilterList from "@/components/theme/filters/FilterList";
import {
  ProductFilterAttributeResponse,
  ProductsResponse,
} from "@/components/catalog/type";
const Pagination = dynamicImport(
  () => import("@/components/catalog/Pagination")
);
const ProductGridItems = dynamicImport(
  () => import("@/components/catalog/product/ProductGridItems")
);

export const dynamicParams = true;


export async function generateStaticParams() {
  try {
    const itemsPerPage = 12;
    const commonSearches = [""];
    const params = [];
    for (const query of commonSearches) {
      const data = await graphqlRequest<ProductsResponse>(GET_PRODUCTS, {
        query: query,
        first: 1,
        sortKey: "CREATED_AT",
        reverse: true,
      });

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
          const pageData = await graphqlRequest<ProductsResponse>(
            GET_PRODUCTS,
            {
              query: query,
              first: itemsPerPage,
              sortKey: "CREATED_AT",
              reverse: true,
              ...(cursor && { after: cursor }),
            }
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
  } = (params || {}) as {
    [key: string]: string;
  };

  const itemsPerPage = 12;
  const currentPage = page ? parseInt(page) - 1 : 0;
  const sortValue = params?.sort || "name-asc";
  const selectedSort =
    SortByFields.find((s) => s.key === sortValue) || SortByFields[0];
  const afterCursor: string | undefined = cursor;
  const rawColor = params?.color;
  const rawSize = params?.size;
  const rawBrand = params?.brand;

  const colorFilter =
    typeof rawColor === "string"
      ? rawColor.split(",")
      : Array.isArray(rawColor)
        ? rawColor
        : [];
  const sizeFilter =
    typeof rawSize === "string"
      ? rawSize.split(",")
      : Array.isArray(rawSize)
        ? rawSize
        : [];

  const brandFilter =
    typeof rawBrand === "string"
      ? rawBrand.split(",")
      : Array.isArray(rawBrand)
        ? rawBrand
        : [];

  const extractId = (value: string) => {
    if (/^\d+$/.test(value)) return value;

    const match = value.match(/\/(\d+)$/);
    return match ? match[1] : null;
  };
  const colorIds = colorFilter
    .map(extractId)
    .filter((id): id is string => Boolean(id));

  const sizeIds = sizeFilter
    .map(extractId)
    .filter((id): id is string => Boolean(id));

  const brandIds = brandFilter
    .map(extractId)
    .filter((id): id is string => Boolean(id));

  const filterObject: Record<string, string> = {};

  if (colorIds.length > 0) filterObject.color = colorIds.join(",");
  if (sizeIds.length > 0) filterObject.size = sizeIds.join(",");
  if (brandIds.length > 0) filterObject.brand = brandIds.join(",");

  const isFilterApplied = Object.keys(filterObject).length > 0;
  const filterInput = isFilterApplied
    ? Object.entries(filterObject)
      .map(([key, value]) => JSON.stringify({ [key]: value }))
      .join("")
    : undefined;

  let dataPromise;
  if (isFilterApplied) {
    dataPromise = graphqlRequest<ProductsResponse>(GET_FILTER_PRODUCTS, {
      query: searchValue,
      filter: filterInput,
      first: itemsPerPage,
      sortKey: selectedSort.sortKey,
      reverse: selectedSort.reverse,
      ...(cursor && { after: cursor }),
    });
  } else {
    dataPromise = (async () => {
      let currentAfterCursor = afterCursor;
      if (currentPage > 0 && !afterCursor) {
        const cursorData = await graphqlRequest<ProductsResponse>(
          GET_PRODUCTS_PAGINATION,
          {
            query: searchValue,
            first: currentPage * itemsPerPage,
            sortKey: selectedSort.sortKey,
            reverse: selectedSort.reverse,
          }
        );
        currentAfterCursor = cursorData?.products?.pageInfo?.endCursor;
      }

      return graphqlRequest<ProductsResponse>(GET_PRODUCTS, {
        query: searchValue,
        first: itemsPerPage,
        sortKey: selectedSort.sortKey,
        reverse: selectedSort.reverse,
        ...(currentAfterCursor && { after: currentAfterCursor }),
      });
    })();
  }

  const [data, colorFilterData, sizeFilterData, brandFilterData] = await Promise.all([
    dataPromise,
    graphqlRequest<ProductFilterAttributeResponse>(GET_FILTER_OPTIONS, {
      id: "/api/admin/attributes/23",
      locale: "en",
    }),
    graphqlRequest<ProductFilterAttributeResponse>(GET_FILTER_OPTIONS, {
      id: "/api/admin/attributes/24",
      locale: "en",
    }),
    graphqlRequest<ProductFilterAttributeResponse>(GET_FILTER_OPTIONS, {
      id: "/api/admin/attributes/25",
      locale: "en",
    }),
  ]);

  const filterAttributes = [
    colorFilterData?.attribute,
    sizeFilterData?.attribute,
    brandFilterData?.attribute,
  ]
    .filter(Boolean)
    .map((attr) => ({
      id: attr.id,
      code: attr.code,
      adminName: attr.code.toUpperCase(),
      options: attr.options.edges.map((o) => ({
        id: o.node.id,
        adminName: o.node.adminName,
      })),
    }));

  const products = data?.products?.edges?.map((e) => e.node) || [];
  const pageInfo = data?.products?.pageInfo;
  const totalCount = data?.products?.totalCount;

  return (
    <>
      <h2 className="text-2xl sm:text-4xl font-semibold mx-auto mt-7.5 w-full max-w-screen-2xl my-3 mx-auto px-[15px] xss:px-7.5">
        All Top Products
      </h2>

      <div className="my-10 hidden gap-4 md:flex md:items-baseline md:justify-between w-full mx-auto max-w-screen-2xl px-[15px] xss:px-7.5">
        <FilterList filterAttributes={filterAttributes} />

        <SortOrder sortOrders={SortByFields} title="Sort by" />
      </div>
      <div className="flex items-center justify-between gap-4 py-8 md:hidden  mx-auto w-full max-w-screen-2xl px-[15px] xss:px-7.5">
        <MobileFilter filterAttributes={filterAttributes} />

        <SortOrder sortOrders={SortByFields} title="Sort by" />
      </div>

      {!isArray(products) && (
        <NotFound
          msg={`${searchValue
              ? `There are no products that match Showing : ${searchValue}`
              : "There are no products that match Showing"
            } `}
        />
      )}
      {isArray(products) ? (
        <Grid 
        className="grid grid-flow-row grid-cols-1 sm:grid-cols-2 w-full max-w-screen-2xl mx-auto md:grid-cols-3 lg:grid-cols-4 px-[15px] xss:px-7.5"
         style={{ gap: "46px" }}
        >
          <ProductGridItems products={products} />
        </Grid>
      ) : null}

      {!isFilterApplied && isArray(products) && totalCount > itemsPerPage && (
        <nav
          aria-label="Collection pagination"
          className="my-10 block items-center sm:flex"
        >
          <Pagination
            itemsPerPage={itemsPerPage}
            itemsTotal={totalCount || 0}
            currentPage={currentPage}
            nextCursor={pageInfo?.endCursor}
          />
        </nav>
      )}

      {isFilterApplied && isArray(products) && pageInfo?.hasNextPage && (
        <nav
          aria-label="Filtered pagination"
          className="my-10 block items-center sm:flex"
        >
          <Pagination
            itemsPerPage={itemsPerPage}
            itemsTotal={totalCount || 0}
            currentPage={currentPage}
            nextCursor={pageInfo?.endCursor}
          />
        </nav>
      )}
    </>
  );
}
