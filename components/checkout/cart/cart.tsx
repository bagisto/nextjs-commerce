import LogoSquare from 'components/logo-square';
import Price from 'components/price';
import { getCart } from 'lib/bagisto';
import { DEFAULT_OPTION, BAGISTO_SESSION } from 'lib/constants';
import { isObject } from 'lib/type-guards';
import { createUrl } from 'lib/utils';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import CartItemAccordion from './cart-item-accordian';
const { SITE_NAME } = process.env;
type MerchandiseSearchParams = {
  [key: string]: string;
};
export default async function Cart() {
  const cartId = cookies().get(BAGISTO_SESSION)?.value;

  let cart;
  if (cartId) {
    cart = await getCart();
  }
  return (
    <>
      <div className="flex w-full flex-col gap-6 lg:hidden">
        <div className="mx-auto mt-8 flex items-center px-2 lg:hidden">
          <Link className="flex items-center gap-2 text-black md:pt-1 dark:text-white" href="/">
            <LogoSquare />
            <span className="uppercase">{SITE_NAME}</span>
          </Link>
        </div>
        <CartItemAccordion cartItem={cart} />
      </div>
      <div className="mt-2 hidden max-h-[95dvh] w-full flex-col overflow-hidden bg-transparent px-6 text-sm text-black backdrop-blur-xl lg:flex dark:text-white">
        <ul className="flex-grow overflow-auto py-4">
          {cart?.items?.map((item, i) => {
            const merchandiseSearchParams = {} as MerchandiseSearchParams;
            const merchandiseUrl = createUrl(
              `/product/${item?.product.sku}`,
              new URLSearchParams(merchandiseSearchParams)
            );
            return (
              <li key={i} className="flex w-full flex-col">
                <div className="relative flex w-full flex-row justify-between py-4">
                  <div className="absolute z-40 -mt-2 ml-[52px] flex h-5 w-5 items-center justify-center rounded-full bg-primary dark:bg-white/80">
                    <span className="text-sm font-semibold text-white/60 dark:text-black">
                      {item.quantity}
                    </span>
                  </div>
                  <Link href={merchandiseUrl} className="z-30 flex flex-row items-center space-x-4">
                    <div className="relative h-16 w-16 cursor-pointer overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                      <Image
                        className="h-full w-full object-cover"
                        width={64}
                        height={64}
                        alt={item.product.images?.[0]?.path || item.product.name}
                        src={item.product.images?.[0]?.url || '/image/placeholder.webp'}
                      />
                    </div>
                    <div className="flex flex-1 flex-col text-base">
                      <span className="leading-tight">{item.product.name}</span>
                      {item.name !== DEFAULT_OPTION ? (
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          {item.name}
                        </p>
                      ) : null}
                    </div>
                  </Link>
                  <div className="flex h-16 flex-col justify-between">
                    <Price
                      className="flex justify-end space-y-2 text-right text-sm"
                      amount={item.total}
                      currencyCode={'USD'}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="py-4 text-sm text-neutral-500 dark:text-neutral-400">
          <div className="mb-3 flex items-center justify-between pb-1">
            <p>Subtotal</p>
            <Price
              className="text-right text-base text-black dark:text-white"
              amount={cart?.subTotal || '0'}
              currencyCode={'USD'}
            />
          </div>
          <div className="mb-3 flex items-center justify-between pb-1 pt-1">
            <p>Shipping</p>
            {isObject(cart?.selectedShippingRate) ? (
              <Price
                className="text-right text-base text-black dark:text-white"
                amount={cart?.selectedShippingRate?.price || '0'}
                currencyCode={'USD'}
              />
            ) : (
              <p className="text-right">Calculated at next step</p>
            )}
          </div>
          <div className="mb-3 flex items-center justify-between pb-1 pt-1">
            <p className="text-xl font-bold dark:text-white">Total</p>
            <Price
              className="text-right text-base text-black dark:text-white"
              amount={cart?.grandTotal || '0'}
              currencyCode={'USD'}
            />
          </div>
        </div>
      </div>
    </>
  );
}
