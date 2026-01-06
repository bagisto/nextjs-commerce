import { DEFAULT_OPTION } from "@/utils/constants";
import { Price } from "@components/theme/ui/Price";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { createUrl } from "@utils/helper";
import Image from "next/image";
import Link from "next/link";

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function CartItemAccordion({
  cartItems,
}: {
  cartItems: any;
}) {

  const cart = Array.isArray(cartItems?.items?.edges)
    ? cartItems?.items?.edges
    : [];

  return (
    <div className="mobile-heading mx-auto block w-full dark:bg-transparent lg:hidden">
      <Accordion selectionMode="multiple" className="px-0" >
        <AccordionItem
          key="1"
          indicator={({ isOpen }) =>
            isOpen ? (
              <ChevronLeftIcon className="h-5 w-5 stroke-neutral-800 dark:stroke-white" />
            ) : (
              <ChevronRightIcon className="h-5 w-5 stroke-neutral-800 dark:stroke-white" />
            )
          }
          aria-label="Accordion 1"
          title="Show order summary"
          subtitle={
            <Price
              className=""
              amount={cartItems?.grandTotal || "0"}
              currencyCode={"USD"}
            />
          }
        >
          <div className="flex h-full flex-col justify-between overflow-hidden">
            <ul className="flex-grow overflow-auto py-4">
              {cart?.map((item : any, i : number) => {
                const merchandiseSearchParams = {} as MerchandiseSearchParams;
                                const merchandiseUrl = createUrl(
                                  `/product/${item?.node.productId}?type=${item?.node.type}`,
                                  new URLSearchParams(merchandiseSearchParams)
                                );
                                const baseImage = JSON.parse(item?.node?.baseImage);
                return (
                  <li key={i} className="flex w-full flex-col">
                    <div className="relative flex w-full flex-row justify-between px-1 py-4">
                      <Link
                        href={merchandiseUrl}
                        className="z-30 flex flex-row items-center space-x-4"
                      >
                        <div className="relative h-16 w-16 cursor-pointer overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                          <Image
                            className="h-full w-full object-cover"
                            width={64}
                            height={64}
                             alt={item?.node?.baseImage || item?.product?.name}
                            src={baseImage?.small_image_url || ""}
                          />
                        </div>

                        <div className="flex flex-1 flex-col text-base">
                          <span className="leading-tight text-neutral-900 dark:text-white">
                            {item?.node?.name}
                          </span>
                          <span className="font-normal text-black dark:text-white">
                            Quantity : {item.node.quantity}
                          </span>
                          {item.name !== DEFAULT_OPTION ? (
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                               {item?.node?.sku}
                            </p>
                          ) : null}
                        </div>
                      </Link>
                      <div className="flex h-16 flex-col justify-between text-black/[60%] dark:!text-neutral-300">
                        <Price
                          className="flex justify-end space-y-2 text-right text-sm"
                         amount={item?.node?.price}
                          currencyCode={"USD"}
                        />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="py-4 text-sm text-neutral-500 dark:text-neutral-400">
              <div className="mb-3 flex items-center justify-between pb-1">
                <p className="text-black[60%] font-outfit text-base font-normal dark:text-white">
                  Subtotal
                </p>
                <Price
                  className="text-right text-base text-black dark:text-white"
                  amount={cartItems?.subtotal || "0"}
                  currencyCode={"USD"}
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
                    currencyCode={"USD"}
                  />
                ) : (
                  <p className="text-right text-base">
                    Calculated at Next Step
                  </p>
                )}
              </div>
              <div className="mb-3 flex items-center justify-between pb-1 pt-1">
                <p className="text-xl font-bold dark:text-white">Total</p>
                <Price
                  className="text-right text-base text-black dark:text-white"
                  amount={cartItems?.grandTotal || "0"}
                  currencyCode={"USD"}
                />
              </div>
            </div>
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
