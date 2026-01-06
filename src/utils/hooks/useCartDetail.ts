"use client";

import { useQuery } from "@tanstack/react-query";
import { useAppDispatch } from "@/store/hooks";
import { fetchHandler } from "../fetch-handler";
import { addItem } from "@/store/slices/cart-slice";
import { isObject } from "@utils/type-guards";
import { useEffect } from "react";
import { getCartToken } from "@utils/getCartToken";


export function useCartDetail() {
  const dispatch = useAppDispatch();
  const token = getCartToken();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["cart-detail", token],
    queryFn: () =>
      fetchHandler({
        url: "cart-detail",
        method: "POST",
        contentType: true,
        body: { token: token || "" },
      }),
    enabled: !!token,
  });

  useEffect(() => {
    const cartData = data?.data?.createReadCart?.readCart;

    if (isObject(cartData)) {
      dispatch(addItem(cartData as any));
    } else if (data && !isLoading) {
      console.error("Invalid cart data structure:", data);
    }
  }, [data, isLoading, dispatch]);

  return {
    getCartDetail: refetch,
    isLoading,
  };
}
