"use client";

import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useSearchParams } from "next/navigation";
import { useForm, useWatch, SubmitHandler } from "react-hook-form";
import { ConfigurableProductIndexData } from "@/types/types";
import { useAddProduct } from "@utils/hooks/useAddToCart";
import LoadingDots from "@components/common/icons/LoadingDots";
import { getVariantInfo, VariantSuperAttribute } from "@utils/hooks/useVariantInfo";
import { safeParse } from "@utils/helper";
import { ProductSwatchReview, BookingProduct, BookingSelectionData, SuperAttributeOption, GroupedProductNode, BundleOptionNode } from "@/types/category/type";
import { useState, useCallback } from "react";
import dynamic from "next/dynamic";

const GroupedProductSelector = dynamic(
  () =>
    import("@components/catalog/product/GroupedProductSelector").then(
      (m) => m.GroupedProductSelector,
    ),
  { ssr: false },
);
const BundleProductSelector = dynamic(
  () =>
    import("@components/catalog/product/BundleProductSelector").then(
      (m) => m.BundleProductSelector,
    ),
  { ssr: false },
);
const DownloadableProductSelector = dynamic(
  () =>
    import("@components/catalog/product/DownloadableProductSelector").then(
      (m) => m.DownloadableProductSelector,
    ),
  { ssr: false },
);
const BookingProductSelector = dynamic(
  () =>
    import("@components/catalog/product/BookingProductSelector").then(
      (m) => m.BookingProductSelector,
    ),
  { ssr: false },
);

interface AddToCartFormData {
  quantity: number;
  isBuyNow: boolean;
  groupedProducts?: Record<string, number>;
  bundleOptions?: Record<string, string[]>;
  bundleOptionQty?: Record<string, number>;
  links?: number[];
  booking?: BookingSelectionData | null;
  bookingNote?: string;
};

function SubmitButton({
  selectedVariantId,
  pending,
  type,
  isSaleable,
  isGroupedValid,
  isBundleValid,
  isLinksValid,
  isBookingValid,
  submitted,
}: {
  selectedVariantId: boolean;
  pending: boolean;
  type: string;
  isSaleable: string;
  isGroupedValid?: boolean;
  isBundleValid?: boolean;
  isLinksValid?: boolean;
  isBookingValid?: boolean;
  submitted?: boolean;
}) {
  const buttonClasses = clsx(
    "relative flex w-full cursor-pointer h-[55px] items-center justify-center gap-4 rounded-full bg-primary px-6 sm:px-20 tracking-wide text-white transition-opacity hover:opacity-90 font-outfit text-base",
  );
  const disabledClasses = "cursor-wait opacity-60";

  if (!isSaleable || isSaleable === "") {
    return (
      <button
        aria-disabled
        aria-label="Out of stock"
        type="button"
        disabled
        className={clsx(buttonClasses, " opacity-60 !cursor-not-allowed")}
        style={{ height: '55px' }}
      >
        Out of Stock
      </button>
    );
  }

  if (!selectedVariantId && type === "configurable") {
    return (
      <button
        aria-disabled
        aria-label="Please select an option"
        type="button"
        disabled={!selectedVariantId}
        className={clsx(buttonClasses, " opacity-60 !cursor-not-allowed")}
        style={{ height: '55px' }}
      >
        Add To Cart
      </button>
    );
  }

  const isFormValid = (type === "grouped" ? isGroupedValid : true) &&
    (type === "bundle" ? isBundleValid : true) &&
    (type === "downloadable" ? isLinksValid : true) &&
    (type === "booking" ? isBookingValid : true);

  return (
    <button
      aria-disabled={pending}
      aria-label="Add to cart"
      type="submit"
      className={clsx(buttonClasses, {
        "hover:opacity-90": isFormValid,
        [disabledClasses]: pending,
        "opacity-60 !cursor-not-allowed": submitted && !isFormValid
      })}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        if (pending) e.preventDefault();
      }}
      style={{ height: '55px' }}
    >
      <div className="absolute left-0 ml-4">
        {pending ? <LoadingDots className="mb-3 bg-white" /> : ""}
      </div>
      Add To Cart
    </button>
  );
}

