"use client";
import type { CartItem } from "@/lib/bagisto/types";
import Image from "next/image";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import clsx from "clsx";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@heroui/drawer";
import { useDisclosure } from "@heroui/react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useCartDetail } from "../hooks/use-cart-detail";

import { redirectToCheckout } from "./actions";
import CloseCart from "./close-cart";
import { DeleteItemButton } from "./delete-item-button";
import { EditItemQuantityButton } from "./edit-item-quantity-button";
import OpenCart from "./open-cart";

import { isObject } from "@/lib/type-guards";
import { createUrl, isCheckout } from "@/lib/utils";
import { DEFAULT_OPTION, NOT_IMAGE } from "@/lib/constants";
import Price from "@/components/price";
import LoadingDots from "@/components/loading-dots";
import { useAppSelector } from "@/store/hooks";
import { EMAIL, getLocalStorage } from "@/store/local-storage";
type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function CartModal() {
  const { isLoading } = useCartDetail();
  const cartDetail = useAppSelector((state) => state.cartDetail);

  const cart = cartDetail?.cart;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <button
        aria-label="Open cart"
        className={clsx(isLoading ? "cursor-wait" : "cursor-pointer")}
        disabled={isLoading}
        onClick={onOpen}
      >
        <OpenCart quantity={cart?.itemsQty} />
      </button>
      <Drawer
        backdrop="blur"
        hideCloseButton={true}
        classNames={{ backdrop: "bg-white/50 dark:bg-black/50" }}
        isOpen={isOpen}
        radius="none"
        onOpenChange={onOpenChange}
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold">My Cart</p>
                  <button
                    aria-label="Close cart"
                    className="cursor-pointer"
                    onClick={onClose}
                  >
                    <CloseCart />
                  </button>
                </div>
              </DrawerHeader>
              <DrawerBody className="py-0">
                {typeof cart === "undefined" || !isObject(cart) ? (
                  <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
                    <ShoppingCartIcon className="h-16" />
                    <p className="mt-6 text-center text-2xl font-bold">
                      Your cart is empty.
                    </p>
                  </div>
                ) : (
                  <div className="flex h-full flex-col justify-between overflow-hidden">
                    <ul className="my-0 flex-grow overflow-auto py-0">
                      {cart?.items?.map((item: CartItem, i: number) => {
                        const merchandiseSearchParams =
                          {} as MerchandiseSearchParams;
                        const merchandiseUrl = createUrl(
                          `/product/${item?.product.urlKey}?type=${item?.product?.type}`,
                          new URLSearchParams(merchandiseSearchParams)
                        );

                        return (
                          <li key={i} className="flex w-full flex-col">
                            <div className="flex w-full flex-row justify-between px-1 py-4">
                              <Link
                                className="z-30 flex flex-row space-x-4"
                                href={merchandiseUrl}
                                onClick={onClose}
                              >
                                <div className="relative h-16 w-16 cursor-pointer overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                                  <Image
                                    alt={
                                      item?.product.images?.at(0)?.path ||
                                      item?.product?.name
                                    }
                                    className="h-full w-full object-cover"
                                    height={64}
                                    src={
                                      item?.product.cacheBaseImage?.at(0)
                                        ?.smallImageUrl ??
                                      (item?.product.images?.at(0)?.url as any)
                                    }
                                    width={74}
                                    onError={(e) =>
                                      (e.currentTarget.src = NOT_IMAGE)
                                    }
                                  />
                                </div>

                                <div className="flex flex-1 flex-col text-base">
                                  <span className="line-clamp-1 font-outfit text-base font-medium">
                                    {item.product.name}
                                  </span>
                                  {item.name !== DEFAULT_OPTION ? (
                                    <p className="text-sm text-black dark:text-neutral-400">
                                      {item.sku}
                                    </p>
                                  ) : null}
                                </div>
                              </Link>
                              <div className="flex h-16 flex-col justify-between">
                                <Price
                                  amount={item.total}
                                  className="flex justify-end space-y-2 text-right font-outfit text-base font-medium"
                                  currencyCode={cart?.cartCurrencyCode}
                                />
                                <div className="flex items-center gap-x-2">
                                  <DeleteItemButton item={item} />
                                  <div className="ml-auto flex h-9 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700">
                                    <EditItemQuantityButton
                                      item={item}
                                      type="minus"
                                    />
                                    <p className="w-6 text-center">
                                      <span className="w-full text-sm">
                                        {item.quantity}
                                      </span>
                                    </p>
                                    <EditItemQuantityButton
                                      item={item}
                                      type="plus"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="border-0 border-t border-solid border-neutral-200 py-4 text-sm text-neutral-500 dark:text-neutral-400">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-base font-normal text-black/[60%] dark:text-white">
                          Taxes
                        </p>
                        <Price
                          amount={cart?.taxTotal}
                          className="text-right text-base font-medium text-black dark:text-white"
                          currencyCode={"USD"}
                        />
                      </div>
                      <div className="mb-3 flex items-center justify-between pb-1">
                        <p className="text-base font-normal text-black/[60%] dark:text-white">
                          Shipping
                        </p>
                        {isObject(cart?.selectedShippingRate) ? (
                          <Price
                            amount={cart?.selectedShippingRate?.price || "0"}
                            className="text-right text-base text-black dark:text-white"
                            currencyCode={"USD"}
                          />
                        ) : (
                          <p className="text-right text-base">
                            Calculated at Next Step
                          </p>
                        )}
                      </div>
                      <div className="mb-3 flex items-center justify-between pb-1">
                        <p className="text-base font-normal text-black/[60%] dark:text-white">
                          Total
                        </p>
                        <Price
                          amount={cart?.grandTotal}
                          className="text-right text-base font-medium text-black dark:text-white"
                          currencyCode={"USD"}
                        />
                      </div>
                    </div>
                    <form action={redirectToCheckout}>
                      <CheckoutButton
                        cartDetails={cart?.items}
                        isGuest={cart?.isGuest}
                        isEmail={cart?.customerEmail ?? getLocalStorage(EMAIL)}
                        isSelectShipping={isObject(cart?.selectedShippingRate)}
                        isSeclectAddress={isObject(cart?.billingAddress)}
                        isSelectPayment={isObject(cart?.payment)}
                      />
                    </form>
                  </div>
                )}
              </DrawerBody>
              <DrawerFooter className="flex flex-col gap-1" />
            </>
          )}
        </DrawerContent>
      </Drawer>
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
  cartDetails: Array<CartItem>;
  isGuest: boolean;
  isEmail: string;
  isSeclectAddress : boolean;
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
          isSelectPayment
        )}
      />
      <button
        className={clsx(
          "block w-full rounded-full bg-blue-600 p-3 text-center text-sm font-medium text-white opacity-90 hover:opacity-100",
          pending ? "cursor-wait" : "cursor-pointer"
        )}
        disabled={pending}
        type="submit"
      >
        {pending ? <LoadingDots className="bg-white" /> : "Proceed to Checkout"}
      </button>
    </>
  );
}
