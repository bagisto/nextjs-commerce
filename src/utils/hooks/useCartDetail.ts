"use client";

import { useMutation } from "@apollo/client/react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addItem, type Cart } from "@/store/slices/cart-slice";
import { useCallback, useEffect, useState, useRef } from "react";
import { GET_CART_ITEM } from "@/graphql";
import { getCartToken } from "@/utils/getCartToken";
import { getCartGeneration } from "@/utils/cart-sync";
import { GetCartItemData } from "@/types/cart/type";



export function useCartDetail() {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cartDetail.cart);
  const [isInFlight, setIsInFlight] = useState(false);
  const isInFlightRef = useRef(false);
  const requestedGenRef = useRef(0);

  const [getCartDetailMutation, { data, loading: isLoading, error }] =
    useMutation<GetCartItemData>(GET_CART_ITEM, {
      onCompleted: (response) => {
        const cartData = response?.createReadCart?.readCart;
        if (cartData) {
          if (getCartGeneration() === requestedGenRef.current) {
            dispatch(addItem(cartData as unknown as Cart));
          }
        }
      },
      onError: (error) => {
        console.error("Cart detail error:", error);
      },
    });

  const getCartDetail = useCallback(async () => {
    const token = getCartToken();
    if (!token) {
      return;
    }

    if (isInFlightRef.current) return;

    isInFlightRef.current = true;
    setIsInFlight(true);
    requestedGenRef.current = getCartGeneration();
    try {
      await getCartDetailMutation();
    } catch (e) {
      throw e;
    } finally {
      isInFlightRef.current = false;
      setIsInFlight(false);
    }
  }, [getCartDetailMutation]);

  useEffect(() => {
    if (!cart && !isInFlightRef.current) {
      getCartDetail();
    }
  }, [cart, getCartDetail]);

  return {
    cartData: cart || data?.createReadCart?.readCart,
    getCartDetail,
    isLoading: isLoading || (isInFlight && !cart),
    error,
  };
}
