"use client";
import { FC } from "react";

import OrderReview from "./order-review";

import {
  AddressDataTypes,
  selectedPaymentMethodType,
} from "@/lib/bagisto/types";

export const Review: FC<{
  selectedPayment?: selectedPaymentMethodType;
  shippingAddress?: AddressDataTypes;
  billingAddress?: AddressDataTypes;
  selectedShippingRate?: {
    method: string;
  };
}> = ({
  selectedPayment,
  shippingAddress,
  billingAddress,
  selectedShippingRate,
}) => {
  return (
    <OrderReview
      billingAddress={billingAddress}
      selectedPayment={selectedPayment}
      selectedShipping={selectedShippingRate}
      shippingAddress={shippingAddress}
    />
  );
};

export default Review;
