import { CURRENCY_CODE, DEFAULT_OPTION, NOT_IMAGE } from "@/utils/constants";
import { GridTileImage } from "@components/theme/ui/grid/Tile";
import { Price } from "@components/theme/ui/Price";
import CartItemAccordion from "./CartItemAccordian";
import Link from "next/link";
import { createUrl, isShippingRequired, safeParse } from "@utils/helper";
import type { CartItemEdge, CartSummaryView } from "@/types/cart/type";


export default function CheckoutCart({
  cartItems,
}: {
  cartItems?: CartSummaryView;
  selectedShippingRate?: string;
}) {
  const cart: CartItemEdge[] = Array.isArray(cartItems?.items?.edges)
    ? cartItems.items.edges
    : [];

  const shippingRequired = isShippingRequired(cartItems);

  return (
    <>
      <CartItemAccordion cartItems={cartItems} />
      <div className="hidden h-full min-h-[100dvh] flex-col justify-between py-4 pl-4 pr-8 lg:flex">
        <div className="">
          <h1 className="p-6 font-outfit text-xl font-medium text-black dark:text-selected-white">
            Order Summary
          </h1>
          <ul className="m-0 flex max-h-[calc(100dvh-292px)] flex-col gap-y-6 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-500 dark:scrollbar-thumb-neutral-300 lg:h-[calc(100dvh-124px)] lg:overflow-hidden lg:overflow-y-auto">
            {cart.map((item, i) => {
              const node = item?.node;
              const merchandiseUrl = createUrl(
                `/product/${node?.productUrlKey}`,
                new URLSearchParams(),
              );
              const baseImage = safeParse(node?.baseImage) as
                | { medium_image_url?: string; small_image_url?: string }
                | undefined;

                return (
                  <li key={i} className="flex w-full flex-col">
                    <div className="relative flex w-full flex-row justify-between">
                      <Link
                        className="z-30 flex flex-row items-start space-x-4"
                        aria-label={`${item?.node?.name}`}
                        href={merchandiseUrl}
                      >
                        <div className="relative h-[120px] w-[120px] cursor-pointer rounded-[15.73px] bg-neutral-100 xl:h-[161.78px] xl:w-[194px] overflow-hidden">
                          <GridTileImage
                             alt={item?.node?.name}
                             className="h-full w-full object-cover"
                             height={200}
                             rounded="rounded-[15.73px]"
                             src={baseImage?.medium_image_url || baseImage?.small_image_url || ""}
                             width={200}
                             onError={(e) => (e.currentTarget.src = NOT_IMAGE)}
                           />
                        </div>
                        <div className="flex flex-1 flex-col text-base items-start">
                          <h1 className="font-outfit text-lg font-medium">
                            {item?.node?.name}
                          </h1>
                          {item?.node?.name !== DEFAULT_OPTION ? (
                            <p className="text-sm font-normal text-selected-black dark:text-selected-white">
                              {item?.node?.sku}
                            </p>
                          ) : null}
                          <span className="font-normal text-black dark:text-white">
                            Quantity : {item?.node?.quantity}
                          </span>
                          <div className="block h-16 xl:hidden">
                            <Price
                              amount={item?.node?.price}
                              className="space-y-2 text-start font-outfit text-lg font-medium xl:text-right"
                              currencyCode={"USD"}
                            />
                          </div>
                        </div>
                      </Link>
                      <div className="hidden h-16 xl:block">
                        <Price
                          amount={item?.node?.price}
                          className="space-y-2 text-start font-outfit text-lg font-medium xl:text-right"
                          currencyCode={"USD"}
                        />
                      </div>
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>
        <div className="px-4 py-4 text-sm text-selected-black dark:text-selected-white">
          <div className="mb-3 flex items-center justify-between pb-1">
            <p className="text-black[60%] font-outfit text-base font-normal">
              Subtotal
            </p>
            <Price
              amount={cartItems?.subtotal || "0"}
              className="text-right text-base text-black dark:text-white"
              currencyCode={CURRENCY_CODE}
            />
          </div>
          {shippingRequired && (
            <div className="mb-3 flex items-center justify-between pb-1 pt-1">
              <p className="text-black[60%] font-outfit text-base font-normal">
                {" "}
                Shipping
              </p>
              {cartItems?.shippingAmount ? (
                <Price
                  amount={cartItems?.shippingAmount}
                  className="text-right text-base text-black dark:text-white"
                  currencyCode={CURRENCY_CODE}
                />
              ) : (
                <p className="text-right text-base">Calculated at Next Step</p>
              )}
            </div>
          )}
          <div className="my-6 flex items-center justify-between">
            <p className="font-outfit text-2xl font-normal text-black/[60%] dark:text-white">
              Grand Total
            </p>
            <Price
              amount={cartItems?.grandTotal || "0"}
              className="text-right font-outfit text-2xl font-normal text-black dark:text-white"
              currencyCode={CURRENCY_CODE}
            />
          </div>
        </div>
      </div>
    </>
  );
}
