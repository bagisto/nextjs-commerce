import { AddToCart } from 'components/cart/add-to-cart';
import Price from 'components/price';
import Prose from 'components/prose';
import { BagistoProductInfo } from 'lib/bagisto/types';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { VariantSelector } from './variant-selector';

export function ProductDescription({ product }: { product: BagistoProductInfo[] }) {
  if (!product.length) return notFound();
  const data = product[0];
  const configurableProductData = data?.configutableData?.attributes || [];
  const configurableProductIndexData = data?.configutableData?.index || [];
  const quantity = Number(data?.inventories?.[0]?.qty);
  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-5xl font-medium">{data?.name}</h1>
        <div className="mr-auto w-auto rounded-full bg-blue-600 p-2 text-sm text-white">
          <Price
            amount={data?.priceHtml?.finalPrice || data?.priceHtml?.regularPrice || '0'}
            currencyCode={data?.priceHtml?.currencyCode || ''}
          />
        </div>
      </div>
      <Suspense fallback={null}>
        <VariantSelector variants={configurableProductData} index={configurableProductIndexData} />
      </Suspense>
      {data?.description ? (
        <Prose
          className="mb-6 text-sm leading-tight dark:text-white/[60%]"
          html={data?.description}
        />
      ) : null}

      <Suspense fallback={null}>
        <AddToCart
          variants={configurableProductData || []}
          index={configurableProductIndexData}
          productId={data?.id || ''}
          availableForSale={quantity > 0 ? true : false}
        />
      </Suspense>
    </>
  );
}
