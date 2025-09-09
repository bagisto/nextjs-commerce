import { useMutation } from "@tanstack/react-query";

import { useCustomToast } from "./use-toast";

import { BagistoCart, SuperAttribute } from "@/lib/bagisto/types";
import { fetchHandler } from "@/lib/fetch-handler";
import { isObject } from "@/lib/type-guards";
import { useAppDispatch } from "@/store/hooks";
import { addItem } from "@/store/slices/cart-slice";
export interface InputDataTypes {
  input: {
    quantity: number;
    productId: string;
    selectedConfigurableOption?: number;
    superAttribute?: SuperAttribute[];
    isBuyNow?: boolean;
  };
}
export const useAddProduct = () => {
  // ✅ Use typed dispatch
  const dispatch = useAppDispatch();
  const { showToast } = useCustomToast();

  //-----Add Cart Product Quantity-----------------//
  const { mutateAsync, isPending: isCartLoading } = useMutation({
    mutationFn: (data: InputDataTypes) =>
      fetchHandler({
        url: "cart/addToCart",
        method: "POST",
        contentType: true,
        body: data,
      }),
    onSuccess: (response) => {
      const responseData = response?.data?.addItemToCart;

      if (isObject(responseData)) {
        const { message, success } = responseData;

        if (success) {
          showToast(message as string, "success");
          dispatch(addItem(responseData?.cart as BagistoCart));
        } else {
          showToast(message as string, "warning");
        }
      } else {
        showToast(response?.error?.message as string, "warning");
      }
    },
    onError: (error) => {
      showToast(error?.message as string as string, "danger");
    },
  });

  const onAddToCart = async (input: InputDataTypes) => {
    await mutateAsync(input);
  };

  //--------Remove Cart Product Quantity--------//
  const { mutateAsync: removeFromCcart, isPending: isRemoveLoading } =
    useMutation({
      mutationFn: (data: { id: number }) =>
        fetchHandler({
          url: "cart/removeCart",
          method: "POST",
          contentType: true,
          body: { ...data },
        }),
      onSuccess: (response) => {
        const responseData = response?.data?.removeCartItem;

        if (isObject(responseData)) {
          const { message, success } = responseData;

          if (success) {
            showToast(message as string, "success");
            dispatch(addItem(responseData?.cart as BagistoCart));
          } else {
            showToast(message as string, "warning");
          }
        } else {
          showToast(response?.error?.message as string, "warning");
        }
      },
      onError: (error) => {
        showToast(error?.message as string, "danger");
      },
    });

  const onAddToRemove = async (productId: string) => {
    await removeFromCcart({
      id: parseInt(productId),
    });
  };

  //---------Update Cart Product Quantity--------//
  const { mutateAsync: updateCartItem, isPending: isUpdateLoading } =
    useMutation({
      mutationFn: (input: {
        input: {
          qty: {
            cartItemId: string;
            quantity: number;
          }[];
        };
      }) =>
        fetchHandler({
          url: "/cart/updateCart",
          contentType: true,
          method: "POST",
          body: input,
        }),
      onSuccess: (response) => {
        const responseData = response?.data?.updateItemToCart;

        if (isObject(responseData)) {
          const { message, success } = responseData;

          if (success) {
            showToast(message as string, "success");
            dispatch(addItem(responseData?.cart as BagistoCart));
          } else {
            showToast(message as string, "warning");
          }
        } else {
          showToast(response?.error?.message as string, "warning");
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
    cartItemId: string;
    quantity: number;
  }) => {
    if (quantity >= 1) {
      const inputArr = [{ cartItemId: cartItemId, quantity: quantity }];

      await updateCartItem({ input: { qty: inputArr } });
    } else {
      showToast("No Sufficente Quantity to remove", "warning");
    }
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
