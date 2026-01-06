"use client";

import ShoppingCartIcon from "@components/common/icons/ShoppingCartIcon";
import clsx from "clsx";
import Link from "next/link";
import { useAddProduct } from "@utils/hooks/useAddToCart";
import { useSession } from "next-auth/react";
import LoadingDots from "@components/common/icons/LoadingDots";

export default function AddToCartButton({
  productType,
  productId,
}: {
  productType?: string;
  productId: string;
}) {
  const { isCartLoading,
    onAddToCart
  } = useAddProduct();
  const { data: session } = useSession();

  const handleAddToCart = () => {

    onAddToCart({
      productId: productId.split("/").pop() || '',
      quantity: 1,
      token: session?.user?.token ?? undefined,
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
      href={`/product/${productId}`}
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
