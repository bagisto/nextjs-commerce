"use client";

import { useEffect, useState, useRef } from "react";
import { fetchHandler } from "../fetch-handler";
import { GUEST_CART_ID, GUEST_CART_TOKEN, IS_GUEST } from "@/utils/constants";
import { encodeJWT, decodeJWT } from "@/utils/jwt-cookie";
import { setCookie, deleteCookie, getNativeCookie } from "../getCartToken";



export const useGuestCartToken = () => {
  const [token, setToken] = useState<string | null>(null);
  const [cartId, setCartId] = useState<number | null>(null);
  const [isReady, setIsReady] = useState(false);

  const isResettingRef = useRef(false);
  const tokenCreatedRef = useRef(false);
  const tokenPromiseRef = useRef<Promise<string | null> | null>(null);

  const createGuestToken = async (): Promise<string | null> => {
    if (tokenPromiseRef.current) return tokenPromiseRef.current;

    tokenPromiseRef.current = (async () => {
      if (tokenCreatedRef.current) {
        const cookieVal = getNativeCookie(GUEST_CART_TOKEN);
        if (cookieVal) {
          const isGuest = getNativeCookie(IS_GUEST) !== "false";
          const decoded = decodeJWT<{ sessionToken: string }>(cookieVal, isGuest);
          return decoded?.sessionToken ?? null;
        }
        return null;
      }
      tokenCreatedRef.current = true;

      try {
        const res = await fetchHandler({
          url: "graphql",
          method: "POST",
          body: { operationName: "CreateCart" },
          contentType: true,
        });

        const cart = res?.data?.createCartToken?.cartToken;
        if (!cart) {
          tokenCreatedRef.current = false;
          return null;
        }

        const newToken = encodeJWT({
          sessionToken: cart.sessionToken,
          cartId: cart.id,
          isGuest: cart.isGuest,
        });
        const newCartId = Number(cart.id);

        setCookie(GUEST_CART_TOKEN, newToken);
        setCookie(GUEST_CART_ID, String(newCartId));
        setCookie(IS_GUEST, String(cart?.isGuest));

        setToken(cart.sessionToken);
        setCartId(newCartId);
        return cart.sessionToken;
      } catch (e) {
        console.error("Error creating guest token:", e);
        tokenCreatedRef.current = false;
        return null;
      } finally {
        tokenPromiseRef.current = null;
      }
    })();

    return tokenPromiseRef.current;


  };

  const resetGuestToken = async () => {
    if (isResettingRef.current) return;
    isResettingRef.current = true;

    tokenCreatedRef.current = false;

    deleteCookie(GUEST_CART_TOKEN);
    deleteCookie(GUEST_CART_ID);

    await createGuestToken();

    isResettingRef.current = false;
  };

  useEffect(() => {
    const cookieToken = getNativeCookie(GUEST_CART_TOKEN);

    if (cookieToken) {
      const isGuest = getNativeCookie(IS_GUEST) !== "false";
      const decoded = decodeJWT<{
        sessionToken: string;
        cartId: number;
        isGuest: boolean;
      }>(cookieToken, isGuest);

      if (decoded) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setToken(decoded.sessionToken);
        setCartId(decoded.cartId);
      }
    }

    setIsReady(true);
  }, []);

  return {
    token,
    cartId,
    isReady,
    createGuestToken,
    resetGuestToken,
    deleteCookie,
  };
};
