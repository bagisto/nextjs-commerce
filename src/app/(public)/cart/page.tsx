"use client";

import clsx from "clsx";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { DEFAULT_OPTION, NOT_IMAGE } from "@/utils/constants";
import { useAppSelector } from "@/store/hooks";
import { Price } from "@/components/theme/ui/Price";
import { DeleteItemButton } from "@/components/common/icons/cart/DeleteItemButton";
import { EditItemQuantityButton } from "@/components/common/icons/cart/EditItemQuantityButton";
import { useCartDetail } from "@utils/hooks/useCartDetail";
import Image from "next/image";
import { isObject } from "@utils/type-guards";
import LoadingDots from "@components/common/icons/LoadingDots";
import { useFormStatus } from "react-dom";
import { redirectToCheckout } from "@/utils/actions";
import { EMAIL, getLocalStorage } from "@/store/local-storage";
import Link from "next/link";
import { createUrl, isCheckout, safeParse } from "@utils/helper";
import { useAddressesFromApi } from "@utils/hooks/getAddress";
import MobileNavHeader from "@/components/layout/navbar/MobileNavHeader";
import { notFound } from 'next/navigation'
import { HideMainNavOnMobile } from "@/components/common/HideMainNavOnMobile";

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function CartPage() {
  useCartDetail();
  const cartDetail = useAppSelector((state) => state.cartDetail);
  const { billingAddress } = useAddressesFromApi(false);

  if (typeof window !== "undefined" && window.innerWidth >= 1024) {
    notFound();
  }

  const cart = Array.isArray(cartDetail?.cart?.items?.edges)
    ? cartDetail?.cart?.items?.edges
    : [];
  const cartObj: any = cartDetail?.cart ?? {};

  return (
    <>
      <HideMainNavOnMobile />
      <div
        className="fixed inset-x-0 top-0 bottom-16 z-50 flex flex-col bg-white dark:bg-surface-darkest lg:hidden drawer-scrollbar-hidden overflow-hidden"
        style={{
          top: "0px",
          bottom: "64px",
          height: "calc(var(--visual-viewport-height) - 64px)",
        }}
      >
        <MobileNavHeader hideBack={true} variant="close" />

        <div className="px-4 pt-5">
          <h1 className="text-2xl font-semibold text-black dark:text-white">
            My Cart
          </h1>
        </div>

        <div
          className={clsx(
            "flex-1 overflow-y-auto px-4 py-0 drawer-scrollbar-hidden",
            "!px-2"
          )}
        >
          {cart?.length === 0 ? (
            <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
              <ShoppingCartIcon className="h-16" />
              <p className="mt-6 text-center text-2xl font-bold">
                Your cart is empty.
              </p>
            </div>
          ) : (
            <div className="flex h-full flex-col justify-between">
              <ul className="my-0 flex-grow overflow-auto py-0">
                {Array.isArray(cart) &&
                  cart?.map((item: any, i: number) => {
                    const merchandiseSearchParams = {
                      backUrl: "/cart",
                    } as MerchandiseSearchParams;
                    const merchandiseUrl = createUrl(
                      `/product/${item?.node.productUrlKey}`,
                      new URLSearchParams(merchandiseSearchParams),
                    );
                    const baseImage: any = safeParse(
                      item?.node?.baseImage,
                    );

                    return (
                      <li key={i} className="flex w-full flex-col">
                        <div
                          className={clsx(
                            "flex w-full flex-row justify-between py-4 px-1",
                            "gap-1 xxs:gap-3"
                          )}
                        >
                          <Link
                            className="z-30 flex flex-row space-x-4"
                            aria-label={`${item?.node?.name}`}
                            href={merchandiseUrl}
                          >
                            <div className="relative h-16 w-16 cursor-pointer overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                              <Image
                                alt={
                                  item?.node?.baseImage ||
                                  item?.product?.name
                                }
                                className="h-full w-full object-cover"
                                height={64}
                                src={baseImage?.small_image_url || ""}
                                width={74}
                                onError={(e) =>
                                  (e.currentTarget.src = NOT_IMAGE)
                                }
                              />
                            </div>
                            <div className="flex flex-1 flex-col text-base">
                              <span className="line-clamp-1 font-outfit text-base font-medium">
                                {item?.node?.name}
                              </span>
                              {item.name !== DEFAULT_OPTION && (
                                <p className="text-sm lowercase line-clamp-1 text-black dark:text-selected-white">
                                  {item?.node?.sku}
                                </p>
                              )}
                            </div>
                          </Link>
                          <div className="flex h-16 flex-col justify-between">
                            <Price
                              amount={item?.node?.price}
                              className="flex justify-end space-y-2 text-right font-outfit text-base font-medium"
                              currencyCode={"USD"}
                            />
                            <div className="flex items-center gap-x-2">
                              <DeleteItemButton item={item} />
                              <div className="ml-auto flex h-9 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700">
                                <EditItemQuantityButton item={item} type="minus" />
                                <p className="w-6 text-center"><span className="w-full text-sm">{item?.node?.quantity}</span></p>
                                <EditItemQuantityButton item={item} type="plus" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
              </ul>

              <div className="border-0 border-t border-solid border-neutral-200 dark:border-dark-grey py-8 text-sm text-selected-black dark:text-selected-white">
                {(cartDetail as any)?.cart?.taxAmount > 0 && (
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-base font-normal text-black/[60%] dark:text-white">
                      Taxes
                    </p>
                    <Price
                      amount={(cartDetail as any)?.cart?.taxAmount}
                      className="text-right text-base font-medium text-black dark:text-white"
                      currencyCode={"USD"}
                    />
                  </div>
                )}
                <div className="mb-3 flex items-center justify-between pb-1">
                  <p className="text-base font-normal text-black/[60%] dark:text-white">
                    Total
                  </p>
                  <Price
                    amount={(cartDetail as any)?.cart?.grandTotal}
                    className="text-right text-base font-medium text-black dark:text-white"
                    currencyCode={"USD"}
                  />
                </div>

                <form action={redirectToCheckout}>
                  <CheckoutButton
                    cartDetails={cartObj?.items?.edges ?? []}
                    isGuest={cartObj?.isGuest}
                    isEmail={
                      cartObj?.customerEmail ?? getLocalStorage(EMAIL)
                    }
                    isSelectShipping={
                      cartObj?.selectedShippingRate != null
                    }
                    isSeclectAddress={isObject(billingAddress)}
                    isSelectPayment={cartObj?.paymentMethod != null}
                  />
                </form>
              </div>
            </div>
          )}
        </div>


      </div>
    </>
  );
}

function CheckoutButton({
  cartDetails,
  isGuest,
  isEmail,
  isSeclectAddress,
  isSelectShipping,
  isSelectPayment,
}: {
  cartDetails: Array<any>;
  isGuest: boolean;
  isEmail: string;
  isSeclectAddress: boolean;
  isSelectShipping: boolean;
  isSelectPayment: boolean;
}) {
  const { pending } = useFormStatus();
  const email = isEmail;

  return (
    <>
      <input
        name="url"
        type="hidden"
        value={isCheckout(
          cartDetails,
          isGuest,
          email,
          isSeclectAddress,
          isSelectShipping,
          isSelectPayment,
        )}
      />
      <button
        className={clsx(
          "block w-full rounded-full bg-primary p-3 text-center text-sm font-medium text-white opacity-90 hover:opacity-100",
          pending ? "cursor-wait" : "cursor-pointer",
        )}
        disabled={pending}
        type="submit"
      >
        {pending ? <LoadingDots className="bg-white" /> : "Proceed to Checkout"}
      </button>
    </>
  );
}