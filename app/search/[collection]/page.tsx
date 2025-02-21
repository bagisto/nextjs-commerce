import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import { getCollection, getCollectionProducts, getMenu } from 'lib/bagisto';
import { defaultSort, sorting } from 'lib/constants';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params
}: {
  params: { collection: string };
}): Promise<Metadata> {
  const collections = await getMenu('header-menu');
  const categoryItem = collections.filter((item) => item.path == `/search/${params.collection}`);
  const collection = await getCollection(categoryItem?.[0]?.id || '');
  if (!collection) return notFound();

  const firstP = collection[0];

  return {
    title: firstP?.metaTitle || firstP?.name,
    description: firstP?.metaDescription || firstP?.description || `${firstP?.name} products`
  };
}

export default async function CategoryPage({
  params,
  searchParams
}: {
  params: { collection: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const collections = await getMenu('header-menu');
  const categoryItem = collections.filter((item) => item.path == `/search/${params.collection}`);
  const { sort } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;
  const products = await getCollectionProducts({
    collection: categoryItem?.at(0)?.id || '',
    sortKey,
    reverse
  });

  return (
    <section>
      {products.length === 0 ? (
        <p className="py-3 text-lg">{`No products found in this collection`}</p>
      ) : (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      )}
    </section>
  );
}