export function AddToCart({
  productSwatchReview,
  index,
  productId,
  userInteracted,
  bookingProduct,
  selectedOptions,
}: {
  productSwatchReview: ProductSwatchReview | null;
  productId: string;
  index: ConfigurableProductIndexData[];
  userInteracted: boolean;
  bookingProduct?: BookingProduct;
  selectedOptions?: Record<string, string>;
}) {
  const isSaleable = productSwatchReview?.isSaleable || (bookingProduct ? "1" : "");
  const { onAddToCart, isCartLoading } = useAddProduct();
  const [submitted, setSubmitted] = useState(false);

  const initialGroupedProducts: Record<string, number> = {};
  if (productSwatchReview?.type === "grouped" && productSwatchReview?.groupedProducts?.edges) {
    productSwatchReview.groupedProducts.edges.forEach(({ node }: { node: GroupedProductNode }) => {
      const id = node.associatedProduct.id.split("/").pop() as string;
      initialGroupedProducts[id] = node.qty || 1;
    });
  }

  const { handleSubmit, setValue, control, register } = useForm<AddToCartFormData>({
    defaultValues: {
      quantity: 1,
      isBuyNow: false,
      groupedProducts: initialGroupedProducts,
      bundleOptions: {},
      bundleOptionQty: {},
      links: [],
      booking: null,
      bookingNote: "",
    },
  });

  const quantity = useWatch({
    control,
    name: "quantity",
  });

  const groupedProductsValues = useWatch({
    control,
    name: "groupedProducts",
  });

  const increment = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setValue("quantity", Math.min(100, Number(quantity) + 1));
  };

  const decrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setValue("quantity", Math.max(1, Number(quantity) - 1));
  };

  const handleGroupedQuantityChange = (id: string, qty: number) => {
    setValue(`groupedProducts.${id}`, qty);
  };

  const handleBundleSelectionChange = useCallback((bundleOptions: Record<string, string[]>, bundleOptionQty: Record<string, number>) => {
    setValue("bundleOptions", bundleOptions);
    setValue("bundleOptionQty", bundleOptionQty);
  }, [setValue]);

  const handleDownloadableLinksChange = useCallback((links: string[]) => {
    setValue("links", links.map(id => parseInt(id)));
  }, [setValue]);

  const handleBookingSelectionChange = useCallback((bookingData: BookingSelectionData | null) => {
    setValue("booking", bookingData);
  }, [setValue]);

  const searchParams = useSearchParams();
  const type = productSwatchReview?.type || (bookingProduct ? "booking" : "");

  const superAttributes: SuperAttributeOption[] = productSwatchReview?.superAttributeOptions
    ? safeParse<SuperAttributeOption[]>(productSwatchReview.superAttributeOptions) ?? []
    : productSwatchReview?.superAttributes?.edges?.map(
      (e) => e.node,
    ) ?? [];

  const isConfigurable = superAttributes.length > 0;

  const searchParamsString = selectedOptions
    ? Object.entries(selectedOptions).map(([key, val]) => `${key}=${val}`).join("&")
    : searchParams.toString();

  const { productid: selectedVariantId, Instock: checkStock } = getVariantInfo(
    isConfigurable,
    searchParamsString,
    superAttributes as VariantSuperAttribute[],
    JSON.stringify(index),
  );
  const buttonStatus = !!selectedVariantId;

  const isGroupedValid = type === "grouped"
    ? Object.values(groupedProductsValues || {}).some(qty => Number(qty) > 0)
    : true;

  const bundleOptionsValues = useWatch({
    control,
    name: "bundleOptions",
  });

  const isBundleValid = type === "bundle"
    ? productSwatchReview?.bundleOptions?.edges?.every(({ node: option }: { node: BundleOptionNode }) => {
      if (!option.isRequired) return true;
      const optionId = option.id.split("/").pop() as string;
      const selected = bundleOptionsValues?.[optionId];
      return selected && selected.length > 0;
    })
    : true;

  const linksValue = useWatch({
    control,
    name: "links",
  });

  const isLinksValid = type === "downloadable"
    ? !!(linksValue && linksValue.length > 0)
    : true;

  const bookingValue = useWatch({
    control,
    name: "booking",
  });

  const bookingNode = bookingProduct || productSwatchReview?.bookingProducts?.edges?.[0]?.node;
  const bookingSubType = bookingNode?.type;

  const bookingValueData = bookingValue as {
    date?: string;
    slot?: string;
    renting_type?: string;
    date_from?: string;
    date_to?: string;
    qty?: Record<string, number>;
  } | null | undefined;

  const isBookingValid = type === "booking"
    ? (bookingSubType === "appointment" || bookingSubType === "table" || bookingSubType === "default")
      ? !!(bookingValueData && bookingValueData.date && bookingValueData.slot)
      : bookingSubType === "rental"
        ? bookingValueData?.renting_type === "daily"
          ? !!(bookingValueData?.date_from && bookingValueData?.date_to)
          : !!(bookingValueData?.date && bookingValueData?.slot)
        : !!(bookingValueData && Object.values(bookingValueData?.qty || {}).some((qty: number) => Number(qty) > 0))
    : true;

  const actionWithVariant: SubmitHandler<AddToCartFormData> = async (data) => {
    setSubmitted(true);

    if (type === "downloadable" && (!data.links || data.links.length === 0)) {
      return;
    }

    if (type === "booking" && !isBookingValid) {
      return;
    }

    if (type === "bundle" && !isBundleValid) {
      return;
    }

    if (type === "grouped" && !isGroupedValid) {
      return;
    }

    const pid =
      type === "configurable"
        ? String(selectedVariantId)
        : (String(productId).split("/").pop() ?? "");

    const formattedGroupedQty = type === "grouped" && data.groupedProducts
      ? JSON.stringify(data.groupedProducts)
      : undefined;

    const formattedBundleOptions = type === "bundle" && data.bundleOptions
      ? JSON.stringify(data.bundleOptions)
      : undefined;

    const formattedBundleOptionQty = type === "bundle" && data.bundleOptionQty
      ? JSON.stringify(data.bundleOptionQty)
      : undefined;

    onAddToCart({
      productId: pid,
      quantity: data.quantity,
      groupedQty: formattedGroupedQty,
      bundleOptions: formattedBundleOptions,
      bundleOptionQty: formattedBundleOptionQty,
      links: data.links,
      booking: data.booking ?? undefined,
      bookingNote: data.bookingNote,
      productType: type || "",
    });
  };

  return (
    <>
      {!checkStock && type === "configurable" && userInteracted && (
        <div className="gap-1 px-2 py-1 my-2 font-bold text-red-500 dark:text-red-400">
          <h1>NO STOCK AVAILABLE</h1>
        </div>
      )}

      {type === "grouped" && (
        <GroupedProductSelector
          groupedProducts={productSwatchReview?.groupedProducts}
          quantities={groupedProductsValues || {}}
          onQuantityChange={handleGroupedQuantityChange}
        />
      )}

      {type === "bundle" && (
        <BundleProductSelector
          key={productId}
          bundleOptions={productSwatchReview?.bundleOptions}
          basePrice={parseFloat(String(productSwatchReview?.price)) || 0}
          currencyCode={productSwatchReview?.priceHtml?.currencyCode || "USD"}
          onSelectionChange={handleBundleSelectionChange}
        />
      )}

      {type === "downloadable" && (
        <div className="flex flex-col gap-1">
          <DownloadableProductSelector
            downloadableLinks={productSwatchReview?.downloadableLinks}
            downloadableSamples={productSwatchReview?.downloadableSamples}
            onSelectionChange={handleDownloadableLinksChange}
          />
          {submitted && !isLinksValid && (
            <p className="text-red-500 text-13 italic mb-4">
              The Links field is required
            </p>
          )}
        </div>
      )}

      {type === "booking" && (
        <div className="flex flex-col gap-1">
          <BookingProductSelector
            bookingProduct={bookingNode as BookingProduct}
            onSelectionChange={handleBookingSelectionChange}
            currencyCode={productSwatchReview?.priceHtml?.currencyCode}
          />

          {bookingSubType === 'table' && (
            <div className="flex flex-col gap-3 mt-4 mb-6 w-full max-w-[605px]">
              <h3 className="font-outfit font-normal text-15 leading-[20px] text-black dark:text-white">
                Special Request/Notes
              </h3>
              <div className="relative group w-full" style={{ height: '48px' }}>
                <input
                  type="text"
                  {...register("bookingNote")}
                  placeholder="Special Request/Notes"
                  style={{
                    width: '100%',
                    height: '48px',
                    borderRadius: '6px',
                    borderWidth: '1px',
                    borderColor: 'var(--color-overlay-strong)',
                    borderStyle: 'solid',
                    paddingTop: '12px',
                    paddingRight: '16px',
                    paddingBottom: '12px',
                    paddingLeft: '16px',
                  }}
                  className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary transition-all outline-none font-outfit font-normal text-base appearance-none"
                />
              </div>
            </div>
          )}

          {submitted && !isBookingValid && (
            <p className="text-red-500 text-13 italic mb-4">
              {bookingSubType === "appointment" || bookingSubType === "table" || bookingSubType === "rental"
                ? "Please select required dates and slots"
                : "At least one ticket must be selected"}
            </p>
          )}
        </div>
      )}

      <form
        className={clsx("flex items-center gap-4 flex-wrap sm:flex-nowrap", type === "grouped" ? "flex-col items-start" : "flex-row")}
        onSubmit={handleSubmit(actionWithVariant)}
      >
        {type !== "grouped" && bookingSubType !== 'event' && (
          <div className="flex items-center shrink-0">
            <div
              className="flex items-center justify-between rounded-full border-2 border-primary dark:border-primary-soft bg-gray-50/50 dark:bg-zinc-900/50"
              style={{
                width: '145px',
                height: '55px',
                paddingLeft: '26px',
                paddingRight: '26px',
                gap: '12px'
              }}
            >
              <button
                type="button"
                aria-label="Decrease quantity"
                className="flex items-center justify-center text-black dark:text-white cursor-pointer hover:opacity-70 dark:hover:text-primary-soft dark:hover:opacity-100 transition-all shrink-0"
                onClick={decrement}
              >
                <MinusIcon className="h-4 w-4 stroke-[2.5]" />
              </button>

              <input
                type="number"
                min={1}
                inputMode="numeric"
                aria-label="Quantity"
                {...register("quantity", {
                  valueAsNumber: true,
                  min: 1,
                  max: 100,
                  onChange: (e) => {
                    const value = Math.min(100, Math.max(1, Math.floor(Number(e.target.value) || 1)));
                    setValue("quantity", value);
                  },
                })}
                className="flex-1 w-full min-w-0 bg-transparent text-center outline-none appearance-none font-outfit font-normal text-base text-black dark:text-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
              />

              <button
                type="button"
                aria-label="Increase quantity"
                className="flex items-center justify-center text-black dark:text-white cursor-pointer hover:opacity-70 dark:hover:text-primary-soft dark:hover:opacity-100 transition-all shrink-0"
                onClick={increment}
              >
                <PlusIcon className="h-4 w-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        )}
        <div className={clsx("w-full sm:w-[255px]", type === "grouped" ? "justify-start" : "")}>
          <div style={{ width: "100%", height: '55px' }}>
            <SubmitButton
              pending={isCartLoading}
              selectedVariantId={buttonStatus}
              type={type || ""}
              isSaleable={isSaleable}
              isGroupedValid={isGroupedValid}
              isBundleValid={isBundleValid}
              isLinksValid={isLinksValid}
              isBookingValid={isBookingValid}
              submitted={submitted}
            />
          </div>
        </div>
      </form>
    </>
  );
}
