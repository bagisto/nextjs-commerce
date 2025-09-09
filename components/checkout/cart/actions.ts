"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

import { addToCart, getCart, removeFromCart, updateCart } from "@/lib/bagisto";
import { SuperAttribute } from "@/lib/bagisto/types";
import { BAGISTO_SESSION, TAGS } from "@/lib/constants";
export async function addItem(
  prevState: any,
  input: {
    selectedVariantId: string | undefined;
    selectedConfigurableOption: number;
    superAttribute: SuperAttribute[];
  },
) {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(BAGISTO_SESSION)?.value;

  if (cartId) {
    await getCart();
  } else {
    cookieStore.set(BAGISTO_SESSION, generateCookieValue(40), {
      httpOnly: true,
      secure: false,
    });
  }

  if (!input.selectedVariantId) {
    return "Missing product variant ID";
  }

  const selectedConfigurableOption = input.selectedConfigurableOption;
  const superAttribute = input.superAttribute;

  try {
    await addToCart({
      productId: Number(input?.selectedVariantId),
      quantity: 1,
      selectedConfigurableOption,
      superAttribute,
      isBuyNow: false,
    });
    revalidateTag(TAGS.cart);
  } catch (e) {
    return "Error adding item to cart";
  }
}

function generateCookieValue(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let cookieValue = "";

  for (let i = 0; i < length; i++) {
    cookieValue += characters.charAt(
      Math.floor(Math.random() * characters.length),
    );
  }

  return cookieValue;
}

export async function removeItem(prevState: any, lineId: number) {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(BAGISTO_SESSION)?.value;

  if (!cartId) {
    return "Missing cart ID";
  }

  try {
    await removeFromCart(Number(lineId));
    revalidateTag(TAGS.cart);
  } catch (e) {
    return "Error removing item from cart";
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    lineId: number;
    quantity: number;
  },
) {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(BAGISTO_SESSION)?.value;

  if (!cartId) {
    return "Missing cart ID";
  }

  const { lineId, quantity } = payload;

  try {
    if (quantity === 0) {
      await removeFromCart(Number(lineId));
      revalidateTag(TAGS.cart);

      return;
    }

    await updateCart([
      {
        cartItemId: lineId,
        quantity,
      },
    ]);
    revalidateTag(TAGS.cart);
  } catch (e) {
    return "Error updating item quantity";
  }
}
