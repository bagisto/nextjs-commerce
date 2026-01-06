import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCustomToast } from "./useToast";
import { isObject } from "../type-guards";
import { fetchHandler } from "../fetch-handler";
import { getCartToken } from "@utils/getCartToken";
import { setCookie } from "@utils/helper";
import { useGuestCartToken } from './useGuestCartToken';
import { useDispatch } from "react-redux";
import { clearCart } from "@/store/slices/cart-slice";
import { ORDER_ID } from "@/utils/constants";

export interface InputDataTypes {
  input: {
    productId: number;
    quantity: number;
    isBuyNow: boolean;
  };
}

interface saveShippingMethodsTypes {
  token: string;
  shippingMethod: string;
}

interface savePaymentMethodsTypes {
  token: string;
  paymentMethod: string;
}


export const useCheckout = () => {
  const router = useRouter();
  const { resetGuestToken } = useGuestCartToken();
  const { showToast } = useCustomToast();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();



  const { mutateAsync: saveAddressToCheckout, isPending: isLoadingToSave } =
    useMutation({
      mutationFn: (data: any) =>
        fetchHandler({
          url: "checkout/saveCheckoutAddresses",
          method: "POST",
          contentType: true,
          body: data,
        }),

      onSuccess: (response) => {
        const responseData =
          response?.data?.createCheckoutAddress?.checkoutAddress;

        if (isObject(responseData)) {
          showToast(responseData?.message as string, "success");
          queryClient.invalidateQueries({ queryKey: ["cart-detail"] });
          queryClient.invalidateQueries({ queryKey: ["address"] });
          router.replace("/checkout?step=shipping");
        } else {
          showToast(response?.error?.message, "warning");
        }
      },

      onError: (error) => {
        showToast(error?.message, "danger");
      },
    });

  const saveCheckoutAddress = async (input: any) => {
    const token = getCartToken();
    await saveAddressToCheckout({
      token: token || "",
      ...input,
    });
  };

  // ---Get Shipping Rates from checkout

  const {
    mutateAsync: getShippingRates,
    isPending: isLoadingToGetShippingMethods,
    isSuccess
  } = useMutation({
    mutationFn: async ({ token }: { token: string }) => {
      return fetchHandler({
        url: "checkout/shippingMethods",
        method: "POST",
        contentType: true,
        body: { token: token || "" },
      });
    },
    onError: (error) => {
      showToast(error?.message || "Something went wrong", "danger");
    },
  });

  const handleGetShippingRates = async () => {
    if (isLoadingToGetShippingMethods || isSuccess) return;

    try {
      const token = getCartToken() || "";

      const response = await getShippingRates({ token });
      if (Array.isArray(response?.data)) {
        showToast("Shipping rates loaded", "success");
      } else {
        showToast("No shipping rates found", "warning");
      }

      return response;
    } catch (error: any) {
      showToast(error?.message || "Something went wrong", "danger");
      throw error;
    }
  };

  // --------Save Shipping Methods to checkout --------//
  const { mutateAsync: saveShipping, isPending: isSaving } = useMutation({
    mutationFn: (data: saveShippingMethodsTypes) =>
      fetchHandler({
        url: "checkout/saveShipping",
        method: "POST",
        contentType: true,
        body: data,
      }),
    onSuccess: (response) => {
      const responseData = response?.data?.createCheckoutShippingMethod?.checkoutShippingMethod;

      if (isObject(responseData)) {
        showToast(responseData?.message as string, "success");
        queryClient.invalidateQueries({ queryKey: ["cart-detail"] });
        router.replace("/checkout?step=payment");
      } else {
        showToast(response?.error?.message as string, "warning");
      }
    },
    onError: (error) => {
      showToast(error?.message as string, "danger");
    },
  });

  const saveCheckoutShipping = async (input: any) => {
    const token = getCartToken();
    await saveShipping({
      token: token || "",
      shippingMethod: input
    });
  };

  // ---Get Payment Methods from checkout

  // --------Save Payment Methods to checkout --------//
  const { mutateAsync: savePayment, isPending: isPaymentLoading } = useMutation(
    {
      mutationFn: (data: savePaymentMethodsTypes) =>
        fetchHandler({
          url: "/checkout/savePayment",
          method: "POST",
          contentType: true,
          body: data,
        }),
      onSuccess: (response) => {
        const responseData = response?.data?.createCheckoutPaymentMethod?.checkoutPaymentMethod;

        if (isObject(responseData)) {
          showToast(responseData?.message as string, "success");
          queryClient.invalidateQueries({ queryKey: ["cart-detail"] });
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

  const saveCheckoutPayment = async (input: any) => {
    const token = getCartToken();
    await savePayment({
      token: token || "",
      paymentMethod: input
    });
  };

  // -------Finally Place Order---------------//
  const { mutateAsync: placeOrder, isPending: isPlaceOrder } = useMutation({
    mutationFn: (data: any) =>
      fetchHandler({
        url: "/checkout/placeOrder",
        method: "POST",
        contentType: true,
        body: data
      }),
    onSuccess: (response) => {
      const responseData = response?.data?.createCheckoutOrder?.checkoutOrder;

      if (isObject(responseData)) {
        showToast("Order Placed Successfully!", "success");
        setCookie(ORDER_ID, responseData?.orderId as string);
        dispatch(clearCart())
        router.replace("/success");
        } 
       else {
        showToast(response?.error?.message as string, "warning");
      }
    },
    onError: (error) => {
      showToast(error?.message as string, "danger");
    },
  });

  const SavePlaceOrder = async () => {
    const token = getCartToken();
    await placeOrder({
      token: token || ""
    });
    await resetGuestToken();
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
    handleGetShippingRates,
    isLoadingToGetShippingMethods,
  };
};
