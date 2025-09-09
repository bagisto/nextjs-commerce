"use client";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchHandler } from "@/lib/fetch-handler";
import { isObject } from "@/lib/type-guards";
import { useAppDispatch } from "@/store/hooks";
import { addItem } from "@/store/slices/cart-slice";

export function useCartDetail() {
  const dispatch = useAppDispatch();

  // ✅ Fetch cart from API
  const { data, isLoading } = useQuery({
    queryKey: ["cart"],
    refetchOnWindowFocus: false,
    queryFn: async () =>
      fetchHandler({
        url: "cart-detail",
        method: "GET",
      }),
  });

  // ✅ Sync query result to Redux
  useEffect(() => {
    if (data?.cartDetail && isObject(data.cartDetail) && !isLoading) {
      dispatch(addItem(data.cartDetail));
    }
  }, [data, dispatch]); // Proper dependencies

  // Return comprehensive state
  return {
    isLoading,
  };
}
