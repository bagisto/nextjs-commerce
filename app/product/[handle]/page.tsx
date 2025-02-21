import { GridTileImage } from 'components/grid/tile';
import { Gallery } from 'components/product/gallery';
import { ProductDescription } from 'components/product/product-description';
import { getCollectionProducts } from 'lib/bagisto';
import type { ImageInfo, RelatedProducts } from 'lib/bagisto/types';
import { BASE_SCHEMA_URL, PRODUCT_OFFER_TYPE, PRODUCT_TYPE } from 'lib/constants';
import { isArray } from 'lib/type-guards';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
export async function generateMetadata({
  params
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const product = await getCollectionProducts({ collection: params.handle, page: 'product' });
  if (!product) return notFound();
  const data = product[0];
  const { url, altText: alt } = data?.images?.[0] || {};

  const { width, height = '100', name, description } = data || {};
  const indexable = true;

  return {
    title: name,
    description: description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable
      }
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt
            }
          ]
        }
      : null
  };
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getCollectionProducts({ collection: params.handle, page: 'product' });
  if (!product) return notFound();
  const data = product[0];

  const productJsonLd = {
    '@context': BASE_SCHEMA_URL,
    '@type': PRODUCT_TYPE,
    name: data?.name,
    description: data?.description,
    image: data?.images?.[0]?.url,
    offers: {
      '@type': PRODUCT_OFFER_TYPE,
      availability:
        data?.inventories?.[0]?.qty || 0 > 0
          ? `${BASE_SCHEMA_URL}/InStock`
          : `${BASE_SCHEMA_URL}/OutOfStock`,
      priceCurrency: data?.priceHtml.currencyCode,
      highPrice: data?.priceHtml?.regularPrice,
      lowPrice: data?.priceHtml?.regularPrice
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd)
        }}
      />
      <div className="mx-auto max-w-screen-2xl px-4">
        <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:flex-row lg:gap-8 dark:border-neutral-800 dark:bg-black">
          <div className="h-full w-full basis-full lg:basis-4/6">
            <Suspense
              fallback={
                <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
              }
            >
              {isArray(data?.images) ? (
                <Gallery
                  images={
                    data?.images?.map((image: ImageInfo) => ({
                      src: image?.url || '',
                      altText: image?.path || ''
                    })) || []
                  }
                />
              ) : (
                <Gallery
                  images={[
                    {
                      src: '/image/placeholder.webp',
                      altText: 'product image'
                    }
                  ]}
                />
              )}
            </Suspense>
          </div>
          <div className="basis-full lg:basis-2/6">
            <ProductDescription product={product} />
          </div>
        </div>
        <RelatedProducts relatedProduct={data?.relatedProducts || []} />
      </div>
    </>
  );
}

async function RelatedProducts({ relatedProduct }: { relatedProduct: RelatedProducts[] }) {
  if (!relatedProduct.length) return null;

  return (
    <div className="py-8">
      <h2 className="mb-4 text-2xl font-bold">Related Products</h2>
      <ul className="flex w-full gap-4 overflow-x-auto pt-1">
        {relatedProduct.map((item) => (
          <li
            key={item.urlKey}
            className="aspect-square w-full flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
          >
            <Link className="relative h-full w-full" href={`/product/${item.urlKey}`}>
              <GridTileImage
                alt={item.name}
                label={{
                  title: item.name,
                  amount: item.priceHtml.finalPrice || item.priceHtml.regularPrice || '0',
                  currencyCode: item.priceHtml.currencyCode
                }}
                src={item.images?.[0]?.url || ''}
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
