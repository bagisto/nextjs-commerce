"use client";

import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { ConfigurableProductIndexData } from "@/types/types";
import { useAddProduct } from "@utils/hooks/useAddToCart";
import LoadingDots from "@components/common/icons/LoadingDots";
import { getVariantInfo } from "@utils/hooks/useVariantInfo";

function SubmitButton({
  selectedVariantId,
  pending,
  type
}: {
  selectedVariantId: boolean;
  pending: boolean;
  type: string
}) {
  const buttonClasses =
    "relative flex w-full max-w-[16rem] cursor-pointer h-fit items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white";
  const disabledClasses = "cursor-wait opacity-60";
  if (!selectedVariantId && ((type === "configurable"))) {
    return (
      <button
        aria-disabled
        aria-label="Please select an option"
        type="button"
        disabled={!selectedVariantId}
        className={clsx(buttonClasses, " opacity-60 !cursor-not-allowed")}
      >
        Add To Cart
      </button>
    );
  }

  return (
    <button
      aria-disabled={pending}
      aria-label="Add to cart"
      type="submit"
      className={clsx(buttonClasses, {
        "hover:opacity-90": true,
        [disabledClasses]: pending,
      })}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        if (pending) e.preventDefault();
      }}
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
}: {
  productSwatchReview: any;
  productId: string;
  index: ConfigurableProductIndexData[];
  userInteracted: boolean;
}) {
  const { onAddToCart, isCartLoading } = useAddProduct();
  const { handleSubmit, setValue, watch, register } = useForm({
    defaultValues: {
      quantity: 1,
      isBuyNow: false,
    },
  });

  const quantity = watch("quantity");

  const increment = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setValue("quantity", Number(quantity) + 1);
  };

  const decrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setValue("quantity", Math.max(1, Number(quantity) - 1));
  };

  const searchParams = useSearchParams();
  const type = productSwatchReview?.type

  const superAttributes =
    productSwatchReview?.superAttributes?.edges?.map((e: { node: any }) => e.node) || [];

  const isConfigurable = superAttributes.length > 0;

  const { productid: selectedVariantId, Instock: checkStock } = getVariantInfo(
    isConfigurable,
    searchParams.toString(),
    superAttributes,
    JSON.stringify(index)
  );
  const buttonStatus = !!selectedVariantId;

  const actionWithVariant = async (data: any) => {
    const pid = type === "configurable" ? String(selectedVariantId) : String(productId).split("/").pop() ?? "";
    onAddToCart({
      productId: pid,
      quantity: data.quantity,
    });
  };

  return (
    <>
      {!checkStock && type === "configurable" && userInteracted && (
        <div className="gap-1 px-2 py-1 my-2 font-bold">
          <h1>NO STOCK AVAILABLE</h1>
        </div>
      )}
      <form className="flex gap-x-4" onSubmit={handleSubmit(actionWithVariant)}>
        <div className="flex items-center justify-center">
          <div className="flex items-center rounded-full border-2 border-blue-500">
            <div
              aria-label="Decrease quantity"
              role="button"
              className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-l-full text-gray-600 transition-colors hover:text-gray-800 dark:text-white hover:dark:text-white/[80%]"
              onClick={decrement}
            >
              <MinusIcon className="h-4 w-4" />
            </div>

            <input
              type="hidden"
              {...register("quantity", { valueAsNumber: true })}
            />

            <div className="flex h-12 min-w-[3rem] items-center justify-center px-4 font-medium text-gray-800 dark:text-white">
              {quantity}
            </div>

            <div
              aria-label="Increase quantity"
              role="button"
              className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-r-full text-gray-600 transition-colors hover:text-gray-800 dark:text-white hover:dark:text-white/[80%]"
              onClick={increment}
            >
              <PlusIcon className="h-4 w-4" />
            </div>
          </div>
        </div>
        <SubmitButton
          pending={isCartLoading}
          selectedVariantId={buttonStatus}
          type={type || ""}
        />
      </form>
    </>
  );
}
