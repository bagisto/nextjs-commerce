"use client";
import { FC, useState } from "react";
import { AddressDataTypes, CountryArrayDataType } from "@/lib/bagisto/types";
import { useQuery } from "@tanstack/react-query";
import { fetchHandler } from "@/lib/fetch-handler";
import { isArray, isObject } from "@/lib/type-guards";
import CustomerAddress from "./customer-address";
import AddressSkeleton from "@/components/skeleton/address-skeleton";
import AddAdressForm from "./add-address-form";
import { TAGS } from "@/lib/constants";

interface ShippingAddressCheckOutProps {
  isGuest?: boolean;
  countries: CountryArrayDataType[];
  billingAddress?: AddressDataTypes;
  shippingAddress?: AddressDataTypes;
  userEmail?: string;
}

const ShippingAddress: FC<ShippingAddressCheckOutProps> = ({
  countries,
  billingAddress,
  shippingAddress,
  userEmail,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: [TAGS?.address],
    refetchOnWindowFocus: false,
    queryFn: async () =>
      fetchHandler({
        url: "/checkout/address",
        method: "GET",
      }),
  });

  const customerAddress = data?.checkoutAddresses;

  return isLoading ? (
    <AddressSkeleton />
  ) : isOpen ? (
    isArray(customerAddress?.addresses) && isObject(customerAddress) ? (
      <CustomerAddress
        addresses={customerAddress as any}
        billingAddress={billingAddress}
        shippingAddress={shippingAddress}
        countries={countries}
        userEmail={userEmail}
      />
    ) : (
      <AddAdressForm userEmail={userEmail} countries={countries} />
    )
  ) : isObject(billingAddress) && isObject(shippingAddress) ? (
    <div className="mt-4 flex items-start justify-between">
      <div className="flex flex-col gap-y-4">
        <div className="flex">
          <p className="w-[184px] text-base font-normal text-black/60 dark:text-white/60">
            Billing Address
          </p>
          <div className="block cursor-pointer rounded-xl max-sm:rounded-lg">
            <div className="flex flex-col">
              <p className="text-base font-medium">
                {`${billingAddress?.firstName || ""} ${billingAddress?.lastName || ""}`}
              </p>
              <p className="text-base font-medium text-zinc-500">
                {`${billingAddress?.companyName} `}
              </p>
            </div>
            <p className="mt-2 text-sm text-zinc-500 max-md:mt-2 max-sm:mt-0">
              {`${billingAddress?.address}, ${billingAddress?.postcode}`}
            </p>
            <p className="text-zinc-500">
              {billingAddress?.city} {billingAddress?.state},
              {billingAddress?.countryName},
            </p>
            <p className="mt-2 text-sm text-zinc-500 max-md:mt-2 max-sm:mt-0">
              {`T : ${billingAddress?.phone}`}
            </p>
            <p></p>
          </div>
        </div>
        <div className="flex">
          <p className="w-[184px] text-base font-normal text-black/60 dark:text-white/60">
            Shipping Address
          </p>
          <div className="block cursor-pointer rounded-xl max-sm:rounded-lg">
            <div className="flex flex-col">
              <p className="text-base font-medium">
                {`${shippingAddress?.firstName || ""} ${shippingAddress?.lastName || ""}`}
              </p>
              <p className="text-base font-medium text-zinc-500">
                {`${shippingAddress?.companyName} `}
              </p>
            </div>
            <p className="mt-2 text-sm text-zinc-500 max-md:mt-2 max-sm:mt-0">
              {`${shippingAddress?.address}, ${shippingAddress?.postcode}`}
            </p>
            <p className="text-zinc-500">
              {shippingAddress?.city} {shippingAddress?.state},
              {shippingAddress?.countryName},
            </p>
            <p className="mt-2 text-sm text-zinc-500 max-md:mt-2 max-sm:mt-0">
              {`T : ${shippingAddress?.phone}`}
            </p>
            <p></p>
          </div>
        </div>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="cursor-pointer text-base font-normal text-black/[60%] underline dark:text-neutral-300"
      >
        Change
      </button>
    </div>
  ) : isArray(customerAddress?.addresses) && isObject(customerAddress) ? (
    <CustomerAddress
      addresses={customerAddress as any}
      billingAddress={billingAddress}
      shippingAddress={shippingAddress}
      countries={countries}
      userEmail={userEmail}
    />
  ) : (
    <AddAdressForm userEmail={userEmail} countries={countries} />
  );
};

export default ShippingAddress;
