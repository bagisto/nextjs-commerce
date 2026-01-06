"use client";

import { CartCheckoutPageSkeleton } from "@/components/common/skeleton/CheckoutSkeleton";
import { fetchHandler } from "@utils/fetch-handler";
import { getCartToken } from "@utils/getCartToken";
import PaymentMethod from "./PaymentMethod";
import { useQuery } from "@tanstack/react-query";
import { FC } from "react";

const Payment: FC<{
  selectedPayment?: {
    method: string;
    methodTitle?: string;
  };
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}> = ({ selectedPayment, isOpen, setIsOpen }) => {
  const token = getCartToken();

  const { data, isLoading } = useQuery({
    queryKey: ["paymentMethods", token],
    enabled: !!token,
    queryFn: () =>
      fetchHandler({
        url: "checkout/paymentMethods",
        method: "POST",
        contentType: true,
        body: { token },
      }),
  });

  if (isLoading) return <CartCheckoutPageSkeleton />;

  return (
    <PaymentMethod
      methods={data?.data}
      selectedPayment={selectedPayment as any}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    />
  );
};

export default Payment;
