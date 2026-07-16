import { useCustomToast } from "./useToast";
import { useAppDispatch } from "@/store/hooks";
import { addItem, clearCart, type Cart } from "@/store/slices/cart-slice";
import { isObject } from "@utils/type-guards";
import { getCartToken, getGuestCartId, getCookie } from "@/utils/getCartToken";
import { bumpCartGeneration } from "@/utils/cart-sync";
import { useGuestCartToken } from "./useGuestCartToken";
import { IS_GUEST } from "@/utils/constants";
import { useMutation } from "@apollo/client/react";
import { CombinedGraphQLErrors, ServerError, ServerParseError, type ErrorLike } from "@apollo/client";
import { AddToCartData, RemoveCartItemData, UpdateCartItemData } from "@/types/cart/type";

interface BookingInput {
  type?: string;
  date?: string;
  slot?: string;
  renting_type?: string;
  date_from?: string;
  date_to?: string;
  qty?: Record<string, unknown>;
  [key: string]: unknown;
}

const removeInFlight = new Set<string>();
import {
  CREATE_ADD_PRODUCT_IN_CART,
  CREATE_ADD_GROUPED_PRODUCT_IN_CART,
  REMOVE_CART_ITEM,
  UPDATE_CART_ITEM,
} from "@/graphql";



const getBackendErrorMessage = (err: unknown): string => {
  if (CombinedGraphQLErrors.is(err)) {
    return err.errors?.[0]?.message || err.message;
  }

  if (ServerError.is(err) || ServerParseError.is(err)) {
    const bodyText = err.bodyText;
    if (bodyText) {
      try {
        const body = JSON.parse(bodyText);
        const message =
          body?.error?.message ||
          body?.errors?.[0]?.message ||
          (body?.message && body.message !== "Network error" ? body.message : undefined);
        if (message) return message;
      } catch {
        return bodyText;
      }
    }
  }

  if (err instanceof Error) {
    return err.message;
  }

  return "Error";
};

const isStockWarning = (message: string): boolean => {
  const lower = message.toLowerCase();
  return (
    lower.includes("quantity") ||
    lower.includes("available") ||
    lower.includes("stock")
  );
};



