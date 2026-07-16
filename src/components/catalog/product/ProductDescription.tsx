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
import { ProductData } from "../type";
import { ProductReviewEdge } from "@components/catalog/review/ReviewDetail";
import { AttributeData } from "@/types/types";
import { ProductSwatchReview, SuperAttributeOption, AttributeValueNode, BookingProduct } from "@/types/category/type";
import { VariantSuperAttribute } from "@utils/hooks/useVariantInfo";
import { safeCurrencyCode, safePriceValue, safeParse } from "@utils/helper";
import Breadcrumb from "@components/common/Breadcrumb";
import { CalendarIcon, MapPinIcon } from "@heroicons/react/24/outline";

export function ProductDescription({
  product,
  reviews,
  totalReview,
  productSwatchReview,
  avgRating
}: {
  product: ProductData;
  slug: string;
  reviews: ProductReviewEdge[];
  avgRating: number;
  totalReview: number;
  productSwatchReview: ProductSwatchReview | null;
}) {
  const priceValue = safePriceValue(product);
  const currencyCode = safeCurrencyCode(product);
  const configurableProductIndexData = (safeParse(
    productSwatchReview?.combinations
  ) || []) as never[];

  const searchParams = useSearchParams();
  const [userInteracted, setUserInteracted] = useState(false);

  const superAttributes: SuperAttributeOption[] = productSwatchReview?.superAttributeOptions
    ? safeParse<SuperAttributeOption[]>(productSwatchReview.superAttributeOptions) ?? []
    : productSwatchReview?.superAttributes?.edges?.map(
      (e: { node: SuperAttributeOption }) => e.node
    ) ?? [];

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const options: Record<string, string> = {};
    if (product?.type === "configurable" && Array.isArray(superAttributes)) {
      superAttributes.forEach((attr: SuperAttributeOption) => {
        const val = searchParams.get(attr.code);
        if (val) options[attr.code] = val;
      });
    }
    return options;
  });

  const handleSelectOption = (attributeCode: string, optionId: string) => {
    setSelectedOptions((prev) => {
      const next = { ...prev, [attributeCode]: optionId };
      
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        params.set(attributeCode, optionId);
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, "", newUrl);
      }
      
      return next;
    });
    setUserInteracted(true);
  };

  const searchParamsString = Object.entries(selectedOptions)
    .map(([key, val]) => `${key}=${val}`)
    .join("&");

  const variantInfo = getVariantInfo(
    product?.type === "configurable",
    searchParamsString,
    superAttributes as VariantSuperAttribute[],
    productSwatchReview?.combinations ?? ""
  );

  const additionalData =
    productSwatchReview?.attributeValues?.edges?.map(
      (e: { node: AttributeValueNode }) => e.node
    ) || [];
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const handleReviewClick = () => {
    const filterAdditionalData = additionalData.filter((item: AttributeValueNode) => item?.attribute?.isVisibleOnFront == "1");
    const key = filterAdditionalData.length > 0 ? "3" : "2";
    setExpandedKeys(new Set([key]));

    setTimeout(() => {
      const element = document.getElementById("ratings-section");
      if (element) {
        const headerOffset = 90;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }, 200);
  };

  const bookingProductNode = product.bookingProducts?.edges?.[0]?.node;

  return (
    <>
      <div className="mb-2 flex flex-col pb-6">
        <div className="hidden lg:flex flex-col gap-3 shrink-0 mb-4">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              ...(product?.categories?.edges?.[0]?.node?.translation
                ? [
                  {
                    label: product.categories.edges[0].node.translation.name,
                    href: `/search/${product.categories.edges[0].node.translation.slug}`,
                  },
                ]
                : []),
              { label: product?.name || "" },
            ]}
          />
        </div>
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-outfit text-3xl lg:text-4xl font-semibold leading-tight text-black dark:text-white">
            {product?.name || ""}
          </h1>
        </div>

        <div className="flex w-auto justify-between items-baseline gap-y-2 py-4 xs:flex-row xs:gap-y-0 sm:py-6 flex-wrap">
          <div className="flex gap-4 items-baseline">
            {product?.type === "configurable" && !product?.specialPrice && (
              <p className="text-base text-gray-600 dark:text-gray-400">
                As low as
              </p>
            )}

            {product?.specialPrice ? (
              <div className="flex items-center gap-3">
                <Price
                  amount={String(product.specialPrice)}
                  currencyCode={currencyCode}
                  className="font-outfit text-2xl md:text-3xl font-bold text-black dark:text-white"
                />
                <Price
                  amount={String(product.price)}
                  currencyCode={currencyCode}
                  className="font-outfit text-xl md:text-2xl font-medium text-selected-black dark:text-selected-white"
                  style={{ textDecoration: 'line-through', textDecorationColor: '#525252', textDecorationThickness: '2px' }}
                />
              </div>
            ) : product?.type === "simple" ? (
              <Price
                amount={String(product?.minimumPrice ?? priceValue)}
                currencyCode={currencyCode}
                className="font-outfit text-xl md:text-2xl font-semibold"
              />
            ) : (
              <Price
                amount={String(priceValue)}
                currencyCode={currencyCode}
                className="font-outfit text-xl md:text-2xl font-semibold"
              />
            )}
          </div>

          <Rating
            length={5}
            star={avgRating}
            reviewCount={totalReview}
            className="mt-2"
            onReviewClick={handleReviewClick}
          />
        </div>
      </div>

      {product?.shortDescription ? (
        <Prose className="mb-6 text-base text-selected-black dark:text-white font-normal" html={product.shortDescription} />
      ) : null}

      {product.type === 'booking' && product.bookingProducts?.edges?.[0]?.node?.type === 'event' && (
        <div className="flex flex-col gap-4 mt-2 mb-8">
          <h3 className="font-outfit font-normal text-15 leading-[20px] text-black dark:text-white">
            Event Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
            {product.bookingProducts?.edges[0].node.location && (
              <div className="flex items-start gap-2.5">
                <div className="mt-1">
                  <MapPinIcon className="h-5 w-5 text-black dark:text-white" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-outfit font-normal text-base leading-none text-black/60 dark:text-selected-white" style={{ fontWeight: "normal", fontSize: '16px' }}>Location</span>
                  <span className="font-outfit font-normal text-base leading-none text-black dark:text-white mt-2">{product.bookingProducts?.edges[0].node.location}</span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(product.bookingProducts?.edges[0].node.location ?? '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-outfit font-normal text-sm leading-none text-primary dark:text-primary-soft hover:underline mt-2.5"
                    style={{ fontSize: '14px', fontWeight: 'normal' }}
                  >
                    View on Map
                  </a>
                </div>
              </div>
            )}

            <div className="flex items-start gap-2.5">
              <div className="mt-1">
                <CalendarIcon className="h-5 w-5 text-black dark:text-white" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-outfit font-normal text-base leading-none text-black/60 dark:text-selected-white" style={{ fontWeight: "normal", fontSize: '16px' }}>Event on</span>
                <div className="font-outfit font-normal text-base leading-tight text-black dark:text-white mt-2">
                  {product.bookingProducts?.edges[0].node.availableEveryWeek ? (
                    <span>Available every week</span>
                  ) : (
                    <span>
                      {new Date(product.bookingProducts?.edges[0].node.availableFrom ?? '').toLocaleString('en-US', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })} - {new Date(product.bookingProducts?.edges[0].node.availableTo ?? '').toLocaleString('en-US', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {product.type === 'booking' && ['appointment', 'rental', 'table'].includes(product.bookingProducts?.edges?.[0]?.node?.type ?? '') && (() => {
        const node = bookingProductNode;
        if (!node) return null;
        const apptSlot = node.appointmentSlot;
        const tableSlot = node.tableSlot;

        if (node.type === 'rental' && !node.location) return null;

        const duration = node.type === 'appointment' ? apptSlot?.duration : node.type === 'table' ? tableSlot?.duration : null;

        return (
          <div className="flex flex-col gap-4 mt-2 mb-8">
            <h3 className="font-outfit font-normal text-15 leading-[20px] text-black dark:text-white">
              {node.type === 'table' ? 'Table Information' : 'Booking Information'}
            </h3>
            <div className="grid grid-cols-2 gap-8">
              {node.location && (
                <div className="flex items-start gap-2.5">
                  <div className="mt-1">
                    <MapPinIcon className="h-5 w-5 text-black dark:text-white" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-outfit font-normal text-base leading-none text-black/60 dark:text-selected-white" style={{ fontWeight: "normal", fontSize: '16px' }}>Location</span>
                    <span className="font-outfit font-normal text-base leading-none text-black dark:text-white mt-2">{node.location}</span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(node.location)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-outfit font-normal text-sm leading-none text-primary dark:text-primary-soft hover:underline mt-2.5"
                      style={{ fontSize: '14px', fontWeight: 'normal' }}
                    >
                      View on Map
                    </a>
                  </div>
                </div>
              )}

              {duration && (
                <div className="flex items-start gap-2.5">
                  <div className="mt-1">
                    <CalendarIcon className="h-5 w-5 text-black dark:text-white" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-outfit font-normal text-base leading-none text-black/60 dark:text-selected-white" style={{ fontWeight: "normal", fontSize: '16px' }}>Slot Duration</span>
                    <span className="font-outfit font-normal text-base leading-none text-black dark:text-white mt-2">{duration} minutes</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      <VariantSelector
        variants={variantInfo?.variantAttributes as unknown as AttributeData[]}
        selectedOptions={selectedOptions}
        onSelectOption={handleSelectOption}
      />

      <AddToCart
        index={configurableProductIndexData}
        productId={product?.id || ""}
        productSwatchReview={productSwatchReview}
        userInteracted={userInteracted}
        bookingProduct={bookingProductNode as unknown as BookingProduct}
        selectedOptions={selectedOptions}
      />


      <ProductMoreDetails
        additionalData={additionalData}
        description={product?.description ?? ""}
        reviews={Array.isArray(reviews) ? reviews : []}
        totalReview={totalReview}
        productId={product?.id ?? ""}
        expandedKeys={expandedKeys}
        setExpandedKeys={setExpandedKeys}
      />
    </>
  );
}
