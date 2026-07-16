"use client";
import clsx from "clsx";
import { useDisclosure } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@heroui/drawer";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { CURRENCY_CODE, DEFAULT_OPTION } from "@/utils/constants";
import { useAppSelector } from "@/store/hooks";
import OpenCart from "./OpenCart";
import { Price } from "../theme/ui/Price";
import CloseCart from "../common/icons/cart/CloseCart";
import { DeleteItemButton } from "../common/icons/cart/DeleteItemButton";
import { EditItemQuantityButton } from "../common/icons/cart/EditItemQuantityButton";
import { useCartDetail } from "@utils/hooks/useCartDetail";
import { NextImage } from "@components/common/NextImage";
import { isObject } from "@utils/type-guards";
import LoadingDots from "@components/common/icons/LoadingDots";
import { useFormStatus } from "react-dom";
import { redirectToCheckout } from "@/utils/actions";
import { EMAIL, getLocalStorage } from "@/store/local-storage";
import Link from "next/link";
import { createUrl, isCheckout, safeParse } from "@utils/helper";
import { useMediaQuery } from "@utils/hooks/useMediaQueryHook";
import { useBodyScrollLock } from "@utils/hooks/useBodyScrollLock";
import { useSyncExternalStore } from "react";
import { useAddressesFromApi } from "@utils/hooks/getAddress";
import MobileNavHeader from "../layout/navbar/MobileNavHeader";
import { HideMainNavOnMobile } from "@/components/common/HideMainNavOnMobile";
import type { CartItemEdge, CartSummaryView } from "@/types/cart/type";

interface CartModalProps {
  children?: React.ReactNode;
  className?: string;
  onOpen?: () => void;
  onClose?: () => void;
  isOpen?: boolean;
}

function EmptyCart() {
  return (
    <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
      <ShoppingCartIcon className="h-16" />
      <p className="mt-6 text-center text-2xl font-bold">Your cart is empty.</p>
    </div>
  );
}

