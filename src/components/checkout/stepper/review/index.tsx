import { FC } from "react";
import { AddressDataTypes } from "@/types/types";
import OrderReview from "./OrderReview";

export const Review: FC<{
  selectedPaymentTitle?: string;
  shippingAddress?: AddressDataTypes;
  billingAddress?: AddressDataTypes;
  selectedShippingRate?: string;
  selectedShippingRateTitle?: string;
}> = ({
  selectedPaymentTitle,
  shippingAddress,
  billingAddress,
  selectedShippingRate,
  selectedShippingRateTitle,
}) => {
  return (
    <OrderReview
      billingAddress={billingAddress}
      selectedPaymentTitle={selectedPaymentTitle}
      selectedShipping={selectedShippingRate}
      selectedShippingRateTitle={selectedShippingRateTitle}
      shippingAddress={shippingAddress}
    />
  );
};

export default Review;
