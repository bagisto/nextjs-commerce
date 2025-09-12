import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductMoreDetails } from "./producr-more-detail";
import { VariantSelector } from "./variant-selector";
import Rating from ".";
import { AddToCart } from "@/components/cart/add-to-cart";
import Price from "@/components/price";
import Prose from "@/components/prose";
import { getCollectionReviewProducts } from "@/lib/bagisto";
import { BagistoProductInfo } from "@/lib/bagisto/types";

export async function ProductDescription({
  product,
  slug,
}: {
  product: BagistoProductInfo[];
  slug: string;
}) {
  if (!product.length) return notFound();
  const data = product[0];
  const configurableProductData = data?.configutableData?.attributes || [];
  const configurableProductIndexData = data?.configutableData?.index || [];
  const moreDetails = await getCollectionReviewProducts({
    collection: slug,
    page: "product",
  });

  return (
    <>
      <div className="mb-6 flex flex-col border-b border-neutral-200 pb-6 dark:border-neutral-700">
        <h1 className="font-outfit text-4xl font-semibold">{data?.name}</h1>
        <div className="flex w-auto flex-col justify-between gap-y-2 py-4 xs:flex-row xs:gap-y-0 sm:py-6">
          <Price
            amount={
              data?.priceHtml?.finalPrice ||
              data?.priceHtml?.regularPrice ||
              "0"
            }
            className="font-outfit text-2xl font-semibold"
            currencyCode={data?.priceHtml?.currencyCode || ""}
          />
          <Rating
            length={5}
            reviewCount={moreDetails?.averageRating}
            star={moreDetails?.averageRating}
            totalReview={moreDetails?.reviews?.length}
          />
        </div>
      </div>
      <Suspense fallback={<p>Loading...</p>}>
        <VariantSelector
          index={configurableProductIndexData}
          variants={configurableProductData}
        />
      </Suspense>
      {data?.shortDescription ? (
        <Prose
          className="mb-6 text-base text-black/60 dark:text-white/60"
          html={data?.shortDescription}
        />
      ) : null}
      <Suspense fallback={<p>Loading...</p>}>
        <AddToCart
          availableForSale={data?.status || false}
          index={configurableProductIndexData}
          productId={data?.id || ""}
          variants={configurableProductData || []}
        />
      </Suspense>
      <Suspense fallback={<p>Loading...</p>}>
        <ProductMoreDetails
          additionalData={moreDetails?.additionalData || []}
          description={moreDetails?.description || ""}
          reviews={moreDetails?.reviews || []}
          totalReview={moreDetails?.reviews?.length}
        />
      </Suspense>
    </>
  );
}
