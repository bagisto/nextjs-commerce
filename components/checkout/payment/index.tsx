"use client";

import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import PaymentMethod from "./payment-method";
import { fetchHandler } from "@/lib/fetch-handler";
import { CartCheckoutPageSkeleton } from "@/components/checkout/place-holder";
import { selectedPaymentMethodType } from "@/lib/bagisto/types";

const Payment: FC<{
  selectedPayment?: selectedPaymentMethodType;
  selectedShippingRate?: {
    method: string;
  };
}> = ({ selectedPayment, selectedShippingRate }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["Payment-methods", selectedShippingRate?.method],
    queryFn: async () =>
      fetchHandler({
        url: "/checkout/paymentMethods",
        method: "POST",
        contentType: true,
        body: {
          input: {
            shippingMethod: selectedShippingRate?.method,
          },
        },
      }),
    enabled: !!selectedShippingRate?.method,
    refetchOnWindowFocus: false,
  });

  const methods = data?.paymentMethods;

  return isLoading ? (
    <CartCheckoutPageSkeleton />
  ) : (
    <PaymentMethod
      methods={methods?.paymentMethods}
      selectedPayment={selectedPayment}
    />
  );
};

export default Payment;
