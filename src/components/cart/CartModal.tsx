"use client";
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
import { DEFAULT_OPTION } from "@/utils/constants";
import { useAppSelector } from "@/store/hooks";
import OpenCart from "./OpenCart";
import { Price } from "../theme/ui/Price";
import CloseCart from "../common/icons/cart/CloseCart";
import { DeleteItemButton } from "../common/icons/cart/DeleteItemButton";
import { EditItemQuantityButton } from "../common/icons/cart/EditItemQuantityButton";
import { useCartDetail } from "@utils/hooks/useCartDetail";
import Image from "next/image";
import { NOT_IMAGE } from "@utils/constants";
import { isObject } from "@utils/type-guards";
import LoadingDots from "@components/common/icons/LoadingDots";
import { useFormStatus } from "react-dom";
import { redirectToCheckout } from "@/utils/actions";
import { EMAIL, getLocalStorage } from "@/store/local-storage";
import Link from "next/link";
import { createUrl, isCheckout } from "@utils/helper";


type MerchandiseSearchParams = {
  [key: string]: string;
};
export default function CartModal() {
  const { isLoading } = useCartDetail();
  const cartDetail = useAppSelector((state) => state.cartDetail);
  const cart = Array.isArray(cartDetail?.cart?.items?.edges) ? cartDetail?.cart?.items?.edges : [];
  const cartObj: any = cartDetail?.cart ?? {};
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <button
        aria-label="Open cart"
        className={clsx(isLoading ? "cursor-wait" : "cursor-pointer")}
        disabled={isLoading}
        onClick={onOpen}
      >
        <OpenCart quantity={cartDetail?.cart?.itemsQty} />
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
                {(cart?.length === 0) ? (
                  <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
                    <ShoppingCartIcon className="h-16" />
                    <p className="mt-6 text-center text-2xl font-bold">
                      Your cart is empty.
                    </p>
                  </div>
                ) : (
                  <div className="flex h-full flex-col justify-between overflow-hidden">
                    <ul className="my-0 flex-grow overflow-auto py-0">
                      {Array.isArray(cart) &&
                        cart && cart?.map((item: any, i: number) => {
                          const merchandiseSearchParams =
                            {} as MerchandiseSearchParams;

                          const merchandiseUrl = createUrl(
                            `/product/${item?.node.productId}?type=${item?.node.type}`,
                            new URLSearchParams(merchandiseSearchParams)
                          );
                          const baseImage = JSON.parse(item?.node?.baseImage);

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
                                    {item.name !== DEFAULT_OPTION ? (
                                      <p className="text-sm text-black dark:text-neutral-400">
                                        {item?.node?.sku}
                                      </p>
                                    ) : null}
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
                                      <EditItemQuantityButton
                                        item={item}
                                        type="minus"
                                      />
                                      <p className="w-6 text-center">
                                        <span className="w-full text-sm">
                                          {item?.node?.quantity}
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
                          amount={(cartDetail as any)?.cart?.taxAmount}
                          className="text-right text-base font-medium text-black dark:text-white"
                          currencyCode={"USD"}
                        />
                      </div>

                      {/* <div className="mb-3 flex items-center justify-between pb-1">
                        <p className="text-base font-normal text-black/[60%] dark:text-white">
                          Shipping
                        </p>
                        {isObject((cartDetail as any)?.cart?.shippingAmount) ? (
                          <Price
                            amount={(cartDetail as any)?.cart?.shippingAmount}
                            className="text-right text-base text-black dark:text-white"
                            currencyCode={"USD"}
                          />
                        ) : (
                          <p className="text-right text-base">
                            Calculated at Next Step
                          </p>
                        )}
                      </div> */}

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
                    </div>

                    <form action={redirectToCheckout}>
                      <CheckoutButton
                        cartDetails={cartObj?.items?.edges ?? []}
                        isGuest={cartObj?.isGuest}
                        isEmail={cartObj?.customerEmail ?? getLocalStorage(EMAIL)}
                        isSelectShipping={isObject(cartObj?.selectedShippingRate)}
                        isSeclectAddress={isObject(cartObj?.billingAddress)}
                        isSelectPayment={isObject(cartObj?.payment)}
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

function CheckoutButton(
  {
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
  }
) {
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
        {
          pending ? <LoadingDots className="bg-white" /> :
            "Proceed to Checkout"
        }
      </button>
    </>
  );
}

