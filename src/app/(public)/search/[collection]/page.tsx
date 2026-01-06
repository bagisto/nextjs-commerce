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
  ProductFilterAttributeResponse,
  ProductsResponse,
} from "@components/catalog/type";
import {
  GET_FILTER_OPTIONS,
  GET_FILTER_PRODUCTS,
  GET_TREE_CATEGORIES,
  graphqlRequest,
} from "@/graphql";
import { SortByFields } from "@utils/constants";
import { CategoryDetail } from "@components/theme/search/CategoryDetail";
import { Suspense } from "react";
import FilterListSkeleton from "@components/common/skeleton/FilterSkeleton";
import { CategoryNode, TreeCategoriesResponse } from "@/types/theme/category-tree";

function findCategoryBySlug(categories: CategoryNode[], slug: string): CategoryNode | null {
  for (const category of categories) {
    const translation = category.translations?.edges?.find(
      (t) => t.node.slug === slug
    );
    if (translation) return category;

    if (category.children && isArray(category.children)) {
      const found = findCategoryBySlug(category.children, slug);
      if (found) return found;
    }
  }
  return null;
}

function extractNumericId(id: string): string | undefined {
  if (!id) return undefined;
  const match = id.match(/\d+$/);
  return match ? match[0] : undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const { collection: categorySlug } = await params;

  const treeData = await graphqlRequest<TreeCategoriesResponse>(
    GET_TREE_CATEGORIES,
    { parentId: 1 },
    { tags: ["categories"], life: "days" }
  );

  const categories = treeData?.treeCategories || [];
  const categoryItem = findCategoryBySlug(categories, categorySlug);

  if (!categoryItem) return notFound();

  const translation = categoryItem.translations.edges.find(
    (t) => t.node.slug === categorySlug
  )?.node;

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

  const [treeData, colorFilterData, sizeFilterData, brandFilterData] = await Promise.all([
    graphqlRequest<TreeCategoriesResponse>(
      GET_TREE_CATEGORIES,
      { parentId: 1 },
      { tags: ["categories"], life: "days" }
    ),
    graphqlRequest<ProductFilterAttributeResponse>(GET_FILTER_OPTIONS, { id: "/api/admin/attributes/23", locale: "en" }),
    graphqlRequest<ProductFilterAttributeResponse>(GET_FILTER_OPTIONS, { id: "/api/admin/attributes/24", locale: "en" }),
    graphqlRequest<ProductFilterAttributeResponse>(GET_FILTER_OPTIONS, { id: "/api/admin/attributes/25", locale: "en" }),
  ]);

  const categories = treeData?.treeCategories || [];
  const categoryItem = findCategoryBySlug(categories, categorySlug);

  if (!categoryItem) return notFound();

  const numericId = extractNumericId(categoryItem.id);

  const {
    q: searchValue,
    page,
    cursor,
  } = (resolvedParams || {}) as {
    [key: string]: string;
  };

  const itemsPerPage = 12;
  const currentPage = page ? parseInt(page) - 1 : 0;
  const sortValue = resolvedParams?.sort || "name-asc";
  const selectedSort =
    SortByFields.find((s) => s.key === sortValue) || SortByFields[0];

  const rawColor = resolvedParams?.color;
  const rawSize = resolvedParams?.size;
  const rawBrand = resolvedParams?.brand;

  const colorFilter = typeof rawColor === "string" ? rawColor.split(",") : [];
  const sizeFilter = typeof rawSize === "string" ? rawSize.split(",") : [];
  const brandFilter = typeof rawBrand === "string" ? rawBrand.split(",") : [];

  const colorIds = colorFilter.map((iri) => extractNumericId(iri)).filter(Boolean);
  const sizeIds = sizeFilter.map((iri) => extractNumericId(iri)).filter(Boolean);
  const brandIds = brandFilter.map((iri) => extractNumericId(iri)).filter(Boolean);

  const filterObject: Record<string, string> = {};

  if (numericId) {
    filterObject.category_id = numericId;
  }

  if (colorIds.length > 0) filterObject.color = colorIds.join(",");
  if (sizeIds.length > 0) filterObject.size = sizeIds.join(",");
  if (brandIds.length > 0) filterObject.brand = brandIds.join(",");

  const filterInput = JSON.stringify(filterObject);

  const [data] = await Promise.all([
    graphqlRequest<ProductsResponse>(GET_FILTER_PRODUCTS, {
      query: searchValue || "",
      filter: filterInput,
      first: itemsPerPage,
      sortKey: selectedSort.sortKey,
      reverse: selectedSort.reverse,
      ...(cursor && { after: cursor }),
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
  const translation = categoryItem.translations?.edges?.find(
  (t) => t.node.slug === categorySlug
)?.node;

  return (
    <section>
      <Suspense fallback={<FilterListSkeleton />}>
  <CategoryDetail
    categoryItem={{ description: translation?.description ?? "", name: translation?.name ?? "" }}
    
  />
</Suspense>
      <div className="my-10 hidden gap-4 md:flex md:items-baseline md:justify-between w-full max-w-screen-2xl mx-auto px-[15px]">
        <FilterList filterAttributes={filterAttributes} />
        <SortOrder sortOrders={SortByFields} title="Sort by" />
      </div>
      <div className="flex items-center justify-between gap-4 py-8 md:hidden w-full max-w-screen-2xl mx-auto px-[15px]">
        <MobileFilter filterAttributes={filterAttributes} />
        <SortOrder sortOrders={SortByFields} title="Sort by" />
      </div>

      {isArray(products) && products.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full max-w-screen-2xl mx-auto px-[15px]"
         style={{ gap: "46px" }}
        >
          <ProductGridItems products={products} />
        </Grid>
      ) : (
        <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-neutral-300">
          <p className="text-neutral-500">No products found in this category.</p>
        </div>
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
          />
        </nav>  
      )}
    </section>
  );
}
