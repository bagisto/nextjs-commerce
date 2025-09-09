import type { RelatedProducts } from "@/lib/bagisto/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  ProductDetailSkeleton,
  RelatedProductSkeleton,
} from "@/components/product/place-order";
import { ProductDescription } from "@/components/product/product-description";
import { getAllProductUrls, getCollectionProducts } from "@/lib/bagisto";
import {
  BASE_SCHEMA_URL,
  NOT_IMAGE,
  PRODUCT_OFFER_TYPE,
  PRODUCT_TYPE,
} from "@/lib/constants";
import { isArray, isObject } from "@/lib/type-guards";
import { ProductCard } from "@/components/product-card";
import Grid from "@/components/grid";
import HeroCarousel from "@/components/product/slider/hero-carousel";
// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  const prooducts = await getAllProductUrls();

  return isObject(prooducts)
    ? prooducts.map((post) => ({
        handle: `${post.slug}?type=${post.type}`,
      }))
    : [];
}

// Multiple versions of this page will be statically generated
// using the `params` returned by `generateStaticParams`
export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const { type } = await searchParams;

  const product = await getCollectionProducts({
    collection: handle,
    type: type,
    page: "product",
  });

  if (!product) return notFound();
  const data = product[0];
  const { url, altText: alt } = data?.images?.[0] || {};

  const { width, height = "100", name, description } = data || {};
  const indexable = true;

  return {
    title: name,
    description: description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable,
      },
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt,
            },
          ],
        }
      : null,
  };
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ type: string }>;
}) {
  const { handle } = await params;
  const { type } = await searchParams;

  const product = await getCollectionProducts({
    collection: handle,
    type: type,
    page: "product",
  });

  if (!product[0]) return notFound();
  const data = product[0];
  const productJsonLd = {
    "@context": BASE_SCHEMA_URL,
    "@type": PRODUCT_TYPE,
    name: data?.name,
    description: data?.description,
    image: data?.images?.[0]?.url,
    offers: {
      "@type": PRODUCT_OFFER_TYPE,
      availability:
        data?.inventories?.[0]?.qty || 0 > 0
          ? `${BASE_SCHEMA_URL}/InStock`
          : `${BASE_SCHEMA_URL}/OutOfStock`,
      priceCurrency: data?.priceHtml.currencyCode,
      highPrice: data?.priceHtml?.regularPrice,
      lowPrice: data?.priceHtml?.regularPrice,
    },
  };

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
        type="application/ld+json"
      />
      <div className="flex flex-col gap-y-4 rounded-lg pb-0 pt-4 sm:gap-y-6 md:py-7.5 lg:flex-row lg:gap-8">
        <div className="h-full w-full max-w-[885px]">
          <Suspense fallback={<ProductDetailSkeleton />}>
            {isArray(data?.cacheGalleryImages) ? (
              <HeroCarousel
                images={
                  data?.cacheGalleryImages?.map((image) => ({
                    src: image?.originalImageUrl || "",
                    altText: image?.originalImageUrl || "",
                  })) || []
                }
              />
            ) : (
              <HeroCarousel
                images={[
                  {
                    src: NOT_IMAGE,
                    altText: "product image",
                  },
                ]}
              />
            )}
          </Suspense>
        </div>
        <div className="basis-full lg:basis-4/6">
          <ProductDescription product={product} slug={handle} />
        </div>
      </div>

      <Suspense fallback={<RelatedProductSkeleton />}>
        <RelatedProducts relatedProduct={data?.relatedProducts || []} />
      </Suspense>
    </>
  );
}

async function RelatedProducts({
  relatedProduct,
}: {
  relatedProduct: RelatedProducts[];
}) {
  if (!relatedProduct.length) return null;

  return (
    <div className="flex flex-col gap-y-10 py-8 sm:py-12 lg:py-20">
      <div className="flex flex-col gap-y-4 font-outfit">
        <h2 className="text-4xl font-semibold">Related Products</h2>
        <p className="dark:b-neutral-300 font-normal text-black/[60%] dark:text-neutral-300">
          Discover the latest trends! Fresh products just added—shop new styles,
          tech, and essentials before they&apos;re gone.
        </p>
      </div>
      <Grid className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {relatedProduct.map((item, index) => (
          <ProductCard
            key={index}
            currency={item?.priceHtml?.currencyCode}
            imageUrl={
              item?.cacheGalleryImages?.[0]?.originalImageUrl ??
              item?.images?.[0]?.url ??
              NOT_IMAGE
            }
            price={
              item?.priceHtml?.finalPrice ||
              item?.priceHtml?.regularPrice ||
              "0"
            }
            product={item}
          />
        ))}
      </Grid>
    </div>
  );
}