export const useAddProduct = () => {
  const dispatch = useAppDispatch();
  const { createGuestToken, resetGuestToken } = useGuestCartToken();
  const { showToast } = useCustomToast();

  const [mutateAsync, { loading: isCartLoading }] = useMutation<AddToCartData>(
    CREATE_ADD_PRODUCT_IN_CART,
    {
      onCompleted: (res) => {
        const responseData = res?.createAddProductInCart?.addProductInCart;

        if (!responseData?.success) {
          const message = responseData?.message || "Error adding to cart";
          showToast(message, isStockWarning(message) ? "warning" : "danger");
          return;
        }
        if (responseData) {
          if (responseData.success) {
            dispatch(addItem(responseData as unknown as Cart));
            showToast("Product added to cart successfully", "success");
          }
        }
      },

      onError: (err: ErrorLike) => {
        const message = getBackendErrorMessage(err);
        showToast(message, isStockWarning(message) ? "warning" : "danger");
      },
    },
  );

  const onAddToCartCompletedHandler = (res: AddToCartData) => {
    const responseData = res?.createAddProductInCart?.addProductInCart;
    if (!responseData?.success) {
      const message = responseData?.message || "Error adding to cart";
      showToast(message, isStockWarning(message) ? "warning" : "danger");
      return;
    }
    if (responseData?.success) {
      dispatch(addItem(responseData as unknown as Cart));
      showToast("Product added to cart successfully", "success");
    }
  };

  const onAddToCartErrorHandler = (err: ErrorLike) => {
    const message = getBackendErrorMessage(err);
    showToast(message, isStockWarning(message) ? "warning" : "danger");
  };

  const [mutateGroupedAsync, { loading: isGroupedCartLoading }] = useMutation<AddToCartData>(
    CREATE_ADD_GROUPED_PRODUCT_IN_CART,
    {
      onCompleted: onAddToCartCompletedHandler,
      onError: onAddToCartErrorHandler,
    },
  );


  const onAddToCart = async ({
    productId,
    quantity,
    groupedQty,
    bundleOptions,
    bundleOptionQty,
    links,
    booking,
    bookingNote,
    productType,
  }: {
    productId: string;
    quantity: number;
    groupedQty?: string;
    bundleOptions?: string;
    bundleOptionQty?: string;
    links?: Array<string | number>;
    booking?: BookingInput;
    bookingNote?: string;
    productType?: string;
    token?: string;
    cartId?: number | string;
  }) => {
    let token = getCartToken();
    let guestCartId: number | null = null;

    if (!token) {
      token = await createGuestToken();

      if (!token) {
        showToast("Failed to create cart session", "danger");
        return;
      }
    }


    const isGuest = getCookie(IS_GUEST);
    if (isGuest === "true") {
      guestCartId = getGuestCartId();
    }

    let formattedBooking = undefined;
    if (productType === 'booking' && booking) {
      if (booking.type === 'appointment') {
        formattedBooking = JSON.stringify({
          type: 'appointment',
          date: booking.date,
          slot: booking.slot,
        });
      } else if (booking.type === 'table') {
        formattedBooking = JSON.stringify({
          type: 'table',
          date: booking.date,
          slot: booking.slot,
        });
      } else if (booking.type === 'rental') {
        if (booking.renting_type === 'daily') {
          formattedBooking = JSON.stringify({
            type: 'rental',
            renting_type: 'daily',
            date_from: booking.date_from,
            date_to: booking.date_to,
          });
        } else {
          formattedBooking = JSON.stringify({
            type: 'rental',
            renting_type: 'hourly',
            date: booking.date,
            slot: booking.slot,
          });
        }
      } else if (booking.type === 'default') {
        formattedBooking = JSON.stringify({
          type: 'default',
          date: booking.date,
          slot: booking.slot,
        });
      } else {
        formattedBooking = JSON.stringify({
          type: 'event',
          qty: booking.qty || {},
        });
      }
    }

    if (productType === "grouped") {
      bumpCartGeneration();
      await mutateGroupedAsync({
        variables: {
          productId: parseInt(productId),
          quantity,
          cartId: guestCartId,
          groupedQty,
        },
      });
    } else {
      bumpCartGeneration();
      await mutateAsync({
        variables: {
          productId: parseInt(productId),
          quantity,
          cartId: guestCartId,
          bundleOptions,
          bundleOptionQty,
          links: productType === "downloadable" ? links : undefined,
          booking: formattedBooking,
          bookingNote,
        },
      });
    }
  };


  const [removeFromCart, { loading: isRemoveLoading }] = useMutation<RemoveCartItemData>(
    REMOVE_CART_ITEM,
    {
      onCompleted: (response) => {
        const responseData = response?.createRemoveCartItem?.removeCartItem;
        if (isObject(responseData)) {
          const message = "Cart item removed successfully";
          dispatch(addItem(responseData as unknown as Cart));
          showToast(message as string, "warning");

          if (!responseData?.itemsQty) {
            dispatch(clearCart());

            const isGuest = getCookie(IS_GUEST);
            if (isGuest === "true") {
              resetGuestToken();
            }
          }
        } else {
          showToast("Something went wrong", "warning");
        }
      },
      onError: (error: ErrorLike) => {
        showToast(getBackendErrorMessage(error), "danger");
      },
    },
  );

  const onAddToRemove = async (productId: string) => {
    const id = String(productId);
    if (removeInFlight.has(id)) return;
    removeInFlight.add(id);
    bumpCartGeneration();
    try {
      await removeFromCart({
        variables: {
          cartItemId: parseInt(productId),
        },
      });
    } finally {
      removeInFlight.delete(id);
    }
  };

  const [updateCartItem, { loading: isUpdateLoading }] = useMutation<UpdateCartItemData>(
    UPDATE_CART_ITEM,
    {
      onCompleted: (response) => {
        const responseData = response?.createUpdateCartItem?.updateCartItem;

        if (isObject(responseData)) {
          dispatch(addItem(responseData as unknown as Cart));
        } else {
          showToast("Something went wrong!", "warning");
        }
      },

      onError: (error: ErrorLike) => {
        showToast(getBackendErrorMessage(error), "danger");
      },
    },
  );

  const onUpdateCart = async ({
    cartItemId,
    quantity,
  }: {
    cartItemId: number;
    quantity: number;
  }) => {
    if (quantity < 1) {
      showToast("Quantity must be at least 1", "warning");
      return;
    }

    bumpCartGeneration();
    await updateCartItem({
      variables: {
        cartItemId: cartItemId,
        quantity,
      },
    });
  };

  return {
    isCartLoading: isCartLoading || isGroupedCartLoading,
    onAddToCart,
    isRemoveLoading,
    onAddToRemove,
    onUpdateCart,
    isUpdateLoading,
  };

};
