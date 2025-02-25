'use client';
import RightArrowIcon from 'components/icons/right-arrow';
import { ShippingAddressDataType, selectedPaymentMethodType } from 'lib/bagisto/types';
import { isObject } from 'lib/type-guards';
import Link from 'next/link';
import { useFormState } from 'react-dom';
import { placeOrder } from '../action';
import { ProceedToCheckout } from '../cart/proceed-to-checkout';
export default function PlaceOrderPage({
  selectedPayment,
  shippingAddress,
  selectedShipping
}: {
  selectedPayment?: selectedPaymentMethodType;
  shippingAddress?: ShippingAddressDataType;
  selectedShipping: any;
}) {
  /* eslint-disable no-unused-vars */
  const [state, formAction] = useFormState(placeOrder, null);

  return (
    <div className="my-5 flex-col">
      <div className="relative my-4 rounded-sm border-[1px] border-solid px-3 dark:border-white/30">
        {isObject(shippingAddress) && (
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <tbody>
              <tr className="border-b dark:border-gray-700">
                <td className="py-4">Contact</td>
                <th
                  scope="row"
                  className="break-all px-6 py-4 font-medium text-gray-900 dark:text-white"
                >
                  {shippingAddress?.email}
                </th>
                <td className="py-4">
                  <Link
                    href="/checkout/information"
                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    Change
                  </Link>
                </td>
              </tr>
              <tr className="border-b dark:border-gray-700">
                <td className="py-4">Ship to</td>
                <th
                  scope="row"
                  className="break-all px-6 py-4 font-medium text-gray-900 dark:text-white"
                >
                  {shippingAddress?.firstName}, {shippingAddress?.lastName},{' '}
                  {shippingAddress?.address}, {shippingAddress?.city}, {shippingAddress?.state},{' '}
                  {shippingAddress?.postcode}, {shippingAddress?.country}
                </th>
                <td className="py-4 text-center">
                  <Link
                    href="/checkout/information"
                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    Change
                  </Link>
                </td>
              </tr>
              <tr className="border-b dark:border-gray-700">
                <td className="py-4">Method</td>
                <th
                  scope="row"
                  className="break-all px-6 py-4 font-medium text-gray-900 dark:text-white"
                >
                  {selectedShipping?.methodTitle}
                </th>
                <td className="py-4 text-center">
                  <Link
                    href="/checkout/shipping"
                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    Change
                  </Link>
                </td>
              </tr>
              <tr className="border-b dark:border-gray-700">
                <td className="py-4">Payment</td>
                <th
                  scope="row"
                  className="break-all px-6 py-4 font-medium text-gray-900 dark:text-white"
                >
                  {selectedPayment?.methodTitle}
                </th>
                <td className="py-4 text-center">
                  <Link
                    href="/checkout/payment"
                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    Change
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
      <div className="flex flex-col gap-6">
        <form action={formAction}>
          <div className="my-4 flex flex-col-reverse items-center justify-between gap-4 sm:flex-row sm:gap-0">
            <button type="button" className="flex items-center text-blue-600">
              <RightArrowIcon className="" />
              <Link href="/checkout/payment" className="mx-1 text-sm">
                Return to payment
              </Link>
            </button>
            <div className="w-full sm:w-2/5">
              <ProceedToCheckout buttonName="Place Order" />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
