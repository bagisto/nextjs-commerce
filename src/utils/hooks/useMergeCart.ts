
"use client";

import { useMutation } from "@tanstack/react-query";
import { useCustomToast } from "./useToast";
import { useAppDispatch } from "@/store/hooks";
import { fetchHandler } from "../fetch-handler";
import { addItem } from "@/store/slices/cart-slice";


interface MergeCartInput {
  token: string;
  cartId: number;
}

export function useMergeCart() {
  const { showToast } = useCustomToast();
  const dispatch = useAppDispatch();


  const {
    mutateAsync: mergeCartRequest,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: (input: MergeCartInput) =>
      fetchHandler({
        url: "cart/mergeCart",
        method: "POST",
        contentType: true,
        body: { ...input },
      }),

    onSuccess: (response) => {
      const responseData = response?.data?.createMergeCart?.mergeCart
      if (!responseData) {
        showToast("Cart merge failed!", "warning");
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

      dispatch(addItem(responseData));
    },

    onError: (err) => {
      showToast(err?.message || "Merge cart failed!", "danger");
    },
  });

  const mergeCart = async (token: string, cartId: number) => {
    await mergeCartRequest({ token, cartId });
  };

  return {
    mergeCart,
    isLoading,
    error,
  };
}
