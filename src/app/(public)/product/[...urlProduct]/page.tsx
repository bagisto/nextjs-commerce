import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductDetailSkeleton, RelatedProductSkeleton, } from "@/components/common/skeleton/ProductSkeleton";
import {
  BASE_SCHEMA_URL,
  baseUrl,
  getImageUrl,
  NOT_IMAGE,
  PRODUCT_TYPE,
} from "@/utils/constants";
import HeroCarousel from "@/components/common/slider/HeroCarousel";
import {
  GET_PRODUCT_BY_ID,
  graphqlRequest,
} from "@/graphql";
import { isArray } from "@/utils/type-guards";
import { ProductNode } from "@/components/catalog/type";
import { RelatedProductsSection } from "@components/catalog/product/RelatedProductsSection";
import ProductInfo from "@components/catalog/product/ProductInfo";
import { LRUCache } from "@/utils/LRUCache";
import { ProductVariant } from "@/types/category/type";

const productCache = new LRUCache<ProductNode>(100, 10);
export const dynamic = 'force-static';

export interface SingleProductResponse {
  product: ProductNode;
}

async function getSingleProduct(productIdentifier: string) {
  const cachedProduct = productCache.get(productIdentifier);
  if (cachedProduct) {
    return cachedProduct;
  }

  try {
    const dataById = await graphqlRequest<SingleProductResponse>(
      GET_PRODUCT_BY_ID,
      {
        id: productIdentifier,
      },
      {
        tags: ["products", `product-${productIdentifier}`],
        life: "hours",
      }
    );

    const product = dataById?.product || null;
    if (product) {
      productCache.set(productIdentifier, product);
    }
    return product;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching product:", {
        message: error.message,
        productIdentifier,
        graphQLErrors: (error as unknown as Record<string, unknown>)
          .graphQLErrors,
      });
    }
    return null;
  }
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


  const imageUrl = getImageUrl(product?.baseImageUrl, baseUrl, NOT_IMAGE);
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

  const VariantImages = isArray(product?.variants?.edges)
    ? product?.variants.edges.map((edge: { node : ProductVariant }) => edge.node)
    : [];

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
        type="application/ld+json"
      />
      <div className="flex flex-col gap-y-4 rounded-lg pb-0 pt-4 sm:gap-y-6 md:py-7.5 lg:flex-row w-full max-w-screen-2xl mx-auto px-[15px] xss:px-7.5 lg:gap-8">
        <div className="h-full w-full max-w-[885px]">
          <Suspense fallback={<ProductDetailSkeleton />}>
          {isArray(VariantImages) ? (
            <HeroCarousel
              images={
                VariantImages?.map(
                  (image: { baseImageUrl: string; name: unknown }) => ({
                    src: getImageUrl(image.baseImageUrl, baseUrl, NOT_IMAGE) || "",
                    altText: image?.name || "",
                  })
                ) || []
              }
            />
          ) : (
            <HeroCarousel
              images={[
                {
                  src: imageUrl || "",
                  altText: product?.name || "product image",
                },
              ]}
            />
          )}
          </Suspense>
        </div>
        <div className="basis-full lg:basis-4/6">
          <Suspense fallback={<ProductDetailSkeleton />}>
            <ProductInfo
              product={product}
              slug={fullPath}
              reviews={reviews}
              totalReview={reviews.length}
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



