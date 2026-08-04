"use client";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { useDisclosure } from "@heroui/react";
import { useAppSelector } from "@/store/hooks";
import OpenCart from "./OpenCart";
import { useCartDetail } from "@utils/hooks/useCartDetail";
import { useMediaQuery } from "@utils/hooks/useMediaQueryHook";
import { useBodyScrollLock } from "@utils/hooks/useBodyScrollLock";
import { useState, useSyncExternalStore } from "react";
import { useAddressesFromApi } from "@utils/hooks/getAddress";
import type { CartSummaryView } from "@/types/cart/type";

const CartDrawerPanel = dynamic(() => import("./CartDrawerPanel"), {
  ssr: false,
});

interface CartModalProps {
  children?: React.ReactNode;
  className?: string;
  onOpen?: () => void;
  onClose?: () => void;
  isOpen?: boolean;
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

  const [hasOpened, setHasOpened] = useState(false);

  useBodyScrollLock(finalIsOpen && !isDesktop);

  const handleOpen = () => {
    setHasOpened(true);
    finalOnOpen?.();
  };

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
        onClick={handleOpen}
      >
        {children ? children : <OpenCart quantity={cartData?.itemsQty} />}
      </button>

      {(hasOpened || finalIsOpen) && (
        <CartDrawerPanel
          isOpen={!!finalIsOpen}
          onClose={finalOnClose}
          onOpenChange={handleOpenChange}
          cart={cart}
          cartData={cartData}
          billingAddress={billingAddress}
          isDesktop={isDesktop}
        />
      )}
    </>
  );
}
