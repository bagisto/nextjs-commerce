"use client";

import { CartCheckoutPageSkeleton } from "@/components/common/skeleton/CheckoutSkeleton";
import { useQuery } from "@apollo/client/react";
import PaymentMethod from "./PaymentMethod";
import { FC } from "react";
import { GET_CHECKOUT_PAYMENT_METHODS } from "@/graphql";
import { getCartToken } from "@/utils/getCartToken";

const Payment: FC<{
  selectedPayment?: string;
  currentStep?: string;
}> = ({ selectedPayment, currentStep }) => {
  const token = getCartToken();
  const { data, loading: isLoading } = useQuery(GET_CHECKOUT_PAYMENT_METHODS, {
    variables: { token: token || "" },
    skip: !token,
    fetchPolicy: "cache-first",
    nextFetchPolicy: "cache-first",
  });

  if (isLoading && !data) return <CartCheckoutPageSkeleton />;

  return (
    <PaymentMethod
      methods={(data as any)?.collectionPaymentMethods}
      selectedPayment={selectedPayment}
      currentStep={currentStep}
    />
  );
};

export default Payment;