function CartLineItem({
  item,
  onClose,
  isDesktop,
}: {
  item: CartItemEdge;
  onClose?: () => void;
  isDesktop: boolean;
}) {
  const node = item?.node;
  const merchandiseUrl = createUrl(
    `/product/${node?.productUrlKey}`,
    new URLSearchParams({ backUrl: "/cart" }),
  );
  const baseImage = safeParse(node?.baseImage) as
    | { small_image_url?: string }
    | undefined;

  return (
    <li className="flex w-full flex-col">
      <div
        className={clsx(
          "flex w-full flex-row justify-between px-1 py-4",
          isDesktop ? "gap-3" : "gap-1 xxs:gap-3",
        )}
      >
        <Link
          className="z-30 flex flex-row space-x-4"
          aria-label={node?.name}
          href={merchandiseUrl}
          onClick={onClose}
        >
          <div className="relative h-16 w-16 cursor-pointer overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
            <NextImage
              alt={node?.name || ""}
              src={baseImage?.small_image_url || ""}
              width={74}
              height={64}
              sizes="64px"
            />
          </div>

          <div className="flex flex-1 flex-col text-base">
            <span className="line-clamp-1 font-outfit text-base font-medium">
              {node?.name}
            </span>
            {node?.name !== DEFAULT_OPTION && (
              <p className="line-clamp-1 text-sm lowercase text-black dark:text-selected-white">
                {node?.sku}
              </p>
            )}
          </div>
        </Link>

        <div className="flex h-16 flex-col justify-between">
          <Price
            amount={node?.price}
            className="flex justify-end space-y-2 text-right font-outfit text-base font-medium"
            currencyCode={CURRENCY_CODE}
          />
          <div className="flex items-center gap-x-2">
            <DeleteItemButton item={item} />
            <div className="ml-auto flex h-9 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700">
              <EditItemQuantityButton
                item={item}
                type="minus"
                disabled={node?.canChangeQty === false}
              />
              <p className="w-6 text-center">
                <span className="w-full text-sm">{node?.quantity}</span>
              </p>
              <EditItemQuantityButton
                item={item}
                type="plus"
                disabled={node?.canChangeQty === false}
              />
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

function CartSummary({
  cart,
  billingAddress,
}: {
  cart: CartSummaryView;
  billingAddress: unknown;
}) {
  return (
    <div className="border-0 border-t border-solid border-neutral-200 py-4 text-sm text-selected-black dark:border-dark-grey dark:text-selected-white">
      {(cart?.taxAmount ?? 0) > 0 && (
        <div className="mb-3 flex items-center justify-between">
          <p className="text-base font-normal text-black/[60%] dark:text-white">
            Taxes
          </p>
          <Price
            amount={cart?.taxAmount}
            className="text-right text-base font-medium text-black dark:text-white"
            currencyCode={CURRENCY_CODE}
          />
        </div>
      )}
      <div className="mb-3 flex items-center justify-between pb-1">
        <p className="text-base font-normal text-black/[60%] dark:text-white">
          Total
        </p>
        <Price
          amount={cart?.grandTotal}
          className="text-right text-base font-medium text-black dark:text-white"
          currencyCode={CURRENCY_CODE}
        />
      </div>

      <form action={redirectToCheckout}>
        <CheckoutButton
          cartDetails={cart?.items?.edges ?? []}
          isGuest={!!cart?.isGuest}
          isEmail={cart?.customerEmail ?? getLocalStorage(EMAIL)}
          isSelectShipping={cart?.selectedShippingRate != null}
          isSelectAddress={isObject(billingAddress)}
          isSelectPayment={cart?.paymentMethod != null}
        />
      </form>
    </div>
  );
}

function CartBody({
  cart,
  cartData,
  billingAddress,
  onClose,
  isDesktop,
}: {
  cart: CartItemEdge[];
  cartData: CartSummaryView;
  billingAddress: unknown;
  onClose?: () => void;
  isDesktop: boolean;
}) {
  if (cart.length === 0) return <EmptyCart />;

  return (
    <div className="flex h-full flex-col justify-between overflow-hidden">
      <ul className="my-0 flex-grow overflow-auto py-0">
        {cart.map((item, i) => (
          <CartLineItem
            key={item?.node?.id ?? i}
            item={item}
            onClose={onClose}
            isDesktop={isDesktop}
          />
        ))}
      </ul>
      <CartSummary cart={cartData} billingAddress={billingAddress} />
    </div>
  );
}

export default function CartModal({
  children,
  className,
  onOpen,
  onClose,
  isOpen,
}: CartModalProps) {
  const {
    isOpen: internalIsOpen,
    onOpen: internalOnOpen,
    onClose: internalOnClose,
  } = useDisclosure();

  const isControlled = isOpen !== undefined;
  const finalIsOpen = isControlled ? isOpen : internalIsOpen;
  const finalOnOpen = isControlled ? onOpen : internalOnOpen;
  const finalOnClose = isControlled ? onClose : internalOnClose;

  const { isLoading } = useCartDetail();
  const cartDetail = useAppSelector((state) => state.cartDetail);
  const { billingAddress } = useAddressesFromApi(false);
  const cartData: CartSummaryView = cartDetail?.cart ?? {};
  const cart = Array.isArray(cartData?.items?.edges) ? cartData.items.edges : [];
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useBodyScrollLock(finalIsOpen && !isDesktop);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      finalOnClose?.();
    }
  };

  return (
    <>
      <button
        type="button"
        aria-label="Open cart"
        className={clsx(
          className,
          mounted && isLoading ? "cursor-wait" : "cursor-pointer",
        )}
        disabled={mounted ? isLoading : false}
        onClick={finalOnOpen}
      >
        {children ? children : <OpenCart quantity={cartData?.itemsQty} />}
      </button>

      {isDesktop ? (
        <Drawer
          backdrop="blur"
          hideCloseButton={true}
          classNames={{ backdrop: "bg-white/50 dark:bg-black/50" }}
          isOpen={finalIsOpen}
          radius="none"
          onOpenChange={handleOpenChange}
        >
          <DrawerContent>
            {() => (
              <>
                <DrawerHeader className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">My Cart</p>
                    <button
                      aria-label="Close cart"
                      className="cursor-pointer"
                      onClick={finalOnClose}
                    >
                      <CloseCart />
                    </button>
                  </div>
                </DrawerHeader>

                <DrawerBody className="py-0">
                  <CartBody
                    cart={cart}
                    cartData={cartData}
                    billingAddress={billingAddress}
                    onClose={finalOnClose}
                    isDesktop={isDesktop}
                  />
                </DrawerBody>

                <DrawerFooter className="flex flex-col gap-1" />
              </>
            )}
          </DrawerContent>
        </Drawer>
      ) : (
        <AnimatePresence>
          {finalIsOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={finalOnClose}
                className="fixed inset-0 z-40 bg-transparent lg:hidden"
                style={{ bottom: "64px" }}
              />

              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{
                  type: "spring",
                  damping: 30,
                  stiffness: 300,
                  mass: 0.8,
                }}
                className="drawer-scrollbar-hidden fixed inset-x-0 top-0 bottom-16 z-50 flex flex-col overflow-hidden bg-white dark:bg-black lg:hidden"
                style={{
                  top: "0px",
                  bottom: "64px",
                  height: "calc(var(--visual-viewport-height) - 64px)",
                }}
              >
                <HideMainNavOnMobile />
                <MobileNavHeader
                  onBack={finalOnClose}
                  variant="close"
                  hideBack={true}
                />

                <div
                  className={clsx(
                    "drawer-scrollbar-hidden flex-1 overflow-y-auto px-4 py-0",
                    !isDesktop && "!px-2",
                  )}
                >
                  <CartBody
                    cart={cart}
                    cartData={cartData}
                    billingAddress={billingAddress}
                    onClose={finalOnClose}
                    isDesktop={isDesktop}
                  />
                </div>

                <div className="p-4" />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}
    </>
  );
}

function CheckoutButton({
  cartDetails,
  isGuest,
  isEmail,
  isSelectAddress,
  isSelectShipping,
  isSelectPayment,
}: {
  cartDetails: CartItemEdge[];
  isGuest: boolean;
  isEmail: string;
  isSelectAddress: boolean;
  isSelectShipping: boolean;
  isSelectPayment: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <>
      <input
        name="url"
        type="hidden"
        value={isCheckout(
          cartDetails,
          isGuest,
          isEmail,
          isSelectAddress,
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
