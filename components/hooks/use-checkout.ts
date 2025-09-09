import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FieldValues } from "react-hook-form";
import { useDispatch } from "react-redux";

import { useCustomToast } from "./use-toast";

import { addItem } from "@/store/slices/cart-slice";
import { isObject } from "@/lib/type-guards";
import { fetchHandler } from "@/lib/fetch-handler";
import { BagistoCart } from "@/lib/bagisto/types";
import { ORDER_DETAILS, setLocalStorage } from "@/store/local-storage";
export interface InputDataTypes {
  input: {
    productId: number;
    quantity: number;
    isBuyNow: boolean;
  };
}

export const useCheckout = () => {
  const router = useRouter();
  const { showToast } = useCustomToast();
  const dispatch = useDispatch();

  //-----Save Address to Checkout------//
  const { mutateAsync, isPending: isLoadingToSave } = useMutation({
    mutationFn: (data: { input: FieldValues }) =>
      fetchHandler({
        url: "/checkout/saveCheckoutAddresses",
        method: "POST",
        contentType: true,
        body: data,
      }),
    onSuccess: (response) => {
      const responseData = response?.data?.saveCheckoutAddresses;

      if (isObject(responseData)) {
        const { message } = responseData;

        showToast(message as string, "success");
        dispatch(addItem(responseData?.cart as BagistoCart));
        router.replace("/checkout?step=shipping");
      } else {
        showToast(response?.error?.message as string, "warning");
      }
    },
    onError: (error) => {
      showToast(error?.message as string, "danger");
    },
  });

  const saveCheckoutAddress = async ({ input }: { input: FieldValues }) => {
    await mutateAsync({ input: { ...input } });
  };

  // --------Save Shipping Methods to checkout --------//
  const { mutateAsync: saveShipping, isPending: isSaving } = useMutation({
    mutationFn: (data: { input: FieldValues }) =>
      fetchHandler({
        url: "/checkout/saveShipping",
        method: "POST",
        contentType: true,
        body: data,
      }),
    onSuccess: (response) => {
      const responseData = response?.data?.saveShipping;

      if (isObject(responseData)) {
        const { message } = responseData;

        showToast(message as string, "success");
        dispatch(addItem(responseData?.cart as BagistoCart));
        router.replace("/checkout?step=payment");
      } else {
        showToast(response?.error?.message as string, "warning");
      }
    },
    onError: (error) => {
      showToast(error?.message as string, "danger");
    },
  });

  const saveCheckoutShipping = async (input: FieldValues) => {
    await saveShipping({
      input: { ...input },
    });
  };

  // --------Save Payment Methods to checkout --------//
  const { mutateAsync: savePayment, isPending: isPaymentLoading } = useMutation(
    {
      mutationFn: (data: { input: FieldValues }) =>
        fetchHandler({
          url: "/checkout/savePayment",
          method: "POST",
          contentType: true,
          body: data,
        }),
      onSuccess: (response) => {
        const responseData = response?.data?.savePayment;

        if (isObject(responseData)) {
          const { message } = responseData;

          showToast(message as string, "success");
          dispatch(addItem(responseData?.cart as BagistoCart));
          router.replace("/checkout?step=review");
        } else {
          showToast(response?.error?.message as string, "warning");
        }
      },
      onError: (error) => {
        showToast(error?.message as string, "danger");
      },
    }
  );

  const saveCheckoutPayment = async (input: FieldValues) => {
    await savePayment({
      input: { ...input },
    });
  };

  // -------Finally Place Order---------------//
  const { mutateAsync: placeOrder, isPending: isPlaceOrder } = useMutation({
    mutationFn: () =>
      fetchHandler({
        url: "/checkout/placeOrder",
        method: "POST",
        contentType: true,
      }),
    onSuccess: (response) => {
      const responseData = response?.data?.placeOrder;

      if (isObject(responseData)) {
        if (isObject(responseData?.order) && responseData?.success) {
          setLocalStorage(ORDER_DETAILS, responseData);
          showToast("Order Placed Successfully!", "success");
          router.replace("/success");
        } else {
          showToast("payment has been cancelled.", "danger");
        }
      } else {
        showToast(response?.error?.message as string, "warning");
      }
    },
    onError: (error) => {
      showToast(error?.message as string, "danger");
    },
  });

  const SavePlaceOrder = async () => {
    await placeOrder();
  };

  return {
    isLoadingToSave,
    saveCheckoutAddress,
    isSaving,
    saveCheckoutShipping,
    isPaymentLoading,
    saveCheckoutPayment,
    SavePlaceOrder,
    isPlaceOrder,
  };
};
