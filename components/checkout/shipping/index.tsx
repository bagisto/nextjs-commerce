'use client';
import { Radio, RadioGroup, cn } from '@heroui/react';
import RightArrowIcon from 'components/icons/right-arrow';
import { ShippingAddressDataType } from 'lib/bagisto/types';
import { isArray, isObject } from 'lib/type-guards';
import Link from 'next/link';
import { useFormState } from 'react-dom';
import { createShippingMethod } from '../action';
import { ProceedToCheckout } from '../cart/proceed-to-checkout';

type CustomRadioProps = {
  children: React.ReactNode;
  description?: string;
  value: string;
} & typeof Radio.defaultProps;

export default function ShippingMethod({
  shippingAddress,
  shippingMethod
}: {
  shippingAddress?: ShippingAddressDataType;
  shippingMethod: any;
}) {
  const getCartShippingMethod = shippingMethod?.cart?.shippingMethod;
  const initialState = {
    shippingMethods: getCartShippingMethod || ''
  };

  const [state, formAction] = useFormState(createShippingMethod, initialState);
  const getShippingMethods = shippingMethod?.shippingMethods || [];

  return (
    <div className="my-6 flex flex-col gap-6">
      {isObject(shippingAddress) && (
        <div className="relative my-4 rounded-lg border-[1px] border-solid px-3 dark:border-white/30">
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
            </tbody>
          </table>
        </div>
      )}
      <div className="w-full">
        <form action={formAction}>
          <div className="flex flex-col gap-5">
            <h1 className="text-2xl font-bold">Shipping method</h1>
            {isArray(getShippingMethods) && (
              <RadioGroup label="" defaultValue={state?.shippingMethods} name="shippingMethod">
                {getShippingMethods.map((method: any) => (
                  <CustomRadio
                    className="my-1 border border-solid border-neutral-300 dark:border-neutral-500"
                    key={method?.methods?.code}
                    description={method?.methods?.formattedBasePrice}
                    value={method?.methods?.code}
                  >
                    <span className="text-neutral-700 dark:text-white">
                      {method?.methods?.label}
                    </span>
                  </CustomRadio>
                ))}
              </RadioGroup>
            )}
          </div>
          <div className="my-4 flex flex-col-reverse items-center justify-between gap-4 sm:flex-row sm:gap-0">
            <button className="flex items-center text-blue-600">
              <RightArrowIcon className="" />
              <Link href="/checkout/information" className="mx-1 text-sm">
                Return to information
              </Link>
            </button>
            <div className="w-full sm:w-2/5">
              <ProceedToCheckout buttonName="Continue to payment" />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

const CustomRadio = (props: CustomRadioProps) => {
  const { children, ...otherProps } = props;

  return (
    <Radio
      {...otherProps}
      classNames={{
        base: cn(
          'inline-flex m-0 bg-transparent  hover:bg-transparent items-center',
          'flex-row max-w-full cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent',
          'data-[selected=true]:border-primary'
        )
      }}
    >
      {children}
    </Radio>
  );
};
