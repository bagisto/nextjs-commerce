"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import ShoppingCartIcon from "@components/common/icons/ShoppingCartIcon";
import { useAddProduct } from "@utils/hooks/useAddToCart";
import { useAppSelector } from "@/store/hooks";
import { useCustomToast } from "@/utils/hooks/useToast";
import { useRouter } from "next/navigation";

export default function ProductCardActions({
  productType,
  productId,
  productUrlKey,
  isSaleable,
  backUrl,
}: {
  productType: string;
  productId: string;
  productUrlKey: string;
  isSaleable?: string;
  backUrl?: string;
}) {
  const { isCartLoading, onAddToCart } = useAddProduct();
  const { user } = useAppSelector((state) => state.user);
  const { showToast } = useCustomToast();
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isSaleable || isSaleable === "") {
      showToast("This product is out of stock", "warning");
      return;
    }

    if (productType !== "simple") {
      const targetUrl = backUrl ? `/product/${productUrlKey}?backUrl=${encodeURIComponent(backUrl)}` : `/product/${productUrlKey}`;
      router.push(targetUrl);
      return;
    }

    onAddToCart({
      productId: productId.split("/").pop() || "",
      quantity: 1,
      token: user?.token ?? undefined,
      productType: productType || "simple",
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isCartLoading}
      className="flex items-center justify-center cursor-pointer transition-all duration-300 hover:opacity-70
                 bg-[#FFFFFFB2] backdrop-blur-[12.28px] border-[1.02px] border-white
                 rounded-[10233px] w-[80px] h-[40px] lg:w-[112px] lg:h-[56px]
                 shadow-lg lg:shadow-2xl"
      aria-label="Add to cart"
    >
      {isCartLoading ? (
        <Loader2 className="animate-spin size-5 lg:size-6 text-black" />
      ) : (
        <ShoppingCartIcon className="size-5 lg:size-6 -rotate-6 stroke-black stroke-[1.5]" />
      )}
    </button>
  );
}