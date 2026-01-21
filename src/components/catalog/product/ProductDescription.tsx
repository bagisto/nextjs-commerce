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
import { safeCurrencyCode, safePriceValue, safeParse } from "@utils/helper";
import Link from "next/link";

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
  const configurableProductIndexData = (safeParse(
    productSwatchReview?.combinations
  ) || []) as never[];
  const searchParams = useSearchParams();
  const [userInteracted, setUserInteracted] = useState(false);

  const superAttributes = productSwatchReview?.superAttributeOptions
    ? safeParse(productSwatchReview.superAttributeOptions)
    : productSwatchReview?.superAttributes?.edges?.map(
      (e: { node: any }) => e.node
    ) || [];

  const variantInfo = getVariantInfo(
    product?.type === "configurable",
    searchParams.toString(),
    superAttributes,
    productSwatchReview?.combinations
  );

  const additionalData =
    productSwatchReview?.attributeValues?.edges?.map(
      (e: { node: any }) => e.node
    ) || [];

  return (
    <>
      <div className="mb-6 flex flex-col border-b border-neutral-200 pb-6 dark:border-neutral-700">
        {/* Breadcrumb */}
        <div className="hidden lg:flex flex-col gap-3 shrink-0 mb-2">
          <Link
            href="/"
            className="w-fit text-sm font-medium text-nowrap relative text-neutral-500 before:absolute before:bottom-0 before:left-0 before:h-px before:w-0 before:bg-current before:transition-all before:duration-300 before:content-[''] hover:text-black hover:before:w-full dark:text-neutral-400 dark:hover:text-neutral-300"
          >
            Home /
          </Link>
        </div>
        <h1 className="font-outfit text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-semibold">
          {product?.name || ""}
        </h1>

        <div className="flex w-auto justify-between gap-y-2 py-4 xs:flex-row xs:gap-y-0 sm:py-6 flex-wrap">
          <div className="flex gap-4 items-center">
            {product?.type === "configurable" && (
              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400">
                As low as
              </p>
            )}
            {product?.type === "simple" ? (
              <>
                <Price
                  amount={String(product?.minimumPrice)}
                  currencyCode={currencyCode}
                  className="font-outfit text-xl sm:text-2xl font-semibold"
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

      <VariantSelector
        variants={variantInfo?.variantAttributes}
        setUserInteracted={setUserInteracted}
        possibleOptions={variantInfo.possibleOptions}
      />

      {product?.shortDescription ? (
        <Prose className="mb-6 text-base text-selected-black dark:text-white font-light" html={product.shortDescription} />
      ) : null}

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
