import { CURRENCY_CODE, DEFAULT_OPTION } from "@/utils/constants";
import { useScrollTo } from "@/utils/hooks/useScrollTo";
import { Price } from "@components/theme/ui/Price";
import { NextImage } from "@components/common/NextImage";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { createUrl, isShippingRequired, safeParse } from "@utils/helper";
import Link from "next/link";
import type { CartItemEdge, CartSummaryView } from "@/types/cart/type";


export default function CartItemAccordion({
  cartItems,
}: {
  cartItems?: CartSummaryView;
}) {
  const cart: CartItemEdge[] = Array.isArray(cartItems?.items?.edges)
    ? cartItems.items.edges
    : [];

  const scrollTo = useScrollTo();
  const shippingRequired = isShippingRequired(cartItems);

  return (
    <div className="mobile-heading fixed bottom-0 left-0 z-50 w-full border-t border-neutral-200 bg-white pb-14
     dark:border-neutral-700 dark:bg-black lg:hidden">
      <Accordion
        selectionMode="multiple"
        className="!px-0"
        onSelectionChange={(e) => {
          const keys = e as Set<string>;
          if (keys.has("1")) {
            setTimeout(() => {
              scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth",
              });
            }, 300);
          }
        }}
      >
        <AccordionItem
          key="1"
          indicator={({ isOpen }) =>
            isOpen ? (
              <ChevronLeftIcon className="h-5 w-5 stroke-neutral-800 dark:stroke-white" />
            ) : (
              <ChevronRightIcon className="h-5 w-5 stroke-neutral-800 dark:stroke-white" />
            )
          }
          classNames={{
    heading: "px-4", 
    content: "px-4" 
  }}
          aria-label="Accordion 1"
          title="Order Summary"
          subtitle={
            <Price
              className=""
              amount={cartItems?.grandTotal || "0"}
              currencyCode={CURRENCY_CODE}
            />
          }
        >
          <div className="flex h-full flex-col justify-between px-4">
            <ul className="flex-grow overflow-y-auto max-h-[300px] py-4 pr-2 -mr-2" style={{ scrollbarWidth: 'thin' }}>
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
                  <li key={node?.id ?? i} className="flex w-full flex-col">
                    <div className="relative flex w-full flex-row justify-between gap-3 px-1 py-4">
                      <Link
                        href={merchandiseUrl}
                        className="z-30 flex flex-row items-center space-x-4"
                        aria-label={node?.name}
                      >
                        <div className="relative h-16 w-16 cursor-pointer overflow-hidden rounded-md border border-neutral-100 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                          <NextImage
                            className="h-full w-full object-cover"
                            width={100}
                            height={100}
                            sizes="64px"
                            alt={node?.name ?? ""}
                            src={
                              baseImage?.medium_image_url ||
                              baseImage?.small_image_url ||
                              ""
                            }
                          />
                        </div>

                        <div className="flex flex-1 flex-col text-base">
                          <span className="leading-tight text-neutral-900 line-clamp-1 dark:text-white">
                            {node?.name}
                          </span>
                          <span className="font-normal text-black dark:text-white">
                            Quantity : {node?.quantity}
                          </span>
                          {node?.name !== DEFAULT_OPTION ? (
                            <p className="text-sm lowercase line-clamp-1 text-selected-black dark:text-selected-white">
                              {node?.sku}
                            </p>
                          ) : null}
                        </div>
                      </Link>
                      <div className="flex h-16 flex-col justify-between text-black/[60%] dark:!text-neutral-300">
                        <Price
                          className="flex justify-end space-y-2 text-right text-sm"
                          amount={node?.price}
                          currencyCode={CURRENCY_CODE}
                        />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="py-4 text-sm text-selected-black dark:text-selected-white">
              <div className="mb-3 flex items-center justify-between pb-1">
                <p className="text-black[60%] font-outfit text-base font-normal dark:text-white">
                  Subtotal
                </p>
                <Price
                  className="text-right text-base text-black dark:text-white"
                  amount={cartItems?.subtotal || "0"}
                  currencyCode={CURRENCY_CODE}
                />
              </div>
              <div className="mb-3 flex items-center justify-between pb-1 pt-1">
                <p className="text-black[60%] font-outfit text-base font-normal dark:text-white">
                  Shipping
                </p>
                {cartItems?.shippingAmount ? (
                  <Price
                    amount={cartItems?.shippingAmount || "0"}
                    className="text-right text-base text-black dark:text-white"
                    currencyCode={CURRENCY_CODE}
                  />
                ) : shippingRequired ? (
                  <p className="text-right text-base">
                    Calculated at Next Step
                  </p>
                ) : (
                  <Price
                    amount={"0"}
                    className="text-right text-base text-black dark:text-white"
                    currencyCode={CURRENCY_CODE}
                  />
                )}
              </div>
              <div className="mb-3 flex items-center justify-between pb-1 pt-1">
                <p className="text-xl font-bold dark:text-white">Total</p>
                <Price
                  className="text-right text-base text-black dark:text-white"
                  amount={cartItems?.grandTotal || "0"}
                  currencyCode={CURRENCY_CODE}
                />
              </div>
            </div>
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
