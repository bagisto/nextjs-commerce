import { getHomeCategories, getPages, getProducts } from 'lib/bagisto';
import { validateEnvironmentVariables, getBaseUrl } from 'lib/utils';
import { MetadataRoute } from 'next';
export const dynamic = 'force-dynamic';
type Route = {
  url: string;
  lastModified: string;
};

const baseUrl = getBaseUrl(process.env.NEXT_PUBLIC_VERCEL_URL);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  validateEnvironmentVariables();

  const routesMap = [''].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString()
  }));

  const collectionsPromise = getHomeCategories().then((collections) =>
    collections.map((collection) => ({
      url: `${baseUrl}${collection.path}`,
      lastModified: collection.updatedAt
    }))
  );

  const productsPromise = getProducts({}).then((products) =>
    products.map((product) => ({
      url: `${baseUrl}/product/${product.urlKey}`,
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
    fetchedRoutes = (await Promise.all([collectionsPromise, productsPromise, pagesPromise])).flat();
  } catch (error) {
    throw JSON.stringify(error, null, 2);
  }

  return [...routesMap, ...fetchedRoutes];
}
