"use client";

import { CartCheckoutPageSkeleton } from "@/components/common/skeleton/CheckoutSkeleton";
import { fetchHandler } from "@utils/fetch-handler";
import { getCartToken } from "@utils/getCartToken";
import ShippingMethod from "./ShippingMethod";
import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { SelectedShippingRateType } from "@/types/checkout/type";

const Shipping: FC<{
  selectedShippingRate?: SelectedShippingRateType;
}> = ({ selectedShippingRate }) => {
  const token = getCartToken();

  const { data, isLoading } = useQuery({
    queryKey: ["shippingMethods", token],
    enabled: !!token,
    staleTime: 10 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: () =>
      fetchHandler({
        url: "checkout/shippingMethods",
        method: "POST",
        contentType: true,
        body: { token },
      }),
  });

  return isLoading ? (
    <CartCheckoutPageSkeleton />
  ) : (
    <ShippingMethod
      shippingMethod={data?.data}
      selectedShippingRate={selectedShippingRate}
      methodDesc={selectedShippingRate?.methodDescription}
    />
  );
};

export default Shipping;
