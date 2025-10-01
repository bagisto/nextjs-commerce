"use client";

import clsx from "clsx";
import Link from "next/link";
import { useAddProduct } from "./hooks/use-add-to-cart";
import ShoppingCartIcon from "./icons/shopping-cart";
import LoadingDots from "./loading-dots";

export default function AddToCartButton({
  productType,
  urlKey,
  productId,
}: {
  productType?: string;
  urlKey?: string;
  productId: string;
}) {
  const { isCartLoading, onAddToCart } = useAddProduct();

  const handleAddToCart = () => {
    onAddToCart({
      input: {
        productId: productId,
        isBuyNow: false,
        selectedConfigurableOption: 0,
        quantity: 1,
      },
    });
  };

  const buttonClasses =
    " flex w-full cursor-pointer items-center  justify-center px-4 rounded-full min-h-8  tracking-wide ";
  const disabledClasses = "cursor-wait opacity-60 hover:opacity-60";

  return productType !== "simple" ? (
    <Link
      aria-disabled="true"
      aria-label="Link to product page"
      rel="prefetch"
      prefetch={true}
      className={clsx(buttonClasses, {
        "hover:opacity-90": true,
      })}
      href={`/product/${urlKey}?type=${productType}`}
      type="submit"
    >
      <ShoppingCartIcon className="size-6 -rotate-6 stroke-black stroke-[1.5]" />
    </Link>
  ) : (
    <button
      aria-disabled={isCartLoading}
      aria-label="Add to cart"
      className={clsx(buttonClasses, {
        "hover:opacity-90": true,
        [disabledClasses]: isCartLoading,
      })}
      type="button"
      onClick={handleAddToCart}
    >
      {isCartLoading ? (
        <LoadingDots className="bg-black" />
      ) : (
        <ShoppingCartIcon className="size-6 -rotate-6 stroke-black stroke-[1.5]" />
      )}
    </button>
  );
}
