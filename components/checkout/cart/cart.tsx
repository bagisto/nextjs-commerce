"use client";

import Link from "next/link";

import CartItemAccordion from "./cart-item-accordian";

import { GridTileImage } from "@/components/grid/tile";
import Price from "@/components/price";
import Prose from "@/components/prose";
import { DEFAULT_OPTION } from "@/lib/constants";
import { isObject } from "@/lib/type-guards";
import { createUrl } from "@/lib/utils";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BagistoCart } from "@/lib/bagisto/types";
type MerchandiseSearchParams = {
  [key: string]: string;
};
export default function Cart({ cart }: { cart: BagistoCart }) {
  const router = useRouter();

  useEffect(() => {
    if (!isObject(cart)) {
      router.replace("/");
    }
  }, []);
  return (
    <>
      <CartItemAccordion cartItem={cart} />
      <div className="hidden h-full min-h-[100dvh] flex-col justify-between py-4 pl-4 pr-12 lg:flex">
        <div className="">
          <h1 className="p-6 font-outfit text-xl font-medium text-black dark:text-neutral-300">
            Order Summary
          </h1>
          <ul className="m-0 flex max-h-[calc(100dvh-292px)] flex-col gap-y-6 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-500 dark:scrollbar-thumb-neutral-300 lg:h-[calc(100dvh-124px)] lg:overflow-hidden lg:overflow-y-auto">
            {cart?.items?.map((item: any, i: number) => {
              const merchandiseSearchParams = {} as MerchandiseSearchParams;
              const merchandiseUrl = createUrl(
                `/product/${item?.product.urlKey}?type=${item?.product.type}`,
                new URLSearchParams(merchandiseSearchParams)
              );

              return (
                <li key={i} className="flex w-full flex-col">
                  <div className="relative flex w-full flex-row justify-between">
                    <Link
                      className="z-30 flex flex-row items-center space-x-4"
                      href={merchandiseUrl}
                    >
                      <div className="relative h-[120px] w-[120px] cursor-pointer rounded-2xl bg-neutral-300 xl:h-[162px] xl:w-[194px]">
                        <GridTileImage
                          fill
                          alt={
                            item.product.images?.[0]?.path || item.product.name
                          }
                          className="h-full w-full object-cover"
                          src={
                            item.product.images?.[0]?.url ||
                            "/image/placeholder.webp"
                          }
                        />
                      </div>
                      <div className="flex flex-1 flex-col text-base">
                        <h1 className="font-outfit text-lg font-medium">
                          {item.product.name}
                        </h1>
                        {item.name !== DEFAULT_OPTION ? (
                          <p className="text-sm font-normal text-neutral-500 dark:text-neutral-400">
                            {item.sku}
                          </p>
                        ) : null}
                        <span className="font-normal text-black dark:text-white">
                          Quantity : {item.quantity}
                        </span>
                        <Prose
                          className="font-sm line-clamp-3 font-outfit font-normal text-black/[60%] dark:!text-neutral-300"
                          html={item?.product.shortDescription}
                        />
                        <div className="block h-16 xl:hidden">
                          <Price
                            amount={item.total}
                            className="space-y-2 text-start font-outfit text-lg font-medium xl:text-right"
                            currencyCode={"USD"}
                          />
                        </div>
                      </div>
                    </Link>
                    <div className="hidden h-16 xl:block">
                      <Price
                        amount={item.total}
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
        <div className="px-4 py-4 text-sm text-neutral-500 dark:text-neutral-400">
          <div className="mb-3 flex items-center justify-between pb-1">
            <p className="text-black[60%] font-outfit text-base font-normal">
              Subtotal
            </p>
            <Price
              amount={cart?.subTotal || "0"}
              className="text-right text-base text-black dark:text-white"
              currencyCode={"USD"}
            />
          </div>
          <div className="mb-3 flex items-center justify-between pb-1 pt-1">
            <p className="text-black[60%] font-outfit text-base font-normal">
              {" "}
              Shipping
            </p>
            {isObject(cart?.selectedShippingRate) ? (
              <Price
                amount={cart?.selectedShippingRate?.price || "0"}
                className="text-right text-base text-black dark:text-white"
                currencyCode={"USD"}
              />
            ) : (
              <p className="text-right text-base">Calculated at Next Step</p>
            )}
          </div>
          <div className="my-6 flex items-center justify-between">
            <p className="font-outfit text-2xl font-normal text-black/[60%] dark:text-white">
              Grand Total
            </p>
            <Price
              amount={cart?.grandTotal || "0"}
              className="text-right font-outfit text-2xl font-normal text-black dark:text-white"
              currencyCode={"USD"}
            />
          </div>
        </div>
      </div>
    </>
  );
}
