"use client";

import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { CartCheckoutPageSkeleton } from "../place-holder";
import ShippingMethod from "./shipping-method";
import { ShippingArrayDataType } from "@/lib/bagisto/types";
import { fetchHandler } from "@/lib/fetch-handler";
import { input } from "@heroui/theme";

const Shipping: FC<{
  selectedShippingRate?: {
    method: string;
    methodDescription?: string;
  };
}> = ({ selectedShippingRate }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["shipping-methods"],
    refetchOnWindowFocus: false,
    queryFn: async () =>
      fetchHandler({
        url: "/checkout/shippingMethods",
        method: "GET",
      }),
  });

  const shippingMethod = data?.shippingMethods;

  return isLoading ? (
    <CartCheckoutPageSkeleton />
  ) : (
    <ShippingMethod
      selectedShippingRate={selectedShippingRate}
      methodDesc={selectedShippingRate?.methodDescription}
      shippingMethod={
        shippingMethod as unknown as {
          shippingMethods: ShippingArrayDataType[];
        }
      }
    />
  );
};

export default Shipping;
