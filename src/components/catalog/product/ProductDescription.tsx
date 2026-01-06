"use client";
import { Price } from "@/components/theme/ui/Price";
import { Rating } from "@/components/common/Rating";
import { AddToCart } from "@/components/cart/AddToCart";
import { VariantSelector } from "./VariantSelector";
import { ProductMoreDetails } from "./ProductMoreDetail";
import { useState } from "react";
import { getVariantInfo } from "@utils/hooks/useVariantInfo";
import { useSearchParams } from "next/navigation";
import Prose from "@components/theme/search/Prose";
import { ProductData, ProductReviewNode } from "../type";
import { safeCurrencyCode, safePriceValue } from "@utils/helper";

export function ProductDescription({
  product,
  reviews,
  totalReview,
  productSwatchReview,
}: {
  product: ProductData;
  slug: string;
  reviews: ProductReviewNode[];
  totalReview: number;
  productSwatchReview: any;
}) {
  const priceValue = safePriceValue(product);
  const currencyCode = safeCurrencyCode(product);
  const configurableProductIndexData = (JSON.parse(
    productSwatchReview?.index
  ) || []) as never[];
  const searchParams = useSearchParams();
  const [userInteracted, setUserInteracted] = useState(false);

  const variantInfo = getVariantInfo(
    product?.type === "configurable",
    searchParams.toString(),
    productSwatchReview?.superAttributes?.edges?.map(
      (e: { node: any }) => e.node
    ) || [],
    productSwatchReview?.index
  );

  const additionalData =
    productSwatchReview?.attributeValues?.edges?.map(
      (e: { node: any }) => e.node
    ) || [];

  return (
    <>
      <div className="mb-6 flex flex-col border-b border-neutral-200 pb-6 dark:border-neutral-700">
        <h1 className="font-outfit text-xl sm:text-3xl md:text-3xl lg:text-4xl font-semibold">
          {product?.name || ""}
        </h1>

        <div className="flex w-auto justify-between gap-y-2 py-4 xs:flex-row xs:gap-y-0 sm:py-6">
          <div className="flex gap-4 items-center">
            {product?.type === "configurable" && (
              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400">
                As low as
              </p>
            )}
            {product?.type === "simple" ? (
              <>
                {/* <Price
                  amount={String(priceValue)}
                  currencyCode={currencyCode}
                  className="font-outfit text-lg sm:text-xl md:text-2xl font-semibold text-gray-500"
                  style={{ textDecoration: "line-through" }}
                /> */}
                <Price
                  amount={String(product?.minimumPrice)}
                  currencyCode={currencyCode}
                  className="font-outfit text-xl sm:text-2xl md:text-3xl font-semibold"
                />
              </>
            ) : (
              <Price
                amount={String(priceValue)}
                currencyCode={currencyCode}
                className="font-outfit text-xl sm:text-2xl md:text-3xl font-semibold"
              />
            )}
          </div>

          <Rating
            length={5}
            star={reviews[0]?.rating ?? 0}
            reviewCount={totalReview}
            className="mt-2"
          />
        </div>
      </div>
      {product?.shortDescription ? (
        <Prose className="mb-6 text-base" html={product.shortDescription} />
      ) : null}

      <VariantSelector
        variants={variantInfo?.variantAttributes}
        setUserInteracted={setUserInteracted}
        possibleOptions={variantInfo.possibleOptions}
      />
      <AddToCart
        index={configurableProductIndexData}
        productId={product?.id || ""}
        productSwatchReview={productSwatchReview}
        userInteracted={userInteracted}
      />

      <ProductMoreDetails
        additionalData={additionalData}
        description={product?.description ?? ""}
        reviews={Array.isArray(reviews) ? reviews : []}
        totalReview={totalReview}
        productId={product?.id ?? ""}
      />
    </>
  );
}
