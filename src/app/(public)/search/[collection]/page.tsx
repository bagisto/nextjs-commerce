import { Metadata } from "next";
import { notFound } from "next/navigation";
import { isArray } from "@/utils/type-guards";
import Grid from "@components/theme/ui/grid/Grid";
import FilterList from "@components/theme/filters/FilterList";
import SortOrder from "@components/theme/filters/SortOrder";
import MobileFilter from "@components/theme/filters/MobileFilter";
import ProductGridItems from "@components/catalog/product/ProductGridItems";
import Pagination from "@components/catalog/Pagination";
import {
  ProductsResponse,
} from "@components/catalog/type";
import {
  GET_FILTER_PRODUCTS,
  GET_TREE_CATEGORIES,
} from "@/graphql";
import { cachedGraphQLRequest, cachedCategoryRequest, getFilterAttributes } from "@/lib/cached-graphql";
import { SortByFields } from "@utils/constants";
import SearchNoResult from "@/components/theme/search/SearchNoResult";
import { CategoryDetail } from "@components/theme/search/CategoryDetail";
import { Suspense } from "react";
import FilterListSkeleton from "@components/common/skeleton/FilterSkeleton";
import { TreeCategoriesResponse } from "@/types/theme/category-tree";
import { MobileSearchBar } from "@components/layout/navbar/MobileSearch";
import CategoryHeaderClient from "@components/layout/navbar/CategoryHeaderClient";
import { extractNumericId, findCategoryBySlug, buildProductFilters } from "@utils/helper";


export const dynamicParams = true;


export async function generateMetadata({
  params,
}: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const { collection: categorySlug } = await params;

  const treeData = await cachedGraphQLRequest<TreeCategoriesResponse>(
    "category",
    GET_TREE_CATEGORIES,
    { parentId: 1 }
  );

  const categories = treeData?.treeCategories || [];
  const categoryItem = findCategoryBySlug(categories, categorySlug);

  if (!categoryItem) return notFound();

  const translation = categoryItem.translation;

  return {
    title: translation?.metaTitle || translation?.name,
    description: translation?.description || `${translation?.name} products`,
  };
}

export default async function CategoryPage({
  searchParams,
  params,
}: {
  params: Promise<{ collection: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { collection: categorySlug } = await params;
  const resolvedParams = await searchParams;

  const [treeData, filterAttributes] = await Promise.all([
    cachedGraphQLRequest<TreeCategoriesResponse>(
      "category",
      GET_TREE_CATEGORIES,
      { parentId: 1 }
    ),
    getFilterAttributes(),
  ]);

  const categories = treeData?.treeCategories || [];
  const categoryItem = findCategoryBySlug(categories, categorySlug);

  if (!categoryItem) return notFound();

  const numericId = extractNumericId(categoryItem.id);

  const {
    q: searchValue,
    page,
    cursor,
    before,
  } = (resolvedParams || {}) as {
    [key: string]: string;
  };

  const itemsPerPage = 12;
  const currentPage = page ? parseInt(page) - 1 : 0;
  const sortValue = resolvedParams?.sort || "name-asc";
  const selectedSort =
    SortByFields.find((s) => s.key === sortValue) || SortByFields[0];

  const { filterObject: baseFilterObject } = buildProductFilters(resolvedParams || {});

  const filterObject: Record<string, string> = {
    ...baseFilterObject,
  };

  if (numericId) {
    filterObject.category_id = numericId;
  }

  const filterInput = JSON.stringify(filterObject);

  const [data] = await Promise.all([
    cachedCategoryRequest<ProductsResponse>(
      categorySlug,
      GET_FILTER_PRODUCTS,
      {
        query: searchValue || "",
        filter: filterInput,
        ...(before
          ? { last: itemsPerPage, before: before }
          : { first: itemsPerPage, after: cursor }),
        sortKey: selectedSort.sortKey,
        reverse: selectedSort.reverse,
      }
    ),
  ]);

  const products = data?.products?.edges?.map((e) => e.node) || [];
  const pageInfo = data?.products?.pageInfo;
  const totalCount = data?.products?.totalCount;
  const translation = categoryItem.translation;

  return (
    <>
      <CategoryHeaderClient />
      <MobileSearchBar />
      <section>
        <Suspense fallback={<FilterListSkeleton />}>
          <CategoryDetail
            categoryItem={{ description: translation?.description ?? "", name: translation?.name ?? "" }}

          />
        </Suspense>

        <div className="my-10 hidden gap-4 md:flex md:items-baseline md:justify-between w-full max-w-screen-2xl mx-auto px-4">
          <FilterList filterAttributes={filterAttributes} />
          <SortOrder sortOrders={SortByFields} title="Sort by" />
        </div>
        <div className="flex items-center justify-between gap-4 py-8 md:hidden w-full max-w-screen-2xl mx-auto px-4">
          <MobileFilter filterAttributes={filterAttributes} />
          <SortOrder sortOrders={SortByFields} title="Sort by" />
        </div>

        {isArray(products) && products.length > 0 ? (
          <Grid
            className="grid grid-flow-row grid-cols-2 gap-5 lg:gap-11.5 w-full max-w-screen-2xl mx-auto md:grid-cols-3 lg:grid-cols-4 px-4 xss:px-7.5"
          >
            <ProductGridItems products={products} backUrl={`/search/${categorySlug}`} />
          </Grid>
        ) : (
          <SearchNoResult />
        )}

        {isArray(products) && (totalCount > itemsPerPage || pageInfo?.hasNextPage) && (
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
      </section>
    </>
  );
}
