"use client";
import { useForm } from "react-hook-form";
import { MappedCheckoutAddress } from "@/types/checkout/type";
import { isObject } from "@/utils/type-guards";
import { useCheckout } from "@utils/hooks/useCheckout";
import { ProceedToCheckout } from "../ProceedToCheckout";
export default function OrderReview({
  selectedPaymentTitle,
  shippingAddress,
  billingAddress,
  selectedShipping : _selectedShipping,
  selectedShippingRateTitle,
  isShippingRequired,
}: {
  selectedPaymentTitle?: string;
  shippingAddress?: MappedCheckoutAddress | null;
  billingAddress?: MappedCheckoutAddress | null;
  selectedShipping?: string;
  selectedShippingRateTitle?: string;
  isShippingRequired?: boolean;
}) {
  const { isPlaceOrder, savePlaceOrder } = useCheckout();
  const { handleSubmit } = useForm();
  const onSubmit = () => {
    savePlaceOrder();
  };

  return (
    <div className="mt-4 flex-col mb-20 sm:mb-0">
      <div className="relative">
        {isObject(shippingAddress) && (
          <table className="w-full text-left text-base text-gray-500 dark:text-gray-400">
            <tbody>
              <tr>
                <td className="w-[184px] shrink-0 py-4 align-top text-black/60 dark:text-selected-white">Contact</td>
                <th
                  className="break-all py-4 font-medium text-gray-900 dark:text-white"
                  scope="row"
                >
                  {shippingAddress?.email}
                </th>
              </tr>
              <tr>
                <td className="w-[184px] shrink-0 py-4 align-top text-black/60 dark:text-selected-white">Billing to</td>
                <th
                  className="break-all py-4 font-medium text-gray-900 dark:text-white"
                  scope="row"
                >
                  {billingAddress?.firstName}, {billingAddress?.lastName},{" "}
                  {billingAddress?.address}, {billingAddress?.city},{" "}
                  {billingAddress?.state}, {billingAddress?.postcode},{" "}
                  {billingAddress?.country}
                </th>
              </tr>
              {isShippingRequired && (
                <tr>
                  <td className="w-[184px] shrink-0 py-4 align-top text-black/60 dark:text-selected-white">Ship to</td>
                  <th
                    className="break-all py-4 font-medium text-gray-900 dark:text-white"
                    scope="row"
                  >
                    {shippingAddress?.firstName}, {shippingAddress?.lastName},{" "}
                    {shippingAddress?.address}, {shippingAddress?.city},{" "}
                    {shippingAddress?.state}, {shippingAddress?.postcode},{" "}
                    {shippingAddress?.country}
                  </th>
                </tr>
              )}
              {isShippingRequired && (
                <tr>
                  <td className="w-[184px] shrink-0 py-4 align-top text-black/60 dark:text-selected-white">Method</td>
                  <th
                    className="break-all py-4 font-medium text-gray-900 dark:text-white"
                    scope="row"
                  >
                    {selectedShippingRateTitle}
                  </th>
                </tr>
              )}
              <tr>
                <td className="w-[184px] shrink-0 py-4 align-top text-black/60 dark:text-selected-white">Payment</td>
                <th
                  className="break-all py-4 font-medium text-gray-900 dark:text-white"
                  scope="row"
                >
                  {selectedPaymentTitle}
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
