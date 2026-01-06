"use client"

import { useQuery } from "@tanstack/react-query";
import { getCartToken } from "./getCartToken";
import { fetchHandler } from "./fetch-handler";


export const useAddress = () => {
  const token = getCartToken();

  return useQuery({
    queryKey: ["address", token],
    enabled: !!token,
    queryFn: () =>
      fetchHandler({
        url: "checkout/saveAddress",
        method: "POST",
        contentType: true,
        body: { token },
      }),
  });
};
