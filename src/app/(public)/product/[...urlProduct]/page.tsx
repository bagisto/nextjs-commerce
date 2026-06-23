import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import {
  ProductDetailSkeleton,
  RelatedProductSkeleton,
} from "@/components/common/skeleton/ProductSkeleton";
import {
  BASE_SCHEMA_URL,
  baseUrl,
  getImageUrl,
  NOT_IMAGE,
  PRODUCT_TYPE,
} from "@/utils/constants";
import HeroCarousel from "@/components/common/slider/HeroCarousel";
import {
  GET_PRODUCT_BY_URL_KEY,
  GET_APPOINTMENT_BOOKING_DETAILS,
  GET_TABLE_BOOKING_DETAILS,
  GET_EVENT_BOOKING_DETAILS,
  GET_RENTAL_BOOKING_DETAILS,
  GET_DEFAULT_BOOKING_DETAILS
} from "@/graphql";
import { isArray } from "@/utils/type-guards";
import { cachedProductRequest } from "@/utils/hooks/useCache";
import {
  ProductNode,
  ProductVariantNode,
  ProductData,
  SingleProductResponse,
} from "@/components/catalog/type";
import { RelatedProductsSection } from "@components/catalog/product/RelatedProductsSection";
import ProductInfo from "@components/catalog/product/ProductInfo";
import { LRUCache } from "@/utils/LRUCache";
import ProductHeaderClient from "@components/catalog/product/ProductHeaderClient";
import {
  HeroCarouselShimmer,
  HeroCarouselThumbnailShimmer,
} from "@components/common/slider";
import { WishlistToggle } from "@/components/catalog/product/WishlistToggle";
import { CompareToggle } from "@/components/catalog/product/CompareToggle";
import { getProductMetadata } from "@/utils/helper";

const productCache = new LRUCache<ProductNode>(100, 10);
export const dynamic = "force-static";


async function getSingleProduct(urlKey: string) {
  const cachedProduct = productCache.get(urlKey);
  if (cachedProduct) {
    return cachedProduct;
  }

  try {
    const dataById = await cachedProductRequest<SingleProductResponse>(
      urlKey,
      GET_PRODUCT_BY_URL_KEY,
      { urlKey: urlKey },
    );

    let product = dataById?.product || null;


    if (product?.type === 'booking') {
      const bookingType = (product as any).bookingProducts?.edges?.[0]?.node?.type;
      let bookingQuery;

      switch (bookingType) {
        case 'appointment': bookingQuery = GET_APPOINTMENT_BOOKING_DETAILS; break;
        case 'table': bookingQuery = GET_TABLE_BOOKING_DETAILS; break;
        case 'event': bookingQuery = GET_EVENT_BOOKING_DETAILS; break;
        case 'rental': bookingQuery = GET_RENTAL_BOOKING_DETAILS; break;
        case 'default': bookingQuery = GET_DEFAULT_BOOKING_DETAILS; break;
      }

      if (bookingQuery) {
        const bookingData = await cachedProductRequest<SingleProductResponse>(
          `${urlKey}-${bookingType}`,
          bookingQuery,
          { urlKey }
        );

        if (bookingData?.product?.bookingProducts) {
          product = {
            ...product,
            bookingProducts: bookingData.product.bookingProducts,
          } as ProductNode;
        }
      }
    }

    if (product) {
      productCache.set(urlKey, product);
    }
    return product;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching product:", {
        message: error.message,
        urlKey,
        graphQLErrors: (error as unknown as Record<string, unknown>)
          .graphQLErrors,
      });
    }
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ urlProduct: string[] }>;
}): Promise<Metadata> {
  const { urlProduct } = await params;
  const fullPath = urlProduct.join("/");
  const product = await getSingleProduct(fullPath);
  const image = getImageUrl(product?.baseImageUrl, baseUrl, NOT_IMAGE) || undefined;
  return getProductMetadata(product, image);
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ urlProduct: string[] }>;
  searchParams: Promise<{ type: string }>;
}) {
  const { urlProduct } = await params;
  const fullPath = urlProduct.join("/");
  const product = await getSingleProduct(fullPath);
  if (!product) return notFound();














  const productJsonLd = {
    "@context": BASE_SCHEMA_URL,
    "@type": PRODUCT_TYPE,
    name: product?.name,
    description: product?.description,
    sku: product?.sku,
  };

  const reviews = Array.isArray(product?.reviews?.edges)
    ? product?.reviews.edges.map((e) => e.node)
    : [];

  const productImages = (product?.images?.edges || []).map((edge) => ({
    src: getImageUrl(edge.node.publicPath, baseUrl, NOT_IMAGE) || "",
    altText: product?.name || "product image",
  }));

  const VariantImages = isArray(product?.variants?.edges)
    ? product?.variants.edges
      .filter((edge: { node: ProductVariantNode }) => edge.node.baseImageUrl)
      .map(
        (edge: { node: ProductVariantNode }) => ({
          src: getImageUrl(edge.node.baseImageUrl, baseUrl, NOT_IMAGE) || "",
          altText: edge.node.name || product?.name || "variant image",
        }),
      )
    : [];

  const displayImages = VariantImages.length > 0
    ? VariantImages
    : productImages.length > 0
      ? productImages
      : [
        {
          src: getImageUrl(product?.baseImageUrl, baseUrl, NOT_IMAGE) || "",
          altText: product?.name || "product image",
        },
      ];

  return (
    <>
      <ProductHeaderClient />
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
        type="application/ld+json"
      />
      <div className="flex flex-col gap-y-4 rounded-lg pb-0 pt-4 sm:gap-y-6 md:py-7.5 lg:flex-row w-full max-w-screen-2xl mx-auto px-4 xss:px-7.5 lg:gap-8">
        <div className="relative h-full w-full max-w-[885px] max-1366:max-w-[650px] max-lg:max-w-full overflow-hidden rounded-2xl">
          <Suspense
            fallback={
              <>
                <HeroCarouselShimmer />
                <HeroCarouselThumbnailShimmer count={displayImages.length || 3} />
              </>
            }
          >
            <HeroCarousel images={displayImages} />
          </Suspense>
          <div className="absolute top-3 right-3 sm:top-6 sm:right-6 z-[5] flex flex-col gap-3 sm:gap-5">
            <WishlistToggle productId={product.id} />
            <CompareToggle productId={product.id} />
          </div>
        </div>
        <div className="basis-full lg:basis-4/6">
          <Suspense fallback={<ProductDetailSkeleton />}>
            <ProductInfo
              product={product as ProductData}
              slug={fullPath}
              reviews={reviews as any}
            />
          </Suspense>
        </div>
      </div>
      <Suspense fallback={<RelatedProductSkeleton />}>
        <RelatedProductsSection fullPath={fullPath} />
      </Suspense>
    </>
  );
}
