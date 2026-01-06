"use client";

import { useEffect, useState, useRef } from "react";
import { fetchHandler } from "../fetch-handler";
import { GUEST_CART_ID, GUEST_CART_TOKEN, IS_GUEST } from "@/utils/constants";
import { encodeJWT, decodeJWT } from "@/utils/jwt-cookie";
import { setCookie, deleteCookie, getNativeCookie } from "../getCartToken";

let tokenCreated = false;
let tokenPromise: Promise<string | null> | null = null;

// ---------------------------
// Main Hook
// ---------------------------
export const useGuestCartToken = () => {
  const [token, setToken] = useState<string | null>(null);
  const [cartId, setCartId] = useState<number | null>(null);
  const [isReady, setIsReady] = useState(false);

  const isResettingRef = useRef(false);

  const createGuestToken = async (): Promise<string | null> => {
    if (tokenPromise) return tokenPromise;

    tokenPromise = (async () => {
      if (tokenCreated) {
        // Return existing raw token from cookie
        const cookieVal = getNativeCookie(GUEST_CART_TOKEN);
        if (cookieVal) {
          const isGuest = getNativeCookie(IS_GUEST) !== "false";
          const decoded = decodeJWT<{ sessionToken: string }>(cookieVal, isGuest);
          return decoded?.sessionToken ?? null;
        }
        return null;
      }
      tokenCreated = true;

      try {
        const res = await fetchHandler({
          url: "cart/createGuestToken",
          method: "POST",
          contentType: true,
        });

        const cart = res?.data?.createCartToken?.cartToken;
        if (!cart) {
          tokenCreated = false;
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

        // State and return should be the RAW token
        setToken(cart.sessionToken);
        setCartId(newCartId);
        return cart.sessionToken;
      } catch (e) {
        console.error("Error creating guest token:", e);
        tokenCreated = false;
        return null;
      } finally {
        tokenPromise = null;
      }
    })();

    return tokenPromise;
  };

  const resetGuestToken = async () => {
    if (isResettingRef.current) return;
    isResettingRef.current = true;

    tokenCreated = false;

    // delete old
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
