"use client";

import { GET_CHECKOUT_ADDRESSES } from "@/graphql";
import { GetCheckoutAddressesData } from "@/types/checkout/type";
import { useLazyQuery } from "@apollo/client/react";
import { useCallback } from "react";

export const useAddress = () => {
  const [fetchAddresses, { data, loading: isLoading, refetch }] = useLazyQuery<GetCheckoutAddressesData>(
    GET_CHECKOUT_ADDRESSES,
    {
      fetchPolicy: "cache-first",
      notifyOnNetworkStatusChange: true,
    }
  );

  const getAddresses = useCallback(async () => {
    try {
      await fetchAddresses();
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  }, [fetchAddresses]);

  return {
    addresses:
      data?.collectionGetCheckoutAddresses?.edges?.map(
        (edge) => edge.node
      ) || [],
    isLoading,
    refetch,
    getAddresses,
  };
};
