"use client";

import { useMutation } from "@apollo/client/react";
import { useAppDispatch } from "@/store/hooks";
import { addItem, type Cart } from "@/store/slices/cart-slice";
import { CREATE_MERGE_CART } from "@/graphql";
import { CreateMergeCartData } from "@/types/cart/type";


export function useMergeCart() {
  const dispatch = useAppDispatch();

  const [mergeCart, { loading: isLoading }] = useMutation<CreateMergeCartData>(
    CREATE_MERGE_CART,
    {
      onCompleted: (response) => {
        const responseData = response?.createMergeCart?.mergeCart;
        if (!responseData) {
          return;
        }
       const cartId = responseData?.id ?? null;

      const setCookie = (name: string, value: string | number, days = 30) => {
        if (typeof window === "undefined" || !name) return;
        const d = new Date();
        d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
        const expires = "expires=" + d.toUTCString();
        document.cookie = `${name}=${encodeURIComponent(String(value))};${expires};path=/`;
      };

      if (cartId !== null && typeof cartId !== "undefined") {
        setCookie("guest_cart_id", String(cartId));
      }

      dispatch(addItem(responseData as unknown as Cart));
    },
    onError: (_error) => {
    },
  });

  return {
    mergeCart,
    isLoading,
  };
}
