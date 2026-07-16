"use client";

import { CartCheckoutPageSkeleton } from "@/components/common/skeleton/CheckoutSkeleton";
import { useQuery } from "@apollo/client/react";
import ShippingMethod from "./ShippingMethod";
import { FC } from "react";
import { ShippingMethodType } from "@components/checkout/type";
import { GET_CHECKOUT_SHIPPING_RATES } from "@/graphql";
import { getCartToken } from "@/utils/getCartToken";
import { GetCheckoutShippingRatesData, CheckoutShippingRate } from "@/types/checkout/type";

const Shipping: FC<{
  selectedShippingRate?: string;
  currentStep?: string;
}> = ({ selectedShippingRate, currentStep }) => {
  const token = getCartToken();

  const { data, loading: isLoading } = useQuery<GetCheckoutShippingRatesData>(GET_CHECKOUT_SHIPPING_RATES, {
    variables: { token: token || "" },
    skip: !token,
    fetchPolicy: "cache-first",
    nextFetchPolicy: "cache-first",
  });

  if (isLoading && !data) {
    return <CartCheckoutPageSkeleton />;
  }

  

  const uniqueShippingMethods = data?.collectionShippingRates?.reduce(
    (acc: ShippingMethodType[], current: CheckoutShippingRate) => {
      const exists = acc.find((item) => item.method === current.method);
      return exists ? acc : acc.concat([current]);
    },
    [],
  );

  return (
    <ShippingMethod
      shippingMethod={uniqueShippingMethods}
      selectedShippingRate={selectedShippingRate}
      currentStep={currentStep}
    />
  );
};

export default Shipping;
