import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { useCustomToast } from "./useToast";
import { useDispatch } from "react-redux";
import {
  clearCart,
} from "@/store/slices/cart-slice";
import { getCartToken, getCookie } from "@utils/getCartToken";
import { isShippingRequired, setCookie } from "@utils/helper";
import { useGuestCartToken } from "./useGuestCartToken";
import { ORDER_ID, IS_GUEST } from "@utils/constants";
import { useCartDetail } from "./useCartDetail";
import {
  CREATE_CHECKOUT_ADDRESS,
  CREATE_CHECKOUT_ORDER,
  CREATE_CHECKOUT_PAYMENT_METHODS,
  CREATE_CHECKOUT_SHIPPING_METHODS,
  GET_CHECKOUT_ADDRESSES,
} from "@/graphql";
import { useAppSelector } from "@/store/hooks";

export const useCheckout = () => {
  const router = useRouter();
  const { resetGuestToken } = useGuestCartToken();
  const { showToast } = useCustomToast();
  const dispatch = useDispatch();
  const { getCartDetail } = useCartDetail();
  const cart = useAppSelector((state) => state.cartDetail.cart);

  const handleMutationError = (error: any) => {
    showToast(error?.message || "An error occurred", "danger");
  };

  const [saveAddressToCheckout, { loading: isLoadingToSave }] = useMutation(
    CREATE_CHECKOUT_ADDRESS,
    {
      refetchQueries: [{ query: GET_CHECKOUT_ADDRESSES }],
      awaitRefetchQueries: true,
      onCompleted: () => {
        showToast("Address saved successfully", "success");
        if (isShippingRequired(cart)) {
          router.replace("/checkout?step=shipping");
        } else {
          router.replace("/checkout?step=payment");
        }
      },
      onError: handleMutationError,
    },
  );

  const saveCheckoutAddress = async (input: any) => {
    const token = getCartToken();
    await saveAddressToCheckout({
      variables: {
        token: token || "",
        ...input,
      },
    });
  };

  const [saveShipping, { loading: isSaving }] = useMutation(
    CREATE_CHECKOUT_SHIPPING_METHODS,
    {
      onCompleted: (response: any) => {
        const responseData =
          response?.createCheckoutShippingMethod?.checkoutShippingMethod;
        if (responseData?.success) {
          getCartDetail();
          showToast("Shipping method saved successfully", "success");
          router.replace("/checkout?step=payment");
        } else {
          showToast(
            responseData?.message || "Failed to save shipping method",
            "warning",
          );
        }
      },
      onError: handleMutationError,
    },
  );

  const saveCheckoutShipping = async (shippingMethod: string) => {
    const token = getCartToken();
    await saveShipping({
      variables: {
        token: token || "",
        shippingMethod,
      },
    });
  };

  const [savePayment, { loading: isPaymentLoading }] = useMutation(
    CREATE_CHECKOUT_PAYMENT_METHODS,
    {
      onCompleted: (response: any) => {
        const responseData =
          response?.createCheckoutPaymentMethod?.checkoutPaymentMethod;
        if (responseData?.success) {
          showToast("Payment method saved successfully", "success");
          router.replace("/checkout?step=review");
        } else {
          showToast(
            responseData?.message || "Failed to save payment method",
            "warning",
          );
        }
      },
      onError: handleMutationError,
    },
  );

  const saveCheckoutPayment = async (paymentMethod: string) => {
    const token = getCartToken();
    await savePayment({
      variables: {
        token: token || "",
        paymentMethod,
      },
    });
  };

  const [placeOrder, { loading: isPlaceOrder }] = useMutation(
    CREATE_CHECKOUT_ORDER,
    {
      onCompleted: (response: any) => {
        const responseData = response?.createCheckoutOrder?.checkoutOrder;
        if (responseData) {
          showToast("Order placed successfully!", "success");
          setCookie(ORDER_ID, responseData?.orderId);
          dispatch(clearCart());
          router.replace("/success");
        } else {
          showToast(
            responseData?.message || "Failed to place order",
            "warning",
          );
        }
      },
      onError: handleMutationError,
    },
  );

  const savePlaceOrder = async () => {
    const token = getCartToken();
    await placeOrder({
      variables: {
        token: token || "",
      },
    });

    const isGuest = getCookie(IS_GUEST);
    if (isGuest === "true") {
      await resetGuestToken();
    }
  };

  return {
    isLoadingToSave,
    saveCheckoutAddress,
    isSaving,
    saveCheckoutShipping,
    isPaymentLoading,
    saveCheckoutPayment,
    isPlaceOrder,
    savePlaceOrder,
  };
};
