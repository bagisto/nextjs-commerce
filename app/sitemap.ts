import { getMenuQuery } from "@/lib/bagisto/queries/menu";
import { getPagesQuery } from "@/lib/bagisto/queries/page";
import { getCollectionProductsQuery } from "@/lib/bagisto/queries/collection";
import { bagistoFetchNoSession, removeEdgesAndNodes, reshapeCollections, reshapeProducts } from "@/lib/bagisto";
import { BagistoCollectionProductsOperation, BagistoPagesOperation, Page, PaginatedProducts } from "@/lib/bagisto/types";
import { isArray } from "@/lib/type-guards";
import type { MetadataRoute } from "next";

type Route = {
  url: string;
  lastModified: string;
};

const baseUrl = process.env.NEXTAUTH_URL;

export async function getHomeCategories(): Promise<any[]> {
  const res = await bagistoFetchNoSession<any>({
    query: getMenuQuery,
  });
  const bagistoCollections = removeEdgesAndNodes(
    res.body?.data?.homeCategories
  );
  const collections = [
    {
      handle: "",
      title: "All",
      description: "All products",
      seo: {
        title: "All",
        description: "All products",
      },
      path: "/search",
      updatedAt: new Date().toISOString(),
    },

    // Collections that start with `hidden-*` need to be hidden on the search page.
    ...reshapeCollections(bagistoCollections).filter(
      (collection) => !collection.slug?.startsWith("hidden")
    ),
  ];

  return collections;
}


export async function getProducts(): Promise<PaginatedProducts> {
  let input = [{ key: "limit", value: "48", }, {key:"page" , value: "1"}];

  const res = await bagistoFetchNoSession<BagistoCollectionProductsOperation>({
    query: getCollectionProductsQuery,
    variables: {
      input,
    },
  });

  if (!isArray(res.body.data.allProducts.data)) {
    return {
      paginatorInfo: {
        count: 0,
        currentPage: 1,
        lastPage: 1,
        total: 12,
      },
      products: [],
    };
  }

  return {
    paginatorInfo: res.body.data.allProducts?.paginatorInfo,
    products: reshapeProducts(res.body.data.allProducts.data),
  };
}


export async function getPages(): Promise<Page> {
  const res = await bagistoFetchNoSession<BagistoPagesOperation>({
    query: getPagesQuery,
  });

  return res.body.data?.cmsPages;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routesMap = [""].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  const collectionsPromise = getHomeCategories().then((collections) =>
    collections.map((collection) => ({
      url: `${baseUrl}${collection.path}`,
      lastModified: collection.updatedAt ,
    })),
  );

   const productsPromise = getProducts().then(({products}) => 
    products.map((product) => ({
      url: `${baseUrl}/product/${product.urlKey}?type=${product.type}`,
      lastModified: product?.updatedAt || ''
    }))
  );

   const pagesPromise = getPages().then(
    (pages) =>
      pages?.data?.map((page) => ({
        url: `${baseUrl}/${page?.translations?.[0]?.urlKey || ''}`,
        lastModified: page?.updatedAt || ''
      }))
  );

  let fetchedRoutes: Route[] = [];

  try {
    fetchedRoutes = (await Promise.all([
      collectionsPromise, 
      pagesPromise,
      productsPromise
      ])).flat();
  } catch (error) {
    throw JSON.stringify(error, null, 2);
  }


  return [...routesMap, ...fetchedRoutes];
}
