import { useMutation } from "@tanstack/react-query";
import { useCustomToast } from "./useToast";
import { useAppDispatch } from "@/store/hooks";
import { fetchHandler } from "../fetch-handler";
import { addItem, clearCart } from "@/store/slices/cart-slice";
import { isObject } from "@utils/type-guards";
import { getCartToken } from "@utils/getCartToken";
import { useGuestCartToken } from "./useGuestCartToken";

interface AddInput {
  productId: number;
  quantity: number;
  token?: string;
  cartId?: number;
}

interface UpdateInput {
  token: string;
  cartItemId: number;
  quantity: number;
}

interface removeInput {
  token: string;
  cartItemId: number;
}

interface AddProductInCartResponse {
  id: number;
  success: boolean;
  message: string;
  sessionToken: string;
  isGuest: boolean;
  itemsQty: number;
  itemsCount: number;
  cartToken: string | null;
  items: {
    edges: {
      node: {
        id: number;
        cartId: number;
        productId: number;
        name: string;
        sku: string;
        quantity: number;
        type: string;
        productUrlKey: string;
        canChangeQty: boolean;
      };
    }[];
  };
}

interface AddToCartAPIResponse {
  createAddProductInCart: {
    addProductInCart: AddProductInCartResponse;
  };
}

interface RemoveCartItem {
  itemsQty: number;
  itemsCount: number;
  cartToken: string | null;
  isGuest: boolean;
}

interface RemoveCartResponse {
  success: boolean;
  message: string;
  removeCartItem: RemoveCartItem;
}

interface RemoveCartAPIResponse {
  createRemoveCartItem: RemoveCartResponse;
}

export const useAddProduct = () => {
  const dispatch = useAppDispatch();
  const { createGuestToken, resetGuestToken } = useGuestCartToken();
  const { showToast } = useCustomToast();

  const { mutateAsync, isPending: isCartLoading } = useMutation({
    mutationFn: (input: AddInput) =>
      fetchHandler({
        url: "cart/addToCart",
        method: "POST",
        contentType: true,
        body: { ...input },
      }),

    onSuccess: (res: {
      error: any; data: AddToCartAPIResponse 
}) => {
      const responseData = res?.data?.createAddProductInCart?.addProductInCart;
      if (!responseData.success) {
        showToast(res?.error?.message, "danger");
        return;
      }
      if (responseData) {
        if (responseData.success) {
          dispatch(addItem(responseData as any));
          showToast("Product added to cart successfully", "success");
        }
      }
    },

    onError: (err: any) => {
      showToast(err?.message ?? "Error", "danger");
    },
  });

  const onAddToCart = async ({
    productId,
    quantity,
  }: {
    productId: string;
    quantity: number;
    token?: string;
    cartId?: number | string;
  }) => {
    // Ensure token exists - create if needed
    let token = getCartToken();

    if (!token) {
      token = await createGuestToken();

      if (!token) {
        showToast("Failed to create cart session", "danger");
        return;
      }
    }

    await mutateAsync({
      productId: parseInt(productId),
      quantity,
      token: token,
    });
  };

  //--------Remove Cart Product Quantity--------//
  const { mutateAsync: removeFromCart, isPending: isRemoveLoading } =
    useMutation({
      mutationFn: (input: removeInput) =>
        fetchHandler({
          url: "cart/removeCart",
          method: "POST",
          contentType: true,
          body: { ...input },
        }),
      onSuccess: async (response: { data: RemoveCartAPIResponse }) => {
        const responseData = response?.data?.createRemoveCartItem;
        if (isObject(responseData)) {
          const message =
            responseData?.message || "Cart item removed successfully";
          dispatch(addItem(responseData?.removeCartItem as any));
          showToast(message as string, "success");

          if (!responseData?.removeCartItem?.itemsQty) {
            dispatch(clearCart());
            resetGuestToken();
          }
        } else {
          showToast("Something went wrong", "warning");
        }
      },
      onError: (error) => {
        showToast(error?.message as string, "danger");
      },
    });

  const onAddToRemove = async (productId: string) => {
    const token = getCartToken();

    await removeFromCart({
      token: token || "",
      cartItemId: parseInt(productId),
    });
  };

  //---------Update Cart Product Quantity--------//
  const { mutateAsync: updateCartItem, isPending: isUpdateLoading } =
    useMutation({
      mutationFn: (input: UpdateInput) =>
        fetchHandler({
          url: "cart/updateCart",
          contentType: true,
          method: "POST",
          body: { ...input },
        }),

      onSuccess: (response) => {
        const responseData =
          response?.data?.createUpdateCartItem?.updateCartItem;

        if (isObject(responseData)) {
          showToast("Cart updated successfully", "success");
          dispatch(addItem(responseData as any));
        } else {
          showToast("Something went wrong!", "warning");
        }
      },

      onError: (error) => {
        showToast(error?.message as string, "danger");
      },
    });

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
    const token = getCartToken();

    await updateCartItem({
      token: token || "",
      cartItemId: cartItemId,
      quantity,
    });
  };

  return {
    isCartLoading,
    onAddToCart,
    isRemoveLoading,
    onAddToRemove,
    onUpdateCart,
    isUpdateLoading,
  };
};
