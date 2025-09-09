"use client";
import { useForm } from "react-hook-form";

import { ProceedToCheckout } from "../cart/proceed-to-checkout";

import { useCheckout } from "@/components/hooks/use-checkout";
import {
  AddressDataTypes,
  selectedPaymentMethodType,
} from "@/lib/bagisto/types";
import { isObject } from "@/lib/type-guards";
export default function OrderReview({
  selectedPayment,
  shippingAddress,
  billingAddress,
  selectedShipping,
}: {
  selectedPayment?: selectedPaymentMethodType;
  shippingAddress?: AddressDataTypes;
  billingAddress?: AddressDataTypes;
  selectedShipping: any;
}) {
  const { isPlaceOrder, SavePlaceOrder } = useCheckout();
  const { handleSubmit } = useForm();
  const onSubmit = () => {
    SavePlaceOrder();
  };

  return (
    <div className="mt-4 flex-col">
      <div className="relative">
        {isObject(shippingAddress) && (
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <tbody>
              <tr className="">
                <td className="py-4">Contact</td>
                <th
                  className="break-all px-6 py-4 font-medium text-gray-900 dark:text-white"
                  scope="row"
                >
                  {shippingAddress?.email}
                </th>
              </tr>
              <tr className="">
                <td className="py-4">Billing to</td>
                <th
                  className="break-all px-6 py-4 font-medium text-gray-900 dark:text-white"
                  scope="row"
                >
                  {billingAddress?.firstName}, {billingAddress?.lastName},{" "}
                  {billingAddress?.address}, {billingAddress?.city},{" "}
                  {billingAddress?.state}, {billingAddress?.postcode},{" "}
                  {billingAddress?.country}
                </th>
              </tr>
              <tr className="">
                <td className="py-4">Ship to</td>
                <th
                  className="break-all px-6 py-4 font-medium text-gray-900 dark:text-white"
                  scope="row"
                >
                  {shippingAddress?.firstName}, {shippingAddress?.lastName},{" "}
                  {shippingAddress?.address}, {shippingAddress?.city},{" "}
                  {shippingAddress?.state}, {shippingAddress?.postcode},{" "}
                  {shippingAddress?.country}
                </th>
              </tr>
              <tr className="">
                <td className="py-4">Method</td>
                <th
                  className="break-all px-6 py-4 font-medium text-gray-900 dark:text-white"
                  scope="row"
                >
                  {selectedShipping?.methodTitle}
                </th>
              </tr>
              <tr className="">
                <td className="py-4">Payment</td>
                <th
                  className="break-all px-6 py-4 font-medium text-gray-900 dark:text-white"
                  scope="row"
                >
                  {selectedPayment?.methodTitle}
                </th>
              </tr>
            </tbody>
          </table>
        )}
      </div>
      <div className="flex flex-col gap-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="justify-self-end">
            <ProceedToCheckout
              buttonName="Place Order"
              pending={isPlaceOrder}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
