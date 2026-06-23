import { FC } from "react";
import { MappedCheckoutAddress } from "@/types/checkout/type";
import OrderReview from "./OrderReview";

export const Review: FC<{
  selectedPaymentTitle?: string;
  shippingAddress?: MappedCheckoutAddress | null;
  billingAddress?: MappedCheckoutAddress | null;
  selectedShippingRate?: string;
  selectedShippingRateTitle?: string;
  isShippingRequired?: boolean;
}> = ({
  selectedPaymentTitle,
  shippingAddress,
  billingAddress,
  selectedShippingRate,
  selectedShippingRateTitle,
  isShippingRequired,
}) => {
  return (
    <OrderReview
      billingAddress={billingAddress}
      selectedPaymentTitle={selectedPaymentTitle}
      selectedShipping={selectedShippingRate}
      selectedShippingRateTitle={selectedShippingRateTitle}
      shippingAddress={shippingAddress}
      isShippingRequired={isShippingRequired}
    />
  );
};

export default Review;
